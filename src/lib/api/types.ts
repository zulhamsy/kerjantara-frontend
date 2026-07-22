// src/lib/api/types.ts

export interface User {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: 'worker' | 'employer' | 'admin';
  active_role: 'worker' | 'employer' | 'admin';
  verif_status: 'unverified' | 'pending' | 'approved' | 'rejected';
  is_active_worker: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface SkillCategory {
  id: number;
  code: string;
  label: string;
  icon_key?: string;
  children?: SkillCategory[];
}

export interface RateCard {
  id: number;
  skill_cat_id: number;
  city_code: string;
  min_rate: number;
  max_rate: number;
  rate_unit: string;
  label: string;
}

export interface Job {
  id: string;
  employer_id: string;
  worker_id?: string;
  skill_cat_id: number;
  description: string;
  budget: number;
  status: 'pending' | 'matched' | 'accepted' | 'arrived' | 'done' | 'cancelled';
  lat: number;
  lng: number;
  city_code: string;
  created_at: string;
  skill_category?: SkillCategory;
  worker?: User;
  employer?: User;
}

export interface CreateJobRequest {
  skill_cat_id: number;
  description: string;
  budget: number;
  lat: number;
  lng: number;
  city_code: string;
}

export interface Candidate {
  match_id: string;
  worker_id: string;
  full_name: string;
  kerjantara_score: number;
  total_jobs_done: number;
  distance_km: number;
  price: string;
  bio?: string;
  avatar_url?: string;
}

export interface CreateJobResponse {
  job_id: string;
  status: 'matched' | 'pending_city_fallback';
  candidates: Candidate[];
  budget: number;
  rate_card?: RateCard;
}

export interface AcceptMatchRequest {
  match_id: string;
}

export interface CreatePaymentResponse {
  payment_id: string;
  snap_token: string;
  agreed_price: number;
  platform_fee: number;
  net_to_worker: number;
  total_charged_to_employer: number;
  midtrans_order_id: string;
  fee_note: string;
}

export interface RateJobRequest {
  score: number;
  comment: string;
}

export interface LoginResponse {
  token: string;
  user_id: string;
  full_name: string;
  role: 'worker' | 'employer' | 'admin' | '';
  verif_status: 'unverified' | 'pending' | 'approved' | 'rejected' | 'newuser';
  token_expires_at?: string;
}
