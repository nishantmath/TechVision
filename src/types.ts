export type EventSlug =
  | 'ideacanvas'
  | 'techspeak'
  | 'innovatex'
  | 'coderush'
  | 'iic-ignite'
  | 'techvision';

export interface EventFieldOption {
  label: string;
  value: string;
}

export interface DynamicFormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'url' | 'email';
  placeholder?: string;
  required: boolean;
  options?: EventFieldOption[];
  helperText?: string;
  defaultValue?: string | number;
  condition?: {
    field: string;
    value: string | number | boolean;
  };
}

export interface EventScheduleItem {
  time: string;
  activity: string;
  description?: string;
}

export interface EventConfig {
  number: string;
  slug: EventSlug;
  name: string;
  subtitle: string;
  tagline?: string;
  shortDescription?: string;
  fullDescription?: string;
  date: string;
  formattedDate: string;
  time: string;
  reportingTime?: string;
  venue?: string;
  mode: 'Offline' | 'Online' | 'Hybrid';
  themeColor: string;
  accentColor: string;
  badge: string;
  teamBased: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  noRegistrationRequired?: boolean;
  targetParticipants?: string;
  recommendedCapacity?: string;
  scalableCapacity?: string;
  theme?: string;
  topicTrack?: string;
  positionsInfo?: string;
  debateTopics?: {
    round: string;
    title: string;
    topic: string;
  }[];
  posterGuidelines?: string[];
  challengeDomains?: string[];
  solutionIncludes?: string[];
  format?: string[];
  eligibility?: string[];
  rules?: string[];
  requirements?: string[];
  schedule?: EventScheduleItem[];
  coordinators?: {
    name: string;
    role: string;
    contact?: string;
  }[];
  fields: DynamicFormField[];
}

export interface TeammateInfo {
  name: string;
  email: string;
  phone?: string;
  rollNo: string;
  department: string;
  year?: string;
  college?: string;
  role?: string;
}

export interface CommonParticipantInfo {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  studentId: string;
}

export interface RegistrationRecord {
  registrationId: string;
  eventSlug: EventSlug;
  eventName: string;
  timestamp: string;
  participant: CommonParticipantInfo;
  teamName?: string;
  teamSize?: number;
  teammates?: TeammateInfo[];
  eventData: Record<string, any>;
  syncedToGoogleSheets?: boolean;
}

export interface RegistrationStats {
  total: number;
  byEvent: Record<EventSlug, number>;
  recentRegistrations: RegistrationRecord[];
}
