// src/lib/appState.svelte.ts

import type { User, Job } from './api/types';

class AppState {
  // Onboarding States
  userName = $state('Budi Santoso');
  userEmail = $state('kerjantara@example.com');
  userRole = $state<'worker' | 'employer'>('worker');
  otpVerified = $state(false);
  documentType = $state('KTP');
  docPhoto = $state<string | null>(null);
  selfiePhoto = $state<string | null>(null);
  termsAgreed = $state(false);

  // Backend States
  user = $state<User | null>(null);
  isAuthenticated = $derived(!!this.user);
  currentJob = $state<Job | null>(null);

  // Reset helper
  reset() {
    this.userName = '';
    this.userEmail = '';
    this.userRole = 'worker';
    this.otpVerified = false;
    this.documentType = 'KTP';
    this.docPhoto = null;
    this.selfiePhoto = null;
    this.termsAgreed = false;
    this.user = null;
    this.currentJob = null;
  }
}

export const appState = new AppState();
