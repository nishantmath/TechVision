import React, { useEffect, useState } from 'react';
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
  Grid,
  Users,
  User,
} from 'lucide-react';
import { EventConfig } from '../types';

interface EventDetailModalProps {
  event: EventConfig | null;
  onClose: () => void;
  onRegister: (slug: string) => void;
}

type TabKey = 'overview' | 'rules' | 'domains' | 'debate';

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onRegister,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Reset tab whenever a new event is opened
  useEffect(() => {
    setActiveTab('overview');
  }, [event?.slug]);

  // Escape to close + body scroll lock
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [event, onClose]);

  if (!event) return null;

  const hasRules = Boolean(event.rules && event.rules.length > 0);
  const hasDomains = Boolean(event.challengeDomains && event.challengeDomains.length > 0);
  const hasDebateTopics = Boolean(event.debateTopics && event.debateTopics.length > 0);

  const tabs: { key: TabKey; label: string }[] = [{ key: 'overview', label: 'Overview' }];
  if (hasRules) tabs.push({ key: 'rules', label: `Rules (${event.rules!.length})` });
  if (hasDebateTopics) tabs.push({ key: 'debate', label: 'Debate rounds' });
  if (hasDomains) tabs.push({ key: 'domains', label: `Domains (${event.challengeDomains!.length})` });

  const sectionHeading = (icon: React.ReactNode, text: string) => (
    <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-faint flex items-center gap-2 mb-3">
      {icon}
      <span>{text}</span>
      <span className="flex-1 h-px bg-[rgba(147,197,253,0.14)]" />
    </h3>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6 bg-paper-deep/85 backdrop-blur-sm overlay-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${event.name} details`}
    >
      <div
        className="sheet-up relative w-full sm:max-w-3xl lg:max-w-4xl bg-paper border-t sm:border border-[rgba(147,197,253,0.25)] shadow-2xl shadow-black/60 flex flex-col max-h-[94vh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grabber */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0" onClick={onClose}>
          <span className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="relative px-5 sm:px-8 pt-5 sm:pt-7 pb-5 border-b border-[rgba(147,197,253,0.18)] shrink-0 bg-blueprint-fine">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 border border-[rgba(147,197,253,0.25)] text-mist hover:text-ink hover:border-fresh transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3 pr-10 font-mono text-[10px] tracking-[0.14em] uppercase">
            <span className="text-fresh border border-fresh/40 px-2 py-1">E-{event.number}</span>
            <span className="text-mist border border-[rgba(147,197,253,0.25)] px-2 py-1 flex items-center gap-1.5">
              {event.teamBased ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {event.teamBased
                ? event.minTeamSize === event.maxTeamSize
                  ? `Team · exactly ${event.minTeamSize}`
                  : `Team · ${event.minTeamSize}–${event.maxTeamSize}`
                : 'Solo'}
            </span>
            <span className="text-mist border border-[rgba(147,197,253,0.25)] px-2 py-1">
              {event.mode}
            </span>
            {event.theme && (
              <span className="text-gold border border-gold/40 px-2 py-1">Theme: {event.theme}</span>
            )}
          </div>

          <h2 className="font-display font-semibold uppercase text-3xl sm:text-4xl text-ink tracking-wide leading-[0.95]">
            {event.name}
          </h2>
          <p className="font-mono text-xs text-pencil uppercase tracking-[0.16em] mt-1.5">
            {event.subtitle}
          </p>

          {/* Quick spec chips */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 font-mono text-[11px] text-mist">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-fresh" /> {event.formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-fresh" /> {event.time}
            </span>
            {event.reportingTime && (
              <span className="flex items-center gap-1.5 text-gold">
                <Clock className="w-3.5 h-3.5" /> Report {event.reportingTime}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-fresh" /> {event.venue || 'Venue TBA'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-[rgba(147,197,253,0.18)] overflow-x-auto no-scrollbar shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-3.5 font-mono text-[11px] uppercase tracking-[0.12em] border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-pencil text-ink'
                    : 'border-transparent text-faint hover:text-mist'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="px-5 sm:px-8 py-6 overflow-y-auto flex-1 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-7">
              {event.fullDescription ? (
                <div>
                  {sectionHeading(<Sparkles className="w-3.5 h-3.5 text-fresh" />, 'About this event')}
                  <p className="text-mist leading-relaxed">{event.fullDescription}</p>
                </div>
              ) : (
                <div className="sheet-frame p-6 text-center">
                  <FileText className="w-7 h-7 text-fresh mx-auto mb-2" />
                  <h4 className="font-display font-semibold uppercase text-lg text-ink tracking-wide">
                    Spec pending issue
                  </h4>
                  <p className="text-faint text-xs mt-1 max-w-sm mx-auto">
                    Full details and guidelines for this event will be published as soon as the committee issues them.
                  </p>
                </div>
              )}

              {(event.targetParticipants || event.topicTrack || event.positionsInfo) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.targetParticipants && (
                    <div className="sheet-frame p-4">
                      <span className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase block mb-1">Who it's for</span>
                      <p className="text-ink text-xs font-medium">{event.targetParticipants}</p>
                    </div>
                  )}
                  {event.recommendedCapacity && (
                    <div className="sheet-frame p-4">
                      <span className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase block mb-1">Capacity</span>
                      <p className="text-ink text-xs font-medium">
                        {event.recommendedCapacity} {event.scalableCapacity && `(${event.scalableCapacity})`}
                      </p>
                    </div>
                  )}
                  {event.topicTrack && (
                    <div className="sheet-frame p-4 sm:col-span-2">
                      <span className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase block mb-1">Topic track</span>
                      <p className="text-ink text-xs font-semibold">{event.topicTrack}</p>
                      {event.positionsInfo && <p className="text-faint text-[11px] mt-1">{event.positionsInfo}</p>}
                    </div>
                  )}
                </div>
              )}

              {event.posterGuidelines && event.posterGuidelines.length > 0 && (
                <div>
                  {sectionHeading(<Layers className="w-3.5 h-3.5 text-fresh" />, 'The poster should communicate')}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {event.posterGuidelines.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 sheet-frame px-3.5 py-2.5">
                        <CheckCircle className="w-4 h-4 text-fresh shrink-0" />
                        <span className="text-xs text-mist">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.solutionIncludes && event.solutionIncludes.length > 0 && (
                <div>
                  {sectionHeading(<Layers className="w-3.5 h-3.5 text-fresh" />, 'Solution should include')}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {event.solutionIncludes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 sheet-frame px-3.5 py-2.5">
                        <CheckCircle className="w-4 h-4 text-fresh shrink-0" />
                        <span className="text-xs text-mist">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.schedule && event.schedule.length > 0 && (
                <div>
                  {sectionHeading(<Clock className="w-3.5 h-3.5 text-fresh" />, 'Run of show')}
                  <div className="font-mono text-xs">
                    {event.schedule.map((s, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-[rgba(147,197,253,0.12)] first:border-t">
                        <span className="text-fresh shrink-0">{s.time}</span>
                        <span className="text-mist text-right">{s.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.coordinators && event.coordinators.length > 0 && (
                <div>
                  {sectionHeading(<Users className="w-3.5 h-3.5 text-fresh" />, 'Points of contact')}
                  <div className="grid grid-cols-2 gap-2.5">
                    {event.coordinators.map((person) => (
                      <div key={person.name} className="sheet-frame px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 border border-fresh/50 flex items-center justify-center font-display font-semibold text-sm text-fresh shrink-0">
                          {person.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-ink text-sm font-semibold leading-tight">{person.name}</div>
                          <div className="font-mono text-[9px] tracking-[0.14em] text-faint uppercase mt-0.5">
                            {person.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.eligibility && event.eligibility.length > 0 && (
                <div>
                  {sectionHeading(<CheckCircle className="w-3.5 h-3.5 text-fresh" />, 'Eligibility')}
                  <ul className="space-y-2">
                    {event.eligibility.map((el, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-mist sheet-frame px-3.5 py-2.5">
                        <span className="text-pencil font-mono font-bold">•</span>
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && hasRules && (
            <div className="space-y-2.5">
              {sectionHeading(<ListChecks className="w-3.5 h-3.5 text-fresh" />, 'Official rules')}
              {event.rules!.map((rule, i) => (
                <div key={i} className="flex items-start gap-3.5 sheet-frame px-4 py-3">
                  <span className="font-mono text-[10px] font-bold text-fresh border border-fresh/40 px-1.5 py-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs sm:text-sm text-mist leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'debate' && hasDebateTopics && (
            <div className="space-y-4">
              <div className="sheet-frame p-4 text-xs text-mist space-y-1 font-mono border-l-2 border-l-pencil">
                <p><strong className="text-ink">Track:</strong> {event.topicTrack}</p>
                <p><strong className="text-ink">Sides:</strong> FOR / AGAINST assigned by transparent random draw.</p>
              </div>
              {event.debateTopics!.map((roundItem, idx) => (
                <div key={idx} className="sheet-frame p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="text-fresh border border-fresh/40 px-2 py-0.5">{roundItem.round}</span>
                    <span className="text-faint">{roundItem.title}</span>
                  </div>
                  <p className="text-sm font-semibold text-ink leading-relaxed">
                    “{roundItem.topic}”
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'domains' && hasDomains && (
            <div className="space-y-4">
              {sectionHeading(<Grid className="w-3.5 h-3.5 text-fresh" />, `${event.challengeDomains!.length} challenge domains`)}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.challengeDomains!.map((domain, idx) => (
                  <div key={idx} className="flex items-center gap-3 sheet-frame px-3.5 py-2.5">
                    <span className="font-mono text-[10px] text-pencil font-bold w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-mist font-medium">{domain}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 sm:px-8 py-4 bg-paper-deep border-t border-[rgba(147,197,253,0.18)] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="btn-outline px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]"
          >
            Close
          </button>
          {!event.noRegistrationRequired ? (
            <button
              id={`modal-register-${event.slug}`}
              onClick={() => {
                onClose();
                onRegister(event.slug);
              }}
              className="btn-pencil px-6 py-3 text-sm flex items-center gap-2"
            >
              <span>Register for this event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="btn-outline px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] opacity-60 cursor-default flex items-center gap-2"
            >
              <span>Registration Closed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
