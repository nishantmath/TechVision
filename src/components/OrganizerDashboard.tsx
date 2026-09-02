import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Users, 
  Sliders, 
  FileSpreadsheet,
  Plus,
  Radio,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { EventSlug, RegistrationRecord } from '../types';
import { EVENTS_DATA } from '../data/events';

export const OrganizerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | EventSlug>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<{ totalRegistrations: number; byEvent: Record<string, number> }>({
    totalRegistrations: 0,
    byEvent: {
      ideacanvas: 0,
      techspeak: 0,
      innovatex: 0,
      coderush: '0' as any,
      'iic-ignite': 0,
      techvision: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [webhookSavedMessage, setWebhookSavedMessage] = useState<string | null>(null);
  const [testWebhookStatus, setTestWebhookStatus] = useState<{ loading: boolean; message?: string; error?: string } | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [appsScriptCode, setAppsScriptCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/registrations', window.location.origin);
      if (activeTab !== 'all') {
        url.searchParams.set('event', activeTab);
      }
      if (searchQuery.trim()) {
        url.searchParams.set('search', searchQuery.trim());
      }
      url.searchParams.set('limit', '200');

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setTotalCount(data.total || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfigAndCode = async () => {
    try {
      const configRes = await fetch('/api/google-sheets/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setWebhookUrl(configData.webhookUrl || '');
      }

      const codeRes = await fetch('/api/google-sheets/apps-script-code');
      if (codeRes.ok) {
        const codeText = await codeRes.text();
        setAppsScriptCode(codeText);
      }
    } catch (e) {
      console.error('Failed to load Google Sheets config or code:', e);
    }
  };

  useEffect(() => {
    fetchConfigAndCode();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [activeTab, searchQuery]);

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWebhook(true);
    setWebhookSavedMessage(null);
    try {
      const res = await fetch('/api/google-sheets/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      });
      if (res.ok) {
        setWebhookSavedMessage('Google Sheets Webhook URL saved successfully!');
        setTimeout(() => setWebhookSavedMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to save webhook:', err);
    } finally {
      setIsSavingWebhook(false);
    }
  };

  const handleTestWebhook = async () => {
    setTestWebhookStatus({ loading: true });
    try {
      const res = await fetch('/api/google-sheets/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestWebhookStatus({ loading: false, message: data.message });
      } else {
        setTestWebhookStatus({ loading: false, error: data.error || 'Connection failed' });
      }
    } catch (e: any) {
      setTestWebhookStatus({ loading: false, error: e.message });
    }
  };

  const handleExportCsv = () => {
    const exportUrl = `/api/export/csv?event=${activeTab}`;
    window.open(exportUrl, '_blank');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tabs: { label: string; value: 'all' | EventSlug; count: number }[] = [
    { label: 'All Registrations', value: 'all', count: stats.totalRegistrations },
    { label: 'IdeaCanvas', value: 'ideacanvas', count: stats.byEvent?.ideacanvas || 0 },
    { label: 'TechSpeak', value: 'techspeak', count: stats.byEvent?.techspeak || 0 },
    { label: 'InnovateX', value: 'innovatex', count: stats.byEvent?.innovatex || 0 },
    { label: 'CodeRush', value: 'coderush', count: stats.byEvent?.coderush || 0 },
    { label: 'IIC Ignite', value: 'iic-ignite', count: stats.byEvent?.['iic-ignite'] || 0 },
    { label: 'TechVision', value: 'techvision', count: stats.byEvent?.techvision || 0 },
  ];

  return (
    <div id="organizer-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>ORGANIZER ADMINISTRATION & DATA ENGINE</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white">
            Engineer’s Week 2026 Registry Hub
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time participant logs, event-by-event tabs, CSV downloads, and Google Sheets bidirectional sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScriptModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30 hover:border-cyan-500/60 transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Apps Script Setup</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export {activeTab === 'all' ? 'Master' : activeTab} CSV</span>
          </button>
        </div>
      </div>

      {/* Registration Stats Breakdown as required in PRD Section 27 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/40 shadow-lg shadow-cyan-950/20 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            TOTAL REGISTRATIONS
          </span>
          <p className="font-display font-extrabold text-3xl text-white mt-1">
            {stats.totalRegistrations}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all 6 events</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">IDEACANVAS</span>
          <p className="font-display font-bold text-2xl text-white mt-1">{stats.byEvent?.ideacanvas || 0}</p>
          <span className="text-[10px] text-slate-500">Poster Challenge</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">TECHSPEAK</span>
          <p className="font-display font-bold text-2xl text-white mt-1">{stats.byEvent?.techspeak || 0}</p>
          <span className="text-[10px] text-slate-500">Elocution Talks</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">INNOVATEX</span>
          <p className="font-display font-bold text-2xl text-white mt-1">{stats.byEvent?.innovatex || 0}</p>
          <span className="text-[10px] text-slate-500">12h Hackathon</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">CODERUSH</span>
          <p className="font-display font-bold text-2xl text-white mt-1">{stats.byEvent?.coderush || 0}</p>
          <span className="text-[10px] text-slate-500">DSA Challenge</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase block">IIC IGNITE</span>
          <p className="font-display font-bold text-2xl text-white mt-1">{stats.byEvent?.['iic-ignite'] || 0}</p>
          <span className="text-[10px] text-slate-500">Innovation Camp</span>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-blue-400 font-bold uppercase block">TECHVISION</span>
          <p className="font-display font-bold text-2xl text-white mt-1">{stats.byEvent?.techvision || 0}</p>
          <span className="text-[10px] text-slate-500">Awards Gala</span>
        </div>
      </div>

      {/* Google Sheets Webhook Configuration Bar */}
      <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets Integration Status</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste your Google Apps Script Webhook URL to stream new registrations into your spreadsheet automatically.
            </p>
          </div>

          <form onSubmit={handleSaveWebhook} className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder:text-slate-600 focus:outline-none"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSavingWebhook}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 text-xs font-mono font-bold transition-all"
              >
                {isSavingWebhook ? 'Saving...' : 'Save URL'}
              </button>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testWebhookStatus?.loading}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
              >
                {testWebhookStatus?.loading ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </form>
        </div>

        {webhookSavedMessage && (
          <p className="text-emerald-400 text-xs font-mono mt-3 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{webhookSavedMessage}</span>
          </p>
        )}

        {testWebhookStatus && (
          <div className="mt-3 text-xs font-mono">
            {testWebhookStatus.message && (
              <p className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{testWebhookStatus.message}</span>
              </p>
            )}
            {testWebhookStatus.error && (
              <p className="text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{testWebhookStatus.error}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Event Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.value
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeTab === tab.value ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search participant, roll no, college..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Registration ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Participant Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">College & Dept</th>
                <th className="py-3.5 px-4">Roll No / ID</th>
                <th className="py-3.5 px-4">Event Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    <span>Loading registry records...</span>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                    No registrations found matching the current criteria.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.registrationId} className="hover:bg-slate-850/50 transition-colors">
                    {/* Reg ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {reg.registrationId}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(reg.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Event Name */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-white">{reg.eventName}</span>
                    </td>

                    {/* Participant Name */}
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {reg.participant.fullName}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      <div>{reg.participant.email}</div>
                      <div>{reg.participant.phone}</div>
                    </td>

                    {/* College & Dept */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-medium text-slate-200 truncate max-w-[180px]">{reg.participant.college}</div>
                      <div className="text-[11px] text-slate-400">{reg.participant.department} ({reg.participant.year})</div>
                    </td>

                    {/* Student ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-300 whitespace-nowrap">
                      {reg.participant.studentId}
                    </td>

                    {/* Event Specific Preview */}
                    <td className="py-3.5 px-4 text-[11px]">
                      <div className="max-w-xs truncate text-slate-400 font-mono" title={JSON.stringify(reg.eventData)}>
                        {Object.entries(reg.eventData || {})
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' | ')}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Showing {registrations.length} of {totalCount} total entries</span>
          <button
            onClick={fetchRegistrations}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Google Apps Script Setup Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Google Apps Script Webhook Code</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Follow these 4 simple steps to connect your real Google Sheet.
                </p>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
                <p className="font-bold text-cyan-400 uppercase font-mono text-[11px]">Quick Setup Guide:</p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
                  <li>Create a new spreadsheet on Google Sheets named: <strong>ENGINEER'S WEEK 2026 REGISTRATIONS</strong></li>
                  <li>Click <strong>Extensions &gt; Apps Script</strong> from the top menu.</li>
                  <li>Replace existing code with the script below and click <strong>Save</strong>.</li>
                  <li>Click <strong>Deploy &gt; New deployment</strong>, choose <strong>Web app</strong>, set <em>Who has access</em> to <strong>Anyone</strong>, click Deploy and copy the Web App URL!</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between pb-2">
                  <span className="font-mono text-[11px] text-slate-400">Code.gs</span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono flex items-center gap-1.5"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-64">
                  {appsScriptCode}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowScriptModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
