import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  ListChecks, 
  CheckCircle,
  Layers,
  Grid
} from 'lucide-react';
import { EventConfig } from '../types';

interface EventDetailModalProps {
  event: EventConfig | null;
  onClose: () => void;
  onRegister: (slug: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onRegister,
}) => {
  if (!event) return null;

  const hasRules = Boolean(event.rules && event.rules.length > 0);
  const hasDomains = Boolean(event.challengeDomains && event.challengeDomains.length > 0);
  const hasDebateTopics = Boolean(event.debateTopics && event.debateTopics.length > 0);

  // Available tabs based strictly on provided data
  type TabKey = 'overview' | 'rules' | 'domains' | 'debate';
  const tabs: { key: TabKey; label: string }[] = [{ key: 'overview', label: 'Overview' }];
  if (hasRules) tabs.push({ key: 'rules', label: `Rules (${event.rules!.length})` });
  if (hasDebateTopics) tabs.push({ key: 'debate', label: 'Debate Rounds & Topics' });
  if (hasDomains) tabs.push({ key: 'domains', label: `Domains (${event.challengeDomains!.length})` });

  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Bar */}
        <div className={`relative px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-r ${event.themeColor} border-b border-slate-800`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
              EVENT {event.number}
            </span>
            <span className={`font-mono text-xs font-semibold px-2.5 py-1 rounded border ${
              event.teamBased 
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/30' 
                : 'bg-teal-950/80 text-teal-300 border-teal-500/30'
            }`}>
              {event.teamBased 
                ? (event.minTeamSize === event.maxTeamSize 
                    ? `👥 TEAM (EXACTLY ${event.minTeamSize} MEMBERS)` 
                    : `👥 TEAM (${event.minTeamSize}–${event.maxTeamSize} MEMBERS)`)
                : '👤 SOLO PARTICIPATION'}
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
              {event.mode.toUpperCase()}
            </span>
            {event.theme && (
              <span className="font-mono text-xs font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
                THEME: {event.theme}
              </span>
            )}
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white">
            {event.name}
          </h2>
          <p className="text-sm sm:text-base font-mono text-cyan-300 mt-1">
            {event.subtitle}
          </p>

          {/* Quick Details Row - ONLY showing provided values */}
          <div className="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-slate-800/60 font-mono text-xs text-slate-200">
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{event.formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            {event.reportingTime && (
              <div className="flex items-center gap-2 bg-amber-950/50 px-3 py-2 rounded-xl border border-amber-500/30 text-amber-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Reporting: {event.reportingTime}</span>
              </div>
            )}
            {event.venue && (
              <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Venue: {event.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs (Only rendered if more than 1 tab exists) */}
        {tabs.length > 1 && (
          <div className="flex items-center gap-2 px-6 sm:px-8 border-b border-slate-800 bg-slate-950/60 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-4 text-xs font-mono font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-cyan-400 text-cyan-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Body (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Event Description if provided */}
              {event.fullDescription ? (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>About the Event</span>
                  </h3>
                  <p className="leading-relaxed text-slate-200 text-sm sm:text-base bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    {event.fullDescription}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-center space-y-2">
                  <FileText className="w-8 h-8 text-cyan-400/80 mx-auto mb-2" />
                  <h4 className="text-white font-display font-semibold text-base">
                    Official Event Details
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
                    Official event details, problem sets, and guidelines will be updated when the official document is provided.
                  </p>
                </div>
              )}

              {/* Debate Specifics if present */}
              {(event.targetParticipants || event.topicTrack || event.positionsInfo) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.targetParticipants && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[11px] font-mono text-cyan-400 block mb-1">TARGET PARTICIPANTS</span>
                      <p className="text-xs text-white font-medium">{event.targetParticipants}</p>
                    </div>
                  )}
                  {event.recommendedCapacity && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[11px] font-mono text-cyan-400 block mb-1">CAPACITY</span>
                      <p className="text-xs text-white font-medium">
                        {event.recommendedCapacity} {event.scalableCapacity && `(${event.scalableCapacity})`}
                      </p>
                    </div>
                  )}
                  {event.topicTrack && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 sm:col-span-2">
                      <span className="text-[11px] font-mono text-cyan-400 block mb-1">TOPIC TRACK</span>
                      <p className="text-xs text-white font-semibold">{event.topicTrack}</p>
                      {event.positionsInfo && (
                        <p className="text-[11px] text-slate-400 mt-1">{event.positionsInfo}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Poster Guidelines if provided */}
              {event.posterGuidelines && event.posterGuidelines.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>The Poster Should Communicate</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {event.posterGuidelines.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solution Components for Hackathon if provided */}
              {event.solutionIncludes && event.solutionIncludes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Solution Should Include</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {event.solutionIncludes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility if provided */}
              {event.eligibility && event.eligibility.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Eligibility</span>
                  </h3>
                  <ul className="space-y-2">
                    {event.eligibility.map((el, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-emerald-400 font-mono">•</span>
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB: RULES */}
          {activeTab === 'rules' && hasRules && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 mb-3">
                <ListChecks className="w-4 h-4 text-cyan-400" />
                <span>Official Rules</span>
              </h3>
              <div className="space-y-2.5">
                {event.rules!.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 border border-cyan-500/30 px-2 py-0.5 rounded shrink-0">
                      Rule {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DEBATE ROUNDS */}
          {activeTab === 'debate' && hasDebateTopics && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 space-y-1 font-mono">
                <p><strong>Topic Track:</strong> {event.topicTrack}</p>
                <p><strong>Progression:</strong> From approachable topics to technical and analytical reasoning, culminating in complex questions on technology, ethics, accountability and the future.</p>
                <p><strong>Sides Allocation:</strong> Teams receive FOR or AGAINST positions through a transparent random draw by organizers.</p>
              </div>

              <div className="space-y-3 pt-2">
                {event.debateTopics!.map((roundItem, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
                        {roundItem.round}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {roundItem.title}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400 font-mono mb-1">Debate Topic:</p>
                      <p className="text-sm font-semibold text-white italic">
                        "{roundItem.topic}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DOMAINS */}
          {activeTab === 'domains' && hasDomains && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                  <Grid className="w-4 h-4 text-cyan-400" />
                  <span>Available Challenge Domains</span>
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {event.challengeDomains!.length} Domains
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {event.challengeDomains!.map((domain, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs font-mono text-cyan-400 font-bold w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-xs text-slate-200 font-medium">{domain}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>

          {!event.noRegistrationRequired && (
          <button
            id={`modal-register-${event.slug}`}
            onClick={() => {
              onClose();
              onRegister(event.slug);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            <span>Register for this Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          )}
        </div>
      </div>
    </div>
  );
};
