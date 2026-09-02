import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Storage directory for configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxsbCLKrSvpeHrtC6kKb1rkmqcF9MCS3WgJlt2XhB223oMC3p60oWWaY1ao0ZONS5biPw/exec';

function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

function getConfig(): { googleSheetsWebhookUrl: string } {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (cfg && cfg.googleSheetsWebhookUrl) {
        return cfg;
      }
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return {
    googleSheetsWebhookUrl:
      process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL,
  };
}

function saveConfig(config: { googleSheetsWebhookUrl?: string }) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing config file:', err);
  }
}

// Map eventSlug to exact Google Sheet tab event name required by Apps Script:
// IdeaCanvas -> "ideacanvas"
// TechSpeak -> "techspeak"
// InnovateX -> "innovatex"
// CodeRush -> "coderush"
// IIC Ignite -> "iic_ignite"
function mapEventSlugToAppsScriptEvent(eventSlug: string): string {
  const s = (eventSlug || '').toLowerCase().trim();
  if (s === 'ideacanvas') return 'ideacanvas';
  if (s === 'techspeak') return 'techspeak';
  if (s === 'innovatex') return 'innovatex';
  if (s === 'coderush') return 'coderush';
  if (s === 'iic-ignite' || s === 'iic_ignite' || s === 'iicignite') return 'iic_ignite';
  if (s === 'techvision') return 'techvision';
  return s;
}

// Build exact Google Sheets payload without registration ID
function formatPayloadForGoogleSheets(body: {
  eventSlug: string;
  eventName?: string;
  participant: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    department: string;
    year: string;
    studentId: string;
  };
  teamName?: string;
  teamSize?: number;
  teammates?: Array<{
    name: string;
    email: string;
    phone: string;
    rollNo: string;
    department: string;
    year: string;
    college?: string;
    role?: string;
  }>;
  eventData?: Record<string, any>;
}): Record<string, any> {
  const event = mapEventSlugToAppsScriptEvent(body.eventSlug);
  const p = body.participant;
  const isTeam = Boolean(body.teamName || (body.teammates && body.teammates.length > 0));

  const payload: Record<string, any> = {
    event,
  };

  if (isTeam) {
    payload.teamName = (body.teamName || '').trim();
    payload.teamSize = body.teamSize || (body.teammates ? body.teammates.length + 1 : 1);

    // Leader / Member 1
    payload.fullName = p.fullName.trim();
    payload.email = normalizeEmail(p.email);
    payload.phone = p.phone.trim();
    payload.college = p.college.trim();
    payload.department = p.department.trim();
    payload.year = p.year.trim();
    payload.studentId = p.studentId.trim();

    // Teammates (Members 2, 3, 4, ...)
    if (Array.isArray(body.teammates)) {
      body.teammates.forEach((tm, idx) => {
        const memberNum = idx + 2;
        payload[`member${memberNum}Name`] = (tm.name || '').trim();
        payload[`member${memberNum}Email`] = normalizeEmail(tm.email || '');
        payload[`member${memberNum}Phone`] = (tm.phone || '').trim();
        payload[`member${memberNum}College`] = (tm.college || p.college || '').trim();
        payload[`member${memberNum}Department`] = (tm.department || '').trim();
        payload[`member${memberNum}Year`] = (tm.year || '').trim();
        payload[`member${memberNum}RollNo`] = (tm.rollNo || '').trim();
      });
    }
  } else {
    // Individual participant
    payload.fullName = p.fullName.trim();
    payload.email = normalizeEmail(p.email);
    payload.phone = p.phone.trim();
    payload.college = p.college.trim();
    payload.department = p.department.trim();
    payload.year = p.year.trim();
    payload.studentId = p.studentId.trim();
  }

  // Include every event-specific field currently present in each registration form
  if (body.eventData && typeof body.eventData === 'object') {
    for (const [key, value] of Object.entries(body.eventData)) {
      if (
        key !== 'teamLeader' &&
        key !== 'teammatesSummary' &&
        key !== 'teamName' &&
        key !== 'teamSize'
      ) {
        payload[key] = value;
      }
    }
  }

  return payload;
}

