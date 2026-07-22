import { api, setBackendToken, getBackendToken } from './client';
import { supabase } from '../supabaseClient';
import { appState } from '../appState.svelte';
import type { LoginResponse } from './types';

export async function syncSupabaseWithBackend(force = false) {
  // Prevent redundant hits if user is already synced
  if (!force && appState.user) {
    return { token: getBackendToken(), ...appState.user as any };
  }

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No supabase session found');
  }

  try {
    // Exchange Supabase token for Backend JWT
    const data = await api.post<LoginResponse>('/auth/google', {
      access_token: session.access_token
    });

    if (data.token) {
      setBackendToken(data.token);
      
      // Update onboarding states for consistency
      appState.userName = data.full_name;
      appState.userEmail = session.user.email || '';

      // Map response to our User state (handling flattened response)
      appState.user = {
        id: data.user_id,
        full_name: data.full_name,
        role: (data.role as any) || '',
        verif_status: data.verif_status,
        phone: '', // Backend response might not have phone yet in this endpoint
        email: session.user.email || '',
        active_role: (data.role as any) || '',
        is_active_worker: false,
        created_at: new Date().toISOString()
      };
      return data;
    }
    throw new Error('Failed to get token from backend');
  } catch (err) {
    console.error('Error syncing with backend:', err);
    throw err;
  }
}

export async function activateRole(role: 'worker' | 'employer', skill_cat_ids?: number[]) {
  try {
    const data = await api.post<LoginResponse>('/auth/roles/activate', { 
      role,
      skill_cat_ids: skill_cat_ids || []
    });
    if (data.token) {
      setBackendToken(data.token);
      if (appState.user) {
        appState.user.role = data.role as any;
        appState.user.active_role = data.role as any;
      }
      return data;
    }
    throw new Error('Failed to activate role');
  } catch (err) {
    console.error('Error activating role:', err);
    throw err;
  }
}

export async function uploadVerification(ktpBlob: Blob, selfieBlob: Blob) {
  const formData = new FormData();
  formData.append('ktp_photo', ktpBlob, 'ktp.jpg');
  formData.append('selfie_photo', selfieBlob, 'selfie.jpg');

  try {
    const data = await api.upload<any>('/auth/ktp/upload', formData);
    if (appState.user) {
      appState.user.verif_status = 'pending';
    }
    return data;
  } catch (err) {
    console.error('Error uploading verification:', err);
    throw err;
  }
}
