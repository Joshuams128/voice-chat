# Dena V2 - Setup Instructions

## Quick Start

### 1. Install Dependencies

Already done! The project has all necessary packages installed.

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cd /workspaces/voice-chat/dena-v2
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual API keys:

#### Get Clerk API Keys

1. Go to [https://clerk.com](https://clerk.com) and sign up or log in
2. Create a new application
3. Go to **API Keys** in your Clerk Dashboard: [https://dashboard.clerk.com/last-active?path=api-keys](https://dashboard.clerk.com/last-active?path=api-keys)
4. Copy your **Publishable Key** and **Secret Key**
5. Paste them into `.env.local`:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx  # or pk_test_xxxxx
   CLERK_SECRET_KEY=sk_live_xxxxx  # or sk_test_xxxxx
   ```

#### Get OpenAI API Key

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Click **Create new secret key**
4. Copy the key and paste into `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-proj-xxxxx
   ```

#### Get Supabase Keys (Optional - for conversation history)

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy the **URL** and **anon public** key
5. Paste into `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the Application

1. You should be redirected to sign in
2. Click **Sign Up** to create a new account
3. After signing up, you'll be redirected to `/chat`
4. Try the starter prompts or ask Dena anything about GTM strategy!

## Clerk Integration Details

This app uses the **latest Clerk + Next.js App Router** integration:

- ✅ `clerkMiddleware()` from `@clerk/nextjs/server` in `middleware.ts`
- ✅ `<ClerkProvider>` wrapping the app in `app/layout.tsx`
- ✅ Clerk components: `<SignIn>`, `<SignUp>`, `<UserButton>`
- ✅ Server-side auth with `auth()` from `@clerk/nextjs/server`
- ✅ Protected routes via middleware
- ✅ Environment variables in `.env.local` (never committed to git)

## Troubleshooting

### "Clerk: Missing publishableKey"
- Make sure you've created `.env.local` from `.env.local.example`
- Verify your Clerk keys are correctly copied
- Restart the dev server after adding environment variables

### "OpenAI API error"
- Ensure you have credits in your OpenAI account
- Verify your API key is active and correct
- Check the model name is `gpt-4` or `gpt-4-turbo` (requires access)

### Authentication not working
- Clear your browser cookies and try again
- Check Clerk Dashboard to see if users are being created
- Verify the redirect URLs match in both `.env.local` and Clerk Dashboard

## Next Steps

- Add conversation history with Supabase (see [DATABASE.md](DATABASE.md))
- Customize Dena's personality in `lib/prompts.ts`
- Adjust the theme colors in `tailwind.config.ts`
- Deploy to Vercel or your preferred platform