// Push to Google Apps Script Webhook
async function pushToGoogleSheetsWebhook(
  payload: any,
  webhookUrl: string
): Promise<{
  success: boolean;
  duplicate?: boolean;
  emailSent?: boolean;
  message?: string;
  error?: string;
}> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, error: 'Google Sheets webhook URL is not configured.' };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const responseText = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(responseText);
    } catch {
      // not JSON
    }

    if (json) {
      if (json.duplicate === true) {
        return {
          success: false,
          duplicate: true,
          error: 'This email is already registered.',
        };
      }

      if (json.success === false) {
        const msg = json.error || json.message || 'Google Sheets rejected submission';
        const isDup =
          String(msg).toLowerCase().includes('already registered') ||
          String(json.message).toLowerCase().includes('already registered');
        return {
          success: false,
          duplicate: isDup,
          error: isDup ? 'This email is already registered.' : msg,
        };
      }

      if (json.success === true) {
        return {
          success: true,
          duplicate: false,
          emailSent: json.emailSent !== false,
          message: json.message,
        };
      }
    }

    if (res.ok) {
      return { success: true, duplicate: false, emailSent: true };
    }

    return { success: false, error: `Google Sheets endpoint returned HTTP ${res.status}` };
  } catch (e: any) {
    console.error('Google Sheets forwarding failed:', e);
    return { success: false, error: e.message || 'Failed to reach Google Sheets endpoint' };
  }
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: "Engineer's Week 2026 Registration Portal", timestamp: new Date().toISOString() });
});

// Google Sheets Config
app.get('/api/google-sheets/config', (req: Request, res: Response) => {
  const config = getConfig();
  res.json({
    webhookUrl: config.googleSheetsWebhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL,
    isConfigured: Boolean(config.googleSheetsWebhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL),
    envOverride: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
  });
});

app.post('/api/google-sheets/config', (req: Request, res: Response) => {
  const { webhookUrl } = req.body;
  saveConfig({ googleSheetsWebhookUrl: (webhookUrl || '').trim() });
  res.json({ success: true, message: 'Google Sheets webhook URL saved successfully.' });
});

// Test Google Sheets Webhook
app.post('/api/google-sheets/test', async (req: Request, res: Response) => {
  const { webhookUrl } = req.body;
  const targetUrl = webhookUrl || getConfig().googleSheetsWebhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'No Google Sheets webhook URL provided.' });
  }

  const testPayload = {
    event: 'coderush',
    fullName: 'System Test Ping',
    email: `ping.${Date.now()}@example.com`,
    phone: '9999999999',
    college: 'Engineering Campus',
    department: 'CSE',
    year: '3rd Year',
    studentId: 'TEST-PING-01',
    preferredLanguage: 'Python',
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
      redirect: 'follow',
    });

    if (response.ok) {
      res.json({ success: true, message: 'Google Sheets Webhook connected and responded with HTTP 200 OK!' });
    } else {
      res.status(400).json({ success: false, error: `Webhook returned status ${response.status} ${response.statusText}` });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: `Failed to reach webhook: ${err.message}` });
  }
});

