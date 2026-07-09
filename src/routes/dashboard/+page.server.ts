import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  // Route Guard: If not logged in, redirect to register page
  if (!session) {
    throw redirect(303, '/auth/register');
  }

  return {
    user: session.user,
  };
};
