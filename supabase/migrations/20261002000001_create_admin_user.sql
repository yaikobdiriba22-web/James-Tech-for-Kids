-- ==============================================================================
-- James Tech for Kids - Admin User Provisioning Script
-- Email: jamesechsolutionandacademy@gmail.com
-- ==============================================================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  user_email TEXT := 'jamesechsolutionandacademy@gmail.com';
  user_password TEXT := 'Yaex@0906521758';
BEGIN
  -- 1. Check if user already exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    -- Insert into auth.users with pre-confirmed email
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      user_email,
      crypt(user_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"James Tech Academy Admin","role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Insert into public.profiles
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      user_email,
      'James Tech Academy Admin',
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', full_name = 'James Tech Academy Admin';

    RAISE NOTICE 'Admin user % created and confirmed successfully!', user_email;
  ELSE
    -- If user already exists, update encrypted password and confirm email
    UPDATE auth.users
    SET
      encrypted_password = crypt(user_password, gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}'::jsonb,
      updated_at = NOW()
    WHERE email = user_email;

    UPDATE public.profiles
    SET role = 'admin'
    WHERE email = user_email;

    RAISE NOTICE 'Existing user % updated to admin with the requested password!', user_email;
  END IF;
END $$;
