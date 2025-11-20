
export enum Tab {
  DASHBOARD = 'Dashboard',
  CLIENTS = 'Clients',
  FUNDS = 'Mutual Funds',
  INSURANCE = 'Insurance',
  CALENDAR = 'Calendar',
  DRIVE = 'Drive',
  AI_ADVISOR = 'AI Advisor'
}

export interface ClientHistoryItem {
  id: string;
  date: string;
  type: 'Meeting' | 'Call' | 'Email' | 'Transaction' | 'System';
  title: string;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  aum: number; // Assets Under Management in INR
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  status: 'Active' | 'Onboarding' | 'Lead';
  lastMeeting: string;
  nextScheduledCall?: string;
  goals: string[];
  tags?: string[];
  avatar: string;
  history?: ClientHistoryItem[];
}

export interface MutualFund {
  id: string;
  name: string; // Changed from schemeName to name to match MOCK_DATA in App.tsx
  category: string;
  nav: number;
  returns1Y?: number;
  rating?: number;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  provider: string;
  type: 'Term' | 'Health' | 'ULIP' | 'Endowment';
  premium: number;
  cover: number;
  features: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  timestamp: Date;
  groundingMetadata?: {
    groundingChunks: GroundingChunk[];
  };
}

export interface DriveFile {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'sheet' | 'doc';
  lastModified: string;
  size?: string;
}

export interface Task {
  id: number;
  text: string;
  done: boolean;
  due: string;
}
