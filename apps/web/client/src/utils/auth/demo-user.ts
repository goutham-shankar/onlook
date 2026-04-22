import { SEED_USER } from '@onlook/db';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const DEMO_TIMESTAMP = '2024-01-01T00:00:00.000Z';

export const DEMO_USER: SupabaseUser = {
    id: SEED_USER.ID,
    aud: 'authenticated',
    role: 'authenticated',
    email: SEED_USER.EMAIL,
    email_confirmed_at: DEMO_TIMESTAMP,
    phone: '',
    confirmed_at: DEMO_TIMESTAMP,
    last_sign_in_at: DEMO_TIMESTAMP,
    app_metadata: {
        provider: 'email',
        providers: ['email'],
    },
    user_metadata: {
        first_name: SEED_USER.FIRST_NAME,
        last_name: SEED_USER.LAST_NAME,
        display_name: SEED_USER.DISPLAY_NAME,
        avatarUrl: SEED_USER.AVATAR_URL,
        avatar_url: SEED_USER.AVATAR_URL,
    },
    identities: [],
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
    is_anonymous: false,
};