// src/lib/services/jobService.svelte.ts
import { api } from '../api/client';
import { appState } from '../appState.svelte';
import { connectWS, disconnectWS } from '../ws/socket';
import type { Job, Candidate } from '../api/types';
import type { TransactionStep, JobRequest, WorkerProfile } from '../types';

class JobService {
  transactionStep = $state<TransactionStep>('idle');
  jobRequest = $state<JobRequest>({
    category: '',
    description: '',
    location: '',
    duration: '',
    budget: ''
  });
  selectedWorker = $state<WorkerProfile | null>(null);
  candidates = $state<WorkerProfile[]>([]);

  init() {
    connectWS((msg) => this.handleWSMessage(msg));
    this.resumeActiveJob();
  }

  destroy() {
    disconnectWS();
  }

  private handleWSMessage(msg: any) {
    console.log("WS Received:", msg);
    const role = appState.user?.active_role;
    
    if (msg.type === 'job.matched' && role === 'worker') {
      this.transactionStep = 'proposal_sent';
      // In a real app, we might want to fetch the job details here
    }
    
    if (msg.type === 'job.accepted' && role === 'employer') {
      this.transactionStep = 'accepted';
    }

    if (msg.type === 'job.completed') {
       this.transactionStep = 'waiting_approval';
    }
    
    if (msg.type === 'payment.held' && role === 'worker') {
       // logic for payment held
    }
  }

  async resumeActiveJob() {
    const role = appState.user?.active_role;
    if (!role) return;
    
    try {
      const endpoint = role === 'employer' ? '/jobs/employer' : '/jobs/worker';
      const activeJobs = await api.get<Job[]>(`${endpoint}?status=matched,accepted,arrived,working,waiting_approval`);
      
      if (activeJobs && activeJobs.length > 0) {
        const job = activeJobs[0];
        appState.currentJob = job;
        
        this.mapJobToState(job, role);
      }
    } catch (err) {
      console.error("Failed to resume job session:", err);
    }
  }

  private mapJobToState(job: Job, role: string) {
    // Map backend status to transactionStep
    switch(job.status) {
      case 'matched': 
        this.transactionStep = role === 'employer' ? 'kandidat_list' : 'proposal_sent';
        break;
      case 'accepted': this.transactionStep = 'accepted'; break;
      case 'arrived': this.transactionStep = 'arrived'; break;
      case 'working' as any: this.transactionStep = 'working'; break;
      case 'waiting_approval' as any: this.transactionStep = 'waiting_approval'; break;
      default: this.transactionStep = 'idle';
    }

    this.jobRequest = {
      category: job.skill_category?.label || 'Pekerjaan',
      description: job.description,
      location: 'Lokasi Aktif',
      duration: 'Disesuaikan',
      budget: `Rp ${job.budget.toLocaleString('id-ID')}`
    };

    if (job.worker) {
      this.selectedWorker = {
        name: job.worker.full_name,
        avatar: job.worker.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.worker.full_name)}`,
        rating: 4.8,
        completedJobs: 10,
        distance: '0 km',
        status: 'Aktif',
        skills: [job.skill_category?.label || 'Umum'],
        price: `Rp ${job.budget.toLocaleString('id-ID')}`,
        worker_id: job.worker.id
      };
    }
  }

  reset() {
    this.transactionStep = 'idle';
    this.selectedWorker = null;
    this.candidates = [];
    appState.currentJob = null;
  }
}

export const jobService = new JobService();