// Submit Registration
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { eventSlug, eventName, participant, eventData, teamName, teamSize, teammates } = req.body;

    // Strict validation
    if (!eventSlug || !eventName || !participant) {
      return res.status(400).json({
        success: false,
        error: 'Missing required event or participant details.',
      });
    }

    const { fullName, email, phone, college, department, year, studentId } = participant;

    if (!fullName || !email || !phone || !college || !department || !year || !studentId) {
      return res.status(400).json({
        success: false,
        error: 'All common participant fields are mandatory.',
      });
    }

    const normalizedLeaderEmail = normalizeEmail(email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedLeaderEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit phone number.',
      });
    }

    // Check teammate emails syntax for team events
    if (Array.isArray(teammates)) {
      const allSubmittedEmails: string[] = [normalizedLeaderEmail];
      for (const tm of teammates) {
        if (tm && tm.email) {
          const normalizedTmEmail = normalizeEmail(tm.email);
          if (allSubmittedEmails.includes(normalizedTmEmail)) {
            return res.status(400).json({
              success: false,
              error: 'Each team member must have a unique email address.',
            });
          }
          allSubmittedEmails.push(normalizedTmEmail);
        }
      }
    }

    // EVENT-SPECIFIC TEAM REQUIREMENTS:
    // IdeaCanvas: Exactly 3 team members.
    // TechSpeak: Exactly 4 team members.
    // InnovateX: 4–6 team members.
    const mappedEvent = mapEventSlugToAppsScriptEvent(eventSlug);
    if (mappedEvent === 'ideacanvas') {
      const totalCount = 1 + (Array.isArray(teammates) ? teammates.length : 0);
      if (totalCount !== 3) {
        return res.status(400).json({
          success: false,
          error: 'IdeaCanvas requires exactly 3 team members.',
        });
      }
    } else if (mappedEvent === 'techspeak') {
      const totalCount = 1 + (Array.isArray(teammates) ? teammates.length : 0);
      if (totalCount !== 4) {
        return res.status(400).json({
          success: false,
          error: 'TechSpeak requires exactly 4 team members.',
        });
      }
    } else if (mappedEvent === 'innovatex') {
      const totalCount = 1 + (Array.isArray(teammates) ? teammates.length : 0);
      if (totalCount < 4 || totalCount > 6) {
        return res.status(400).json({
          success: false,
          error: 'InnovateX requires between 4 and 6 team members.',
        });
      }
    }

    // Build the exact payload for Google Apps Script
    const googleSheetsPayload = formatPayloadForGoogleSheets(req.body);

    // Get Webhook URL (defaulting to the specified Apps Script Web App endpoint)
    const config = getConfig();
    const webhookUrl = config.googleSheetsWebhookUrl || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;

    // Send data as JSON using POST directly to the Google Apps Script endpoint
    // The Google Sheet backend is the single source of truth for registration & duplicates
    const sheetResult = await pushToGoogleSheetsWebhook(googleSheetsPayload, webhookUrl);

    // If Google Sheets rejected due to duplicate registration
    if (sheetResult.duplicate) {
      return res.status(400).json({
        success: false,
        duplicate: true,
        error: 'This email is already registered.',
      });
    }

    // If submission fails, do NOT show success. Return error.
    if (!sheetResult.success) {
      return res.status(400).json({
        success: false,
        error: sheetResult.error || 'Failed to submit registration to Google Sheets. Please try again.',
      });
    }

    const timestamp = new Date().toISOString();

    const record = {
      eventSlug,
      eventName,
      timestamp,
      participant: {
        fullName: fullName.trim(),
        email: normalizedLeaderEmail,
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim(),
        year: year.trim(),
        studentId: studentId.trim().toUpperCase(),
      },
      teamName: teamName ? teamName.trim() : undefined,
      teamSize: teamSize ? Number(teamSize) : undefined,
      teammates: Array.isArray(teammates) ? teammates : undefined,
      eventData: eventData || {},
      syncedToGoogleSheets: true,
    };

    res.status(201).json({
      success: true,
      record,
      message: 'Registration recorded successfully.',
    });
  } catch (error: any) {
    console.error('Registration processing error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your registration. Please try again.',
    });
  }
});

// Fetch all registrations with stats, search & filtering
app.get('/api/registrations', (req: Request, res: Response) => {
  res.json({
    total: 0,
    filteredTotal: 0,
    stats: {
      totalRegistrations: 0,
      byEvent: {
        ideacanvas: 0,
        techspeak: 0,
        innovatex: 0,
        coderush: 0,
        'iic-ignite': 0,
        techvision: 0,
      },
    },
    page: 1,
    totalPages: 1,
    registrations: [],
  });
});

// Get registration by ID for verification / pass view
app.get('/api/registrations/:regId', (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Registration ID not found.' });
});

