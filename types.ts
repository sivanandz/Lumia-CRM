
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
  schemeName: string;
  category: string;
  nav: number;
  returns1Y: number;
  rating: number;
}

export interface GroundingChunk {
  web?: {
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
