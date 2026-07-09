# Nikash Crackers - Premium Sivakasi Fireworks

A premium web application for Nikash Crackers, offering high-quality Sivakasi fireworks and crackers with order management, WhatsApp notifications, and email alerts via Resend.

## Tech Stack
- **Framework:** Next.js (TypeScript)
- **Database:** Supabase
- **Email Notifications:** Resend API
- **Styling:** Tailwind CSS

## Getting Started

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Environment Variables Configuration
Create a `.env.local` file in the root directory (already ignored by Git) and add your keys:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
SENDER_EMAIL=orders@rmnikashcrackers.com
```

### 3. Development Server
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Custom Scripts
- **Seed Products:** `npm run db:seed`
- **Test Email Dispatch:** `npm run test-email` (verifies Resend API credentials)
