import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  ArrowLeft, 
  ShieldCheck,
  Printer,
  Copy,
  Check,
  QrCode
} from 'lucide-react';
import QRCode from 'qrcode';
import { RegistrationRecord, EventConfig } from '../types';
import { EVENTS_DATA, getEventBySlug } from '../data/events';

export const VerifyPassModal: React.FC<{ onBackToEvents: () => void }> = ({ onBackToEvents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedRecord, setSearchedRecord] = useState<RegistrationRecord | null>(null);
  const [matchedEvent, setMatchedEvent] = useState<EventConfig | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchedRecord(null);
    setMatchedEvent(null);

    try {
      // If it looks like a registration ID
      if (query.toUpperCase().startsWith('EW26-')) {
        const res = await fetch(`/api/registrations/${encodeURIComponent(query.toUpperCase())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.record) {
            setSearchedRecord(data.record);
            const ev = getEventBySlug(data.record.eventSlug) || null;
            setMatchedEvent(ev);
            generateQr(data.record, ev);
            return;
          }
        }
      }

      // Otherwise search by email / student ID in full list
      const listRes = await fetch(`/api/registrations?search=${encodeURIComponent(query)}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        if (listData.registrations && listData.registrations.length > 0) {
          const first = listData.registrations[0];
          setSearchedRecord(first);
          const ev = getEventBySlug(first.eventSlug) || null;
          setMatchedEvent(ev);
          generateQr(first, ev);
        } else {
          setSearchError(`No registration record found for "${query}". Please verify your Registration ID or email.`);
        }
      } else {
        setSearchError('Search failed. Please try again.');
      }
    } catch (e: any) {
      setSearchError('Failed to connect to registration registry.');
    } finally {
      setIsSearching(false);
    }
  };

  const generateQr = (rec: RegistrationRecord, ev: EventConfig | null) => {
    const payload = JSON.stringify({
      id: rec.registrationId,
      event: rec.eventName,
      participant: rec.participant.fullName,
      studentId: rec.participant.studentId,
      college: rec.participant.college,
    });
    QRCode.toDataURL(payload, { width: 200, margin: 2 })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div id="verify-pass-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DELEGATE PASS VERIFICATION</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Retrieve & Verify Your Digital Pass
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Enter your Registration ID (e.g. <span className="text-cyan-400 font-mono">EW26-H82X91</span>) or registered email address to download your badge.
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
        <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-cyan-500 shadow-xl">
          <div className="flex-1 flex items-center pl-3">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              id="verify-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Registration ID or Email..."
              className="w-full pl-3 pr-2 py-2 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            {isSearching ? 'Searching...' : 'Find Pass'}
          </button>
        </div>
      </form>

      {/* Error Notice */}
      {searchError && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 mb-8">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Found Pass Record Display */}
      {searchedRecord && (
        <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl max-w-2xl mx-auto animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-6 border-b border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE & VERIFIED
              </span>
              <h2 className="font-display font-bold text-2xl text-white mt-1">
                {searchedRecord.eventName}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {matchedEvent?.formattedDate || 'September 2026'} • {matchedEvent?.venue || 'Campus Venue'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">REGISTRATION ID</span>
              <span className="font-mono font-bold text-cyan-400 text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block mt-0.5">
                {searchedRecord.registrationId}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="sm:col-span-2 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-mono text-[10px] block">DELEGATE NAME</span>
                <span className="text-white font-bold text-base">{searchedRecord.participant.fullName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-mono text-[10px] block">INSTITUTION</span>
                  <span className="text-slate-200 font-medium truncate block">{searchedRecord.participant.college}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px] block">ROLL / ID</span>
                  <span className="text-slate-200 font-mono">{searchedRecord.participant.studentId}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-mono text-[10px] block">DEPARTMENT & YEAR</span>
                <span className="text-slate-200">{searchedRecord.participant.department} • {searchedRecord.participant.year}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              {qrUrl ? (
                <img src={qrUrl} alt="Pass QR" className="w-28 h-28 bg-white p-1 rounded-lg" />
              ) : (
                <QrCode className="w-20 h-20 text-slate-600" />
              )}
              <span className="text-[9px] font-mono text-slate-400 mt-1">OFFICIAL QR</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => handleCopyId(searchedRecord.registrationId)}
              className="text-xs font-mono text-slate-300 hover:text-cyan-400 flex items-center gap-1.5"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied ID' : 'Copy ID'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
