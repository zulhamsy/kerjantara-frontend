// src/lib/appState.svelte.ts

class AppState {
  // Onboarding States
  userName = $state('Budi Santoso');
  userEmail = $state('kerjantara@example.com');
  userRole = $state<'jobseeker' | 'client'>('jobseeker');
  otpVerified = $state(false);
  documentType = $state('KTP');
  docPhoto = $state<string | null>(null);
  selfiePhoto = $state<string | null>(null);
  termsAgreed = $state(false);

  // Reset helper
  reset() {
    this.userName = '';
    this.userEmail = '';
    this.userRole = 'jobseeker';
    this.otpVerified = false;
    this.documentType = 'KTP';
    this.docPhoto = null;
    this.selfiePhoto = null;
    this.termsAgreed = false;
  }
}

export const appState = new AppState();
