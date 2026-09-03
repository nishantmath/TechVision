/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyParticipate } from './components/WhyParticipate';
import { Coordinators } from './components/Coordinators';
import { Posters } from './components/Posters';
import { EventsList } from './components/EventsList';
import { EventTimeline } from './components/EventTimeline';
import { EventDetailModal } from './components/EventDetailModal';
import { DynamicRegistrationForm } from './components/DynamicRegistrationForm';
import { RegistrationSuccess } from './components/RegistrationSuccess';
import { Footer } from './components/Footer';
import { EVENTS_DATA, getEventBySlug } from './data/events';
import { EventConfig } from './types';

export default function App() {
  // Current view state: 'home' | 'events' | 'register' | 'success'
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedEventSlug, setSelectedEventSlug] = useState<string>('innovatex');
  const [activeModalEvent, setActiveModalEvent] = useState<EventConfig | null>(null);
  const [successfulRegistration, setSuccessfulRegistration] = useState<{
    event: EventConfig;
  } | null>(null);
  const [totalRegistrationsCount, setTotalRegistrationsCount] = useState<number>(0);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === '') {
        setCurrentView('home');
        return;
      }

      if (hash === 'success' || hash.startsWith('success')) {
        setCurrentView('success');
        return;
      }

      if (hash.startsWith('register/')) {
        const slug = hash.replace('register/', '');
        const ev = getEventBySlug(slug);
        if (ev && !ev.noRegistrationRequired) {
          setSelectedEventSlug(slug);
          setCurrentView('register');
        } else if (ev && ev.noRegistrationRequired) {
          setActiveModalEvent(ev);
          setCurrentView('events');
        } else {
          setCurrentView('events');
        }
      } else if (hash.startsWith('events/')) {
        const slug = hash.replace('events/', '');
        const ev = getEventBySlug(slug);
        if (ev) {
          setActiveModalEvent(ev);
        }
        setCurrentView('events');
      } else if (['home', 'events'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    parseRoute();
    window.addEventListener('hashchange', parseRoute);
    return () => window.removeEventListener('hashchange', parseRoute);
  }, []);

  // Fetch initial total count for navbar indicator
  useEffect(() => {
    fetch('/api/registrations?limit=1')
      .then((res) => res.json())
      .then((data) => {
        if (data.total !== undefined) {
          setTotalRegistrationsCount(data.total);
        }
      })
      .catch((e) => console.error('Count fetch error:', e));
  }, [currentView]);

  const navigateTo = (view: string, slug?: string) => {
    if (view === 'register' && slug) {
      setSelectedEventSlug(slug);
      window.location.hash = `/register/${slug}`;
    } else if (view === 'events' && slug) {
      window.location.hash = `/events/${slug}`;
      const ev = getEventBySlug(slug);
      if (ev) setActiveModalEvent(ev);
    } else {
      window.location.hash = `/${view}`;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetailModal = (slug: string) => {
    const event = getEventBySlug(slug);
    if (event) {
      setActiveModalEvent(event);
    }
  };

  const handleStartRegistration = (slug: string) => {
    const ev = getEventBySlug(slug);
    if (ev?.noRegistrationRequired) {
      setActiveModalEvent(ev);
      return;
    }
    setActiveModalEvent(null);
    navigateTo('register', slug);
  };

  const handleRegistrationSuccess = (record?: any) => {
    const event = getEventBySlug(selectedEventSlug) || EVENTS_DATA[0];
    setSuccessfulRegistration({ event });
    setTotalRegistrationsCount((prev) => prev + 1);
    setCurrentView('success');
    window.location.hash = '/success';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentRegistrationEvent = getEventBySlug(selectedEventSlug) || EVENTS_DATA[0];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view)}
        totalRegistrations={totalRegistrationsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onExploreEvents={() => navigateTo('events')}
              onRegisterNow={() => navigateTo('events')}
            />

            {/* Event Timeline Section */}
            <EventTimeline
              onSelectEvent={handleOpenDetailModal}
              onRegisterEvent={handleStartRegistration}
            />

            {/* General Notes / Why Participate */}
            <WhyParticipate />

            {/* Event Coordinators */}
            <Coordinators />

            {/* Poster Gallery */}
            <Posters />
          </>
        )}

        {currentView === 'events' && (
          <div className="pt-24 pb-12">
            <EventsList
              onSelectEvent={handleOpenDetailModal}
              onRegisterEvent={handleStartRegistration}
            />
          </div>
        )}

        {currentView === 'register' && (
          <div className="pt-24 pb-12">
            <DynamicRegistrationForm
              key={currentRegistrationEvent.slug}
              event={currentRegistrationEvent}
              onSubmitSuccess={handleRegistrationSuccess}
              onCancel={() => navigateTo('events')}
            />
          </div>
        )}

        {currentView === 'success' && (
          <div className="pt-24 pb-16">
            <RegistrationSuccess
              eventName={successfulRegistration?.event?.name}
              onReturnHome={() => navigateTo('home')}
              onBrowseCompetitions={() => navigateTo('events')}
            />
          </div>
        )}
      </main>

      {/* Global Event Detail Modal */}
      <EventDetailModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        onRegister={handleStartRegistration}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(view, slug) => navigateTo(view, slug)}
        onSelectEvent={handleOpenDetailModal}
      />
    </div>
  );
}
