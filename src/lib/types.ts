export interface JobRequest {
  category: string;
  description: string;
  location: string;
  duration: string;
  budget: string;
}

export interface WorkerProfile {
  name: string;
  avatar: string;
  rating: number;
  completedJobs: number;
  distance: string;
  status: string;
  skills: string[];
  price: string;
  bio?: string;
  match_id?: string;
  worker_id?: string;
  personalityFilters?: string[];
  portfolioBeforeAfter?: {
    before: string;
    after: string;
    title: string;
  }[];
}

export type TransactionStep =
  | 'idle'
  | 'creating'
  | 'matching'
  | 'kandidat_list'
  | 'proposal_sent'
  | 'accepted'
  | 'arrived'
  | 'working'
  | 'submitting_proof'
  | 'waiting_approval'
  | 'done';

export interface ChatMessage {
  id: string;
  sender: 'client' | 'worker';
  text: string;
  time: string;
}

export interface DisputeTicket {
  isOpen: boolean;
  reason: string;
  details: string;
  ticketNo: string;
}
