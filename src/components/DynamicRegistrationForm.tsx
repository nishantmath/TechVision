import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Send, 
  RotateCcw, 
  User, 
  Users, 
  UserPlus, 
  UserMinus, 
  Layers, 
  ShieldCheck, 
  Edit3,
  Loader2,
  Info,
  Crown,
  Building2,
  Briefcase
} from 'lucide-react';
import { EventConfig, CommonParticipantInfo, TeammateInfo } from '../types';

interface DynamicRegistrationFormProps {
  event: EventConfig;
  onSubmitSuccess: (record?: any, emailWarning?: string) => void;
  onCancel: () => void;
}

const COMMON_ROLES = [
  'Developer / Full-Stack Coder',
  'Frontend & UI Developer',
  'Backend & Cloud Architect',
  'AI / Machine Learning Engineer',
  'Hardware / Embedded & IoT Specialist',
  'UI/UX Designer & Product Lead',
  'Domain Researcher & Pitch Lead',
  'Cybersecurity & QA Tester',
];

export const DynamicRegistrationForm: React.FC<DynamicRegistrationFormProps> = ({
  event,
  onSubmitSuccess,
  onCancel,
}) => {
  // Step 1: Personal / Team Leader Details, Step 2: Teammates & Event Details, Step 3: Review & Submit
  const skipStep2 = event.noTeammateDetails && (!event.fields || event.fields.length === 0);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Team Details State (for team-based events)
  const minTeamSize = event.minTeamSize || (event.teamBased ? 2 : 1);
  const maxTeamSize = event.maxTeamSize || (event.teamBased ? 4 : 1);
  const [teamName, setTeamName] = useState<string>('');
  const [teamSize, setTeamSize] = useState<number>(event.teamBased ? minTeamSize : 1);

  // Teammates State (Members 2, 3, etc. - excluding Leader who is Member 1)
  const [teammates, setTeammates] = useState<TeammateInfo[]>(() => {
    if (!event.teamBased || event.noTeammateDetails) return [];
    const count = minTeamSize - 1;
    return Array.from({ length: count }, (_, idx) => ({
      name: '',
      email: '',
      phone: '',
      rollNo: '',
      department: '',
      year: '3rd Year',
      college: '',
      role: COMMON_ROLES[idx % COMMON_ROLES.length],
    }));
  });

  // Common Participant / Team Leader Info State
  const [commonInfo, setCommonInfo] = useState<CommonParticipantInfo>({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '3rd Year',
    studentId: '',
  });

  // Event-specific Dynamic Data State
  const [eventData, setEventData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    event.fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        initial[f.name] = f.defaultValue;
      } else if (f.type === 'radio' && f.options && f.options.length > 0) {
        initial[f.name] = '';
      } else if (f.type === 'select' && f.options && f.options.length > 0) {
        initial[f.name] = f.options[0].value;
      } else {
        initial[f.name] = '';
      }
    });
    return initial;
  });

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Auto-scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }, [currentStep]);

  // Handle changing team size
  const handleTeamSizeChange = (newSize: number) => {
    if (newSize < minTeamSize || newSize > maxTeamSize) return;
    setTeamSize(newSize);

    const requiredTeammatesCount = newSize - 1; // Member 1 is Team Leader
    setTeammates((prev) => {
      if (prev.length < requiredTeammatesCount) {
        const added: TeammateInfo[] = [];
        for (let i = prev.length; i < requiredTeammatesCount; i++) {
          added.push({
            name: '',
            email: '',
            phone: '',
            rollNo: '',
            department: commonInfo.department || '',
            year: commonInfo.year || '3rd Year',
            college: commonInfo.college || '',
            role: COMMON_ROLES[i % COMMON_ROLES.length],
          });
        }
        return [...prev, ...added];
      } else if (prev.length > requiredTeammatesCount) {
        return prev.slice(0, requiredTeammatesCount);
      }
      return prev;
    });
  };

  // Update specific teammate field
  const updateTeammateField = (index: number, field: keyof TeammateInfo, value: string) => {
    setTeammates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    const errorKey = `teammate_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[errorKey];
        return n;
      });
    }
  };

  // Quick fill college for teammate
  const copyLeaderCollegeToTeammate = (index: number) => {
    if (commonInfo.college) {
      updateTeammateField(index, 'college', commonInfo.college);
    }
  };

  // Validation for Step 1
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (event.teamBased) {
      if (!teamName.trim()) {
        errs.teamName = 'Team Name is required for this team event.';
      } else if (teamName.trim().length < 2) {
        errs.teamName = 'Team Name must be at least 2 characters.';
      }
    }

    if (!commonInfo.fullName.trim()) {
      errs.fullName = event.teamBased ? 'Team Leader Name is required.' : 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!commonInfo.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!emailRegex.test(commonInfo.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. name@college.edu).';
    }

    const phoneDigits = commonInfo.phone.replace(/[^0-9]/g, '');
    if (!commonInfo.phone.trim()) {
      errs.phone = 'Phone Number is required.';
    } else if (phoneDigits.length < 10) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!commonInfo.college.trim()) {
      errs.college = 'College / Institution name is required.';
    }

    if (!commonInfo.department.trim()) {
      errs.department = 'Department / Branch is required.';
    }

    if (!commonInfo.year.trim()) {
      errs.year = 'Year of study is required.';
    }

    if (!commonInfo.studentId.trim()) {
      errs.studentId = 'Student ID or Roll Number is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validation for Step 2
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // If Team Event with teammate details: Validate each teammate's required fields
    if (event.teamBased && !event.noTeammateDetails) {
      const leaderEmail = commonInfo.email.trim().toLowerCase();
      const seenEmails = new Set<string>([leaderEmail]);

      teammates.forEach((tm, idx) => {
        const memberNum = idx + 2;
        if (!tm.name.trim()) {
          errs[`teammate_${idx}_name`] = `Member ${memberNum} full name is required.`;
        }
        const tmEmail = (tm.email || '').trim().toLowerCase();
        if (!tm.email || !tm.email.trim()) {
          errs[`teammate_${idx}_email`] = `Member ${memberNum} email is required.`;
        } else if (!emailRegex.test(tm.email.trim())) {
          errs[`teammate_${idx}_email`] = `Please enter a valid email for Member ${memberNum}.`;
        } else if (seenEmails.has(tmEmail)) {
          errs[`teammate_${idx}_email`] = tmEmail === leaderEmail
            ? `Member ${memberNum} cannot use the same email as the Team Leader.`
            : `Member ${memberNum} must have a unique email address.`;
        } else {
          seenEmails.add(tmEmail);
        }

        const tmPhoneDigits = (tm.phone || '').replace(/[^0-9]/g, '');
        if (!tm.phone || !tm.phone.trim()) {
          errs[`teammate_${idx}_phone`] = `Member ${memberNum} phone number is required.`;
        } else if (tmPhoneDigits.length < 10) {
          errs[`teammate_${idx}_phone`] = `Member ${memberNum} phone must be at least 10 digits.`;
        }
        if (!tm.rollNo.trim()) {
          errs[`teammate_${idx}_rollNo`] = `Member ${memberNum} USN / Student ID is required.`;
        }
        if (!tm.department.trim()) {
          errs[`teammate_${idx}_department`] = `Member ${memberNum} department is required.`;
        }
        if (!tm.year || !tm.year.trim()) {
          errs[`teammate_${idx}_year`] = `Member ${memberNum} year of study is required.`;
        }
      });
    }

    // Validate Event Fields
    event.fields.forEach((field) => {
      if (field.condition) {
        const parentVal = eventData[field.condition.field];
        if (parentVal !== field.condition.value) {
          return;
        }
      }

      const val = eventData[field.name];
      if (field.required) {
        if (val === undefined || val === null || String(val).trim() === '') {
          errs[field.name] = `${field.label} is required.`;
        }
      }

      if (field.type === 'url' && val && String(val).trim() !== '') {
        try {
          new URL(String(val));
        } catch {
          errs[field.name] = 'Please enter a valid URL (starting with http:// or https://).';
        }
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      return;
    }

    // Auto populate teammates college if empty
    setTeammates((prev) =>
      prev.map((t) => ({
        ...t,
        college: t.college || commonInfo.college,
      }))
    );
    setCurrentStep(skipStep2 ? 3 : 2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }

    setCurrentStep(3);
  };

  // Handle final submission to server & Google Sheets
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        eventSlug: event.slug,
        eventName: event.name,
        participant: commonInfo,
        teamName: event.teamBased ? teamName.trim() : undefined,
        teamSize: event.teamBased ? teamSize : 1,
        teammates: event.teamBased ? teammates : [],
        eventData: event.fields.length > 0 ? { ...eventData } : {},
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSubmitSuccess(result.record);
      } else {
        if (result.duplicate || (result.error && String(result.error).toLowerCase().includes('already registered'))) {
          setSubmissionError('This email is already registered.');
        } else {
          setSubmissionError(
            result.error || 'Something went wrong. Your registration could not be submitted. Please try again.'
          );
        }
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmissionError(
        'Connection error: Failed to reach the registration server. Please check your network and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="dynamic-registration-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb & Event Badge Header */}
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Events</span>
        </button>

        <div className="bg-slate-900/90 rounded-sm p-6 border border-slate-800 relative overflow-hidden shadow-xl">
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${event.themeColor}`} />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30">
                  EVENT {event.number}
                </span>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  event.teamBased 
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/30' 
                    : 'bg-teal-950/80 text-teal-300 border-teal-500/30'
                }`}>
                  {event.teamBased 
                    ? (event.minTeamSize === event.maxTeamSize 
                        ? `👥 TEAM EVENT (EXACTLY ${event.minTeamSize} MEMBERS)` 
                        : `👥 TEAM EVENT (${event.minTeamSize}–${event.maxTeamSize} MEMBERS)`) 
                    : '👤 SOLO PARTICIPANT'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {event.mode.toUpperCase()}
                </span>
              </div>
              <h1 className="font-display font-semibold uppercase tracking-wide text-3xl sm:text-4xl text-white leading-none">
                {event.name}
              </h1>
              <p className="text-xs font-mono text-cyan-300 mt-0.5">
                {event.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-1 text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-sm border border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{event.formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{event.time}</span>
              </div>
              {event.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{event.venue}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Step Progress Indicator */}
      <div className="mb-8">
        {skipStep2 ? (
          /* 2-step indicator: Step 1 → Review */
          <div className="flex items-center justify-center gap-16 max-w-md mx-auto relative">
            <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0">
              <div
                className="h-full bg-pencil transition-all duration-300"
                style={{ width: currentStep === 1 ? '0%' : '100%' }}
              />
            </div>

            <div className="flex flex-col items-center relative z-10">
              <button
                onClick={() => setCurrentStep(1)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep >= 1
                    ? 'bg-pencil text-white shadow-md shadow-pencil/25'
                    : 'bg-slate-850 text-slate-400 border border-slate-700'
                }`}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '01'}
              </button>
              <span className={`text-xs font-mono mt-2 font-medium ${currentStep === 1 ? 'text-cyan-400' : 'text-slate-400'}`}>
                {event.teamBased ? 'Team & Leader' : 'Personal Info'}
              </span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep === 3
                    ? 'bg-pencil text-white shadow-md shadow-pencil/25'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                02
              </div>
              <span className={`text-xs font-mono mt-2 font-medium ${currentStep === 3 ? 'text-cyan-400' : 'text-slate-400'}`}>
                Review & Submit
              </span>
            </div>
          </div>
        ) : (
          /* 3-step indicator */
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0">
              <div
                className="h-full bg-pencil transition-all duration-300"
                style={{
                  width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                }}
              />
            </div>

            <div className="flex flex-col items-center relative z-10">
              <button
                onClick={() => setCurrentStep(1)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep >= 1
                    ? 'bg-pencil text-white shadow-md shadow-pencil/25'
                    : 'bg-slate-850 text-slate-400 border border-slate-700'
                }`}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '01'}
              </button>
              <span className={`text-xs font-mono mt-2 font-medium ${currentStep === 1 ? 'text-cyan-400' : 'text-slate-400'}`}>
                {event.teamBased ? 'Team & Leader' : 'Personal Info'}
              </span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <button
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep >= 2
                    ? 'bg-pencil text-white shadow-md shadow-pencil/25'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {currentStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '02'}
              </button>
              <span className={`text-xs font-mono mt-2 font-medium ${currentStep === 2 ? 'text-cyan-400' : 'text-slate-400'}`}>
                {event.teamBased && !event.noTeammateDetails ? 'Teammates & Details' : 'Event Details'}
              </span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep === 3
                    ? 'bg-pencil text-white shadow-md shadow-pencil/25'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                03
              </div>
              <span className={`text-xs font-mono mt-2 font-medium ${currentStep === 3 ? 'text-cyan-400' : 'text-slate-400'}`}>
                Review & Submit
              </span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 1: PERSONAL OR TEAM LEADER DETAILS */}
      {currentStep === 1 && (
        <form onSubmit={handleNextStep1} className="bg-slate-900/80 rounded-sm p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-display font-semibold uppercase tracking-wide text-white flex items-center gap-2">
              {event.teamBased ? (
                <>
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Step 1: {skipStep2 ? 'Team Registration' : 'Team Profile & Team Leader Info'}</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-cyan-400" />
                  <span>Step 1: Participant Information</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {event.teamBased
                ? skipStep2
                  ? 'Enter your team details and the team leader\'s information.'
                  : 'Specify your team name and total member count, followed by the Team Leader\'s details.'
                : 'Required for student verification and official participation certificate generation.'}
            </p>
          </div>

          {/* If Team Event: Team Name & Team Size Selector */}
          {event.teamBased && (
            <div className="p-5 rounded-sm bg-slate-950/80 border border-purple-500/30 space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Team Profile Configuration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Team Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Team Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-teamName"
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value);
                      if (errors.teamName) setErrors({ ...errors, teamName: '' });
                    }}
                    placeholder="e.g. ByteCraft Pioneers / NeuralKnights"
                    className={`w-full px-4 py-2.5 rounded-sm bg-slate-900 border ${
                      errors.teamName ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-cyan-500'
                    } text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1`}
                  />
                  {errors.teamName && (
                    <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.teamName}</span>
                    </p>
                  )}
                </div>

                {/* Team Size Selector — hidden for IdeaCanvas */}
                {event.slug !== 'ideacanvas' && (
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Total Team Size <span className="text-cyan-400">*</span>
                  </label>
                  {minTeamSize === maxTeamSize ? (
                    <div className="py-2.5 px-3 rounded-sm text-xs font-mono font-bold bg-purple-950/60 text-purple-300 border border-purple-500/40 flex items-center justify-between">
                      <span>Exactly {minTeamSize} Members</span>
                      <span className="text-[10px] text-purple-400/80 font-normal">Fixed Size</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Array.from({ length: maxTeamSize - minTeamSize + 1 }, (_, i) => minTeamSize + i).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleTeamSizeChange(size)}
                          className={`flex-1 min-w-[70px] py-2 px-2 rounded-sm text-xs font-mono font-bold transition-all border ${
                            teamSize === size
                              ? 'bg-pencil text-white border-pencil'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {size} Members
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 font-mono mt-1.5">
                    1 Leader + {teamSize - 1} {teamSize - 1 === 1 ? 'Teammate' : 'Teammates'}
                  </p>
                </div>
                )}
              </div>
            </div>
          )}

          {/* Team Registration Note */}
          {event.teamBased && event.noTeammateDetails && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-sm bg-purple-950/40 border border-purple-500/25 text-xs font-mono text-purple-300">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Only the team lead needs to register for this event. Teammates are not registered individually.</span>
            </div>
          )}

          {/* Participant / Team Leader Fields */}
          <div className="space-y-4">
            {event.teamBased && (
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Team Leader (Member 1 / Primary Contact)</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  {event.teamBased ? 'Team Leader Full Name' : 'Full Name'} <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  id="input-fullName"
                  value={commonInfo.fullName}
                  onChange={(e) => {
                    setCommonInfo({ ...commonInfo, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                    errors.fullName ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                  } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  id="input-email"
                  value={commonInfo.email}
                  onChange={(e) => {
                    setCommonInfo({ ...commonInfo, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="e.g. john.doe@college.edu"
                  className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                    errors.email ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                  } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Phone Number <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  id="input-phone"
                  value={commonInfo.phone}
                  onChange={(e) => {
                    setCommonInfo({ ...commonInfo, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                    errors.phone ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                  } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* College / Institution */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  College / Institution <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  id="input-college"
                  value={commonInfo.college}
                  onChange={(e) => {
                    setCommonInfo({ ...commonInfo, college: e.target.value });
                    if (errors.college) setErrors({ ...errors, college: '' });
                  }}
                  placeholder="e.g. Vishwakarma Institute of Technology / IIT Bombay"
                  className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                    errors.college ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                  } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                />
                {errors.college && (
                  <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.college}</span>
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Department / Branch <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  id="input-department"
                  value={commonInfo.department}
                  onChange={(e) => {
                    setCommonInfo({ ...commonInfo, department: e.target.value });
                    if (errors.department) setErrors({ ...errors, department: '' });
                  }}
                  placeholder="e.g. Computer Science & Engineering"
                  className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                    errors.department ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                  } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                />
                {errors.department && (
                  <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>

              {/* Year of Study */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Year of Study <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="input-year"
                  value={commonInfo.year}
                  onChange={(e) => setCommonInfo({ ...commonInfo, year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-sm bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="1st Year">1st Year (FE)</option>
                  <option value="2nd Year">2nd Year (SE)</option>
                  <option value="3rd Year">3rd Year (TE)</option>
                  <option value="Final Year">Final Year (BE/BTech)</option>
                  <option value="Post Graduate">Post Graduate (ME/MTech/PhD)</option>
                  <option value="Faculty / Research Guide">Faculty / Research Scholar</option>
                </select>
              </div>

              {/* Student ID / Roll Number */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Student ID / Roll Number <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  id="input-studentId"
                  value={commonInfo.studentId}
                  onChange={(e) => {
                    setCommonInfo({ ...commonInfo, studentId: e.target.value });
                    if (errors.studentId) setErrors({ ...errors, studentId: '' });
                  }}
                  placeholder="e.g. CS2023-089 / ROLL-142"
                  className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                    errors.studentId ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                  } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                />
                {errors.studentId && (
                  <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.studentId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="step1-continue-btn"
              className="btn-pencil px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>{skipStep2 ? 'Review Information' : event.teamBased && !event.noTeammateDetails ? 'Continue to Teammates Info' : 'Continue to Event Details'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: TEAMMATES INFO & DYNAMIC EVENT DETAILS */}
      {currentStep === 2 && !skipStep2 && (
        <form onSubmit={handleNextStep2} className="bg-slate-900/80 rounded-sm p-6 sm:p-8 border border-slate-800 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-display font-semibold uppercase tracking-wide text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>
                Step 2: {event.teamBased && !event.noTeammateDetails ? 'Teammates & Event Information' : `${event.name} Specific Details`}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {event.teamBased && !event.noTeammateDetails
                ? 'Fill in the information for all teammates in your team, followed by the project/technical submission specifics.'
                : 'Provide the event-specific details required for evaluation.'}
            </p>
          </div>

          {/* TEAMMATES SECTION (For Team Events) */}
          {event.teamBased && !event.noTeammateDetails && teammates.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-display font-bold text-white">
                    Teammate Information ({teammates.length} {teammates.length === 1 ? 'Teammate' : 'Teammates'})
                  </h3>
                </div>

                {/* Quick Team Size Adjustment */}
                {minTeamSize !== maxTeamSize ? (
                  <div className="flex items-center gap-2">
                    {teamSize < maxTeamSize && (
                      <button
                        type="button"
                        onClick={() => handleTeamSizeChange(teamSize + 1)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add Teammate</span>
                      </button>
                    )}
                    {teamSize > minTeamSize && (
                      <button
                        type="button"
                        onClick={() => handleTeamSizeChange(teamSize - 1)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Remove Teammate</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30">
                    Exactly {minTeamSize} Members Required
                  </span>
                )}
              </div>

              {/* Individual Teammate Cards */}
              <div className="space-y-6">
                {teammates.map((tm, idx) => {
                  const memberNumber = idx + 2;
                  const nameErr = errors[`teammate_${idx}_name`];
                  const emailErr = errors[`teammate_${idx}_email`];
                  const phoneErr = errors[`teammate_${idx}_phone`];
                  const rollErr = errors[`teammate_${idx}_rollNo`];
                  const deptErr = errors[`teammate_${idx}_department`];
                  const yearErr = errors[`teammate_${idx}_year`];

                  return (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-sm bg-slate-950/90 border border-slate-800 relative space-y-4 hover:border-slate-700 transition-colors"
                    >
                      {/* Teammate Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center justify-center">
                            {memberNumber}
                          </span>
                          <span className="text-sm font-display font-bold text-white">
                            Member {memberNumber} (Teammate)
                          </span>
                        </div>

                        {commonInfo.college && tm.college !== commonInfo.college && (
                          <button
                            type="button"
                            onClick={() => copyLeaderCollegeToTeammate(idx)}
                            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            <Building2 className="w-3 h-3" />
                            <span>Same college as leader</span>
                          </button>
                        )}
                      </div>

                      {/* Teammate Inputs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Teammate Full Name */}
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1">
                            Teammate Full Name <span className="text-cyan-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={tm.name}
                            onChange={(e) => updateTeammateField(idx, 'name', e.target.value)}
                            placeholder={`e.g. Teammate ${memberNumber} Name`}
                            className={`w-full px-3.5 py-2 rounded-sm bg-slate-900 border ${
                              nameErr ? 'border-red-500' : 'border-slate-800 focus:border-cyan-500'
                            } text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                          />
                          {nameErr && (
                            <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{nameErr}</span>
                            </p>
                          )}
                        </div>

                        {/* Teammate Email */}
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1">
                            Email Address <span className="text-cyan-400">*</span>
                          </label>
                          <input
                            type="email"
                            value={tm.email}
                            onChange={(e) => updateTeammateField(idx, 'email', e.target.value)}
                            placeholder="e.g. teammate@college.edu"
                            className={`w-full px-3.5 py-2 rounded-sm bg-slate-900 border ${
                              emailErr ? 'border-red-500' : 'border-slate-800 focus:border-cyan-500'
                            } text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                          />
                          {emailErr && (
                            <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{emailErr}</span>
                            </p>
                          )}
                        </div>

                        {/* Teammate Student ID / Roll No */}
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1">
                            Roll Number / Student ID <span className="text-cyan-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={tm.rollNo}
                            onChange={(e) => updateTeammateField(idx, 'rollNo', e.target.value)}
                            placeholder="e.g. CS2023-092"
                            className={`w-full px-3.5 py-2 rounded-sm bg-slate-900 border ${
                              rollErr ? 'border-red-500' : 'border-slate-800 focus:border-cyan-500'
                            } text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                          />
                          {rollErr && (
                            <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{rollErr}</span>
                            </p>
                          )}
                        </div>

                        {/* Teammate Department */}
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1">
                            Department / Branch <span className="text-cyan-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={tm.department}
                            onChange={(e) => updateTeammateField(idx, 'department', e.target.value)}
                            placeholder="e.g. Information Technology"
                            className={`w-full px-3.5 py-2 rounded-sm bg-slate-900 border ${
                              deptErr ? 'border-red-500' : 'border-slate-800 focus:border-cyan-500'
                            } text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                          />
                          {deptErr && (
                            <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{deptErr}</span>
                            </p>
                          )}
                        </div>

                        {/* Teammate Phone Number */}
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1">
                            Phone Number <span className="text-cyan-400">*</span>
                          </label>
                          <input
                            type="tel"
                            value={tm.phone || ''}
                            onChange={(e) => updateTeammateField(idx, 'phone', e.target.value)}
                            placeholder="e.g. 9876543210"
                            className={`w-full px-3.5 py-2 rounded-sm bg-slate-900 border ${
                              phoneErr ? 'border-red-500' : 'border-slate-800 focus:border-cyan-500'
                            } text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                          />
                          {phoneErr && (
                            <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{phoneErr}</span>
                            </p>
                          )}
                        </div>

                        {/* Teammate Year of Study */}
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1">
                            Year of Study <span className="text-cyan-400">*</span>
                          </label>
                          <select
                            value={tm.year || '3rd Year'}
                            onChange={(e) => updateTeammateField(idx, 'year', e.target.value)}
                            className={`w-full px-3.5 py-2 rounded-sm bg-slate-900 border ${
                              yearErr ? 'border-red-500' : 'border-slate-800 focus:border-cyan-500'
                            } text-white focus:outline-none focus:ring-1`}
                          >
                            <option value="1st Year">1st Year (FE)</option>
                            <option value="2nd Year">2nd Year (SE)</option>
                            <option value="3rd Year">3rd Year (TE)</option>
                            <option value="Final Year">Final Year (BE/BTech)</option>
                            <option value="Post Graduate">Post Graduate (ME/MTech/PhD)</option>
                          </select>
                          {yearErr && (
                            <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{yearErr}</span>
                            </p>
                          )}
                        </div>

                        {/* Teammate College / Institution */}
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1">
                            College / Institution
                          </label>
                          <input
                            type="text"
                            value={tm.college || ''}
                            onChange={(e) => updateTeammateField(idx, 'college', e.target.value)}
                            placeholder="e.g. Same as Leader or Custom College"
                            className="w-full px-3.5 py-2 rounded-sm bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1"
                          />
                        </div>

                        {/* Teammate Role / Specialization — not used */}
                        {false && (
                        <div>
                          <label className="block font-mono font-medium text-slate-300 mb-1 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-cyan-400" />
                            <span>Role / Contribution in Team</span>
                          </label>
                          <select
                            value={tm.role || COMMON_ROLES[0]}
                            onChange={(e) => updateTeammateField(idx, 'role', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-sm bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white focus:outline-none focus:ring-1"
                          >
                            {COMMON_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EVENT-SPECIFIC TECHNICAL DETAILS SECTION */}
          {event.fields.length > 0 && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-display font-bold text-white">
                {event.name} Submission Specifics
              </h3>
            </div>

            <div className="space-y-5">
              {event.fields.map((field) => {
                if (field.condition) {
                  const parentVal = eventData[field.condition.field];
                  if (parentVal !== field.condition.value) {
                    return null;
                  }
                }

                const fieldError = errors[field.name];

                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-mono font-medium text-slate-300">
                      {field.label} {field.required && <span className="text-cyan-400">*</span>}
                    </label>

                    {/* Radio Group */}
                    {field.type === 'radio' && field.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {field.options.map((opt) => (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${
                              eventData[field.name] === opt.value
                                ? 'bg-fresh/10 border-fresh text-fresh'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={field.name}
                              value={opt.value}
                              checked={eventData[field.name] === opt.value}
                              onChange={(e) => {
                                setEventData({ ...eventData, [field.name]: e.target.value });
                                if (fieldError) setErrors({ ...errors, [field.name]: '' });
                              }}
                              className="text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-slate-900 border-slate-700"
                            />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Select Dropdown */}
                    {field.type === 'select' && field.options && (
                      <select
                        id={`field-${field.name}`}
                        value={eventData[field.name] || ''}
                        onChange={(e) => {
                          setEventData({ ...eventData, [field.name]: e.target.value });
                          if (fieldError) setErrors({ ...errors, [field.name]: '' });
                        }}
                        className="w-full px-4 py-2.5 rounded-sm bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Textarea */}
                    {field.type === 'textarea' && (
                      <textarea
                        id={`field-${field.name}`}
                        rows={3}
                        value={eventData[field.name] || ''}
                        onChange={(e) => {
                          setEventData({ ...eventData, [field.name]: e.target.value });
                          if (fieldError) setErrors({ ...errors, [field.name]: '' });
                        }}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                          fieldError ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                        } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                      />
                    )}

                    {/* Standard Text or URL */}
                    {(field.type === 'text' || field.type === 'url' || field.type === 'number') && (
                      <input
                        type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
                        id={`field-${field.name}`}
                        value={eventData[field.name] || ''}
                        onChange={(e) => {
                          setEventData({ ...eventData, [field.name]: e.target.value });
                          if (fieldError) setErrors({ ...errors, [field.name]: '' });
                        }}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-2.5 rounded-sm bg-slate-950 border ${
                          fieldError ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                        } text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1`}
                      />
                    )}

                    {/* Helper Text */}
                    {field.helperText && (
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Info className="w-3 h-3 text-slate-500" />
                        <span>{field.helperText}</span>
                      </p>
                    )}

                    {/* Field Error */}
                    {fieldError && (
                      <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{fieldError}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          <div className="pt-6 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Step 1</span>
            </button>

            <button
              type="submit"
              id="step2-continue-btn"
              className="btn-pencil px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Review Information</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: REVIEW & SUBMIT */}
      {currentStep === 3 && (
        <div className="bg-slate-900/80 rounded-sm p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-display font-semibold uppercase tracking-wide text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Step 3: Review & Final Submission</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Please double check all your information before recording your entry in the master Google Sheet registry.
            </p>
          </div>

          {/* If Team Event: Team Profile Header Card */}
          {event.teamBased && (
            <div className="bg-slate-950/90 p-5 rounded-sm border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                    Team Profile
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {event.teamBased && !event.noTeammateDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Team Name:</span>
                    <span className="text-white font-bold text-sm font-display text-cyan-300">{teamName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Team Size:</span>
                    <span className="text-white font-medium">{teamSize} Members (1 Leader + {teammates.length} Teammates)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lead College:</span>
                    <span className="text-white font-medium truncate block">{commonInfo.college}</span>
                  </div>
                </div>
              ) : event.teamBased ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Participation:</span>
                    <span className="text-white font-medium">Team (1–{event.maxTeamSize} Members)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">College:</span>
                    <span className="text-white font-medium truncate block">{commonInfo.college}</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Review Card: Team Leader or Participant Info */}
          <div className="bg-slate-950/70 p-5 rounded-sm border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                {event.teamBased && !event.noTeammateDetails ? (
                  <>
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Member 1: Team Leader (Primary Contact)</span>
                  </>
                ) : (
                  <span>Participant Information</span>
                )}
              </h3>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Full Name:</span>
                <span className="text-white font-medium">{commonInfo.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email Address:</span>
                <span className="text-white font-medium">{commonInfo.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number:</span>
                <span className="text-white font-medium">{commonInfo.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">College / Institute:</span>
                <span className="text-white font-medium">{commonInfo.college}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Department & Year:</span>
                <span className="text-white font-medium">{commonInfo.department} • {commonInfo.year}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Student ID / Roll No:</span>
                <span className="text-white font-mono font-bold text-cyan-400">{commonInfo.studentId}</span>
              </div>
            </div>
          </div>

          {/* If Team Event: Teammates Review Roster */}
          {event.teamBased && teammates.length > 0 && (
            <div className="bg-slate-950/70 p-5 rounded-sm border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Teammates Roster ({teammates.length} Members)</span>
                </h3>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teammates.map((tm, idx) => (
                  <div key={idx} className="p-3.5 rounded-sm bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-300">
                        Member {idx + 2}: {tm.name}
                      </span>
                      {tm.role && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                          {tm.role}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[11px] space-y-0.5">
                      <p>
                        <span className="text-slate-500">USN / ID:</span>{' '}
                        <strong className="text-slate-200">{tm.rollNo}</strong> •{' '}
                        <span className="text-slate-500">Dept:</span> {tm.department} •{' '}
                        <span className="text-slate-500">Year:</span> {tm.year}
                      </p>
                      <p>
                        <span className="text-slate-500">Email:</span> {tm.email} •{' '}
                        <span className="text-slate-500">Phone:</span> {tm.phone}
                      </p>
                      {tm.college && (
                        <p className="truncate">
                          <span className="text-slate-500">College:</span> {tm.college}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Card: Event Specifics */}
          <div className="bg-slate-950/70 p-5 rounded-sm border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {event.name} Submission Specifics
              </h3>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {Object.entries(eventData).map(([key, val]) => {
                const fieldConfig = event.fields.find((f) => f.name === key);
                const label = fieldConfig ? fieldConfig.label : key;
                if (!val) return null;
                return (
                  <div key={key} className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block font-mono text-[11px] mb-0.5">{label}:</span>
                    <p className="text-slate-200 font-medium whitespace-pre-line">{String(val)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Failure Alert Box if API Fails */}
          {submissionError && (
            <div className="p-4 rounded-sm bg-red-950/40 border border-red-500/40 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Registration Submission Failed</span>
              </div>
              <p className="text-red-200 text-xs leading-relaxed">{submissionError}</p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Agreement Notice */}
          <div className="p-3.5 rounded-sm bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            By submitting, I confirm that all participant {event.teamBased ? 'and teammate' : ''} details provided are accurate and the team agrees to adhere to the official rules and offline venue protocols for <span className="text-slate-200 font-semibold">{event.name}</span> during TechVision 2026.
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setCurrentStep(skipStep2 ? 1 : 2)}
              className="px-5 py-2.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {skipStep2 ? 'Step 1' : 'Step 2'}</span>
            </button>

            <button
              type="button"
              id="final-submit-btn"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="btn-pencil px-8 py-3.5 text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <span>Submit Registration</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