// CSV Export for master sheet or event-specific tab
app.get('/api/export/csv', (req: Request, res: Response) => {
  const { event } = req.query;
  const headers = [
    'Timestamp',
    'Event',
    'Team Name',
    'Team Size',
    'Full Name',
    'Email',
    'Phone',
    'College',
    'Department',
    'Year',
    'Student ID',
  ];
  const csvContent = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';
  const filename = `Engineers_Week_2026_${event ? event : 'All_Registrations'}_${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvContent);
});

// Google Apps Script code generator
app.get('/api/google-sheets/apps-script-code', (req: Request, res: Response) => {
  const appsScript = `/**
 * ENGINEER'S WEEK 2026 - GOOGLE APPS SCRIPT WEBHOOK RECEIVER
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet: "ENGINEER'S WEEK 2026 REGISTRATIONS"
 * 2. Click Extensions > Apps Script
 * 3. Delete any default code, paste this entire script, and click Save (Ctrl+S).
 * 4. Click Deploy > New deployment.
 * 5. Select type "Web app".
 * 6. Set Description: "EW2026 Live Webhook"
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": Anyone (even anonymous)
 * 9. Click Deploy, Authorize access, and copy the Web App URL!
 * 10. Paste the Web App URL into the Engineer's Week Organizer Dashboard.
 */

const MASTER_SHEET_NAME = "All Registrations";
const EVENT_TABS = ["IdeaCanvas", "TechSpeak", "InnovateX", "CodeRush", "IIC Ignite", "TechVision"];

function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);
    
    if (data.action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "Pong! Google Apps Script is active." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfMissing(ss);

    // 1. Append to Master Sheet
    const masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
    masterSheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.registrationId,
      data.event,
      data.name,
      data.email,
      "'" + String(data.phone),
      data.college,
      data.department,
      data.year,
      data.studentId,
      data.eventSpecificData || ""
    ]);

    // 2. Append to Event Specific Tab
    const eventTabName = getMatchingTabName(data.event || data.eventSlug);
    if (eventTabName) {
      const eventSheet = ss.getSheetByName(eventTabName);
      if (eventSheet) {
        eventSheet.appendRow([
          data.registrationId,
          data.timestamp || new Date().toISOString(),
          data.name,
          data.email,
          "'" + String(data.phone),
          data.college,
          data.department,
          data.year,
          data.studentId,
          data.eventSpecificData || ""
        ]);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      registrationId: data.registrationId,
      message: "Row written to Master & Event tabs."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getMatchingTabName(eventInput) {
  if (!eventInput) return null;
  const str = String(eventInput).toLowerCase();
  if (str.includes("canvas")) return "IdeaCanvas";
  if (str.includes("speak")) return "TechSpeak";
  if (str.includes("innovate")) return "InnovateX";
  if (str.includes("code")) return "CodeRush";
  if (str.includes("ignite") || str.includes("iic")) return "IIC Ignite";
  if (str.includes("vision")) return "TechVision";
  return null;
}

function setupSheetsIfMissing(ss) {
  // Master Sheet
  let master = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!master) {
    master = ss.insertSheet(MASTER_SHEET_NAME, 0);
    master.appendRow([
      "Timestamp",
      "Registration ID",
      "Event",
      "Full Name",
      "Email",
      "Phone",
      "College",
      "Department",
      "Year",
      "Student ID",
      "Event Specific Data"
    ]);
    master.setFrozenRows(1);
    master.getRange("A1:K1").setBackground("#0f172a").setFontColor("#38bdf8").setFontWeight("bold");
  }

  // Event Specific Sheets
  EVENT_TABS.forEach(tab => {
    let sheet = ss.getSheetByName(tab);
    if (!sheet) {
      sheet = ss.insertSheet(tab);
      sheet.appendRow([
        "Registration ID",
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "College",
        "Department",
        "Year",
        "Student ID",
        "Event Details"
      ]);
      sheet.setFrozenRows(1);
      sheet.getRange("A1:J1").setBackground("#0f172a").setFontColor("#38bdf8").setFontWeight("bold");
    }
  });
}
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(appsScript);
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
