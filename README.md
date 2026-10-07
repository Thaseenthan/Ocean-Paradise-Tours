# Ocean Paradise Tours

Ocean Paradise Tours is a responsive tourism booking and content management platform for curated ocean adventures. Guests can explore tours, galleries, testimonials, FAQs, and company information before submitting a booking. Authorized administrators can manage the website content and booking pipeline from a protected dashboard.

## Features

### Public website

- Responsive home, tours, gallery, about, contact, and booking pages
- Tour cards with descriptions, pricing, duration, ratings, highlights, and images
- Tour-specific booking links with preselected tour details
- Booking form for customer details, dates, guest counts, and notes
- WhatsApp handoff with a prefilled booking message
- Booking confirmation email through a Supabase Edge Function
- Testimonials and FAQ accordion sections
- Editable contact details, hero content, about content, social links, and map embed
- Animated page transitions and SEO metadata

### Admin dashboard

- Supabase Auth protected admin routes
- Dashboard with booking and content overview
- Create, edit, and delete tours
- Manage tour images and gallery images through Supabase Storage
- Review bookings and update booking status
- Manage testimonials, FAQs, and website content
- Update contact details, hero content, and admin password

## Tech Stack

- React 18
- Vite
- Tailwind CSS 4
- React Router
- Framer Motion
- Supabase Auth, PostgreSQL, Storage, and Edge Functions
- JavaScript
- Vercel

## Project Structure

```text
src/
	admin/          Admin dashboard pages and management views
	components/     Reusable public and shared UI components
	hooks/          Authentication, data fetching, and metadata hooks
	layouts/        Public and admin route layouts
	pages/          Public pages and admin login
	services/       Supabase-backed application services
	supabase/       Supabase client and table definitions
	utils/          Constants, formatters, and motion helpers
supabase/
	setup.sql       Database tables, storage buckets, and policies
	functions/      Supabase Edge Functions
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project for persistent data and authentication

### Installation

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Start the development server:

```bash
npm run dev
```

The application is available at `http://localhost:5173`.

## Supabase Setup

1. Create or open a Supabase project.
2. Open the Supabase SQL Editor.
3. Run [`supabase/setup.sql`](supabase/setup.sql).
4. Confirm that the `tour-images` and `gallery-images` Storage buckets were created.
5. Create an admin user in Supabase Auth.
6. Set the user's `app_metadata.role` value to `admin`.
7. Add tours through the admin dashboard or directly in the `tours` table.

The SQL setup creates tables for users, tours, gallery items, bookings, testimonials, FAQs, and editable website content.

### Booking confirmation email

The booking form invokes the `send-booking-confirmation` Edge Function after saving a booking. To enable Gmail delivery, configure these function secrets before deploying the function:

```bash
supabase secrets set \\
	GMAIL_USER=your-sender@gmail.com \\
	GMAIL_APP_PASSWORD=your-gmail-app-password \\
	GMAIL_FROM_NAME="Ocean Paradise Tours"
```

Deploy the function with:

```bash
supabase functions deploy send-booking-confirmation
```

The Gmail app password should be stored as a Supabase secret and never committed to the repository.

## Demo Mode

If Supabase environment variables are missing, the app starts in demo mode. The UI remains available for local exploration, while database-backed reads and writes are replaced by fallback behavior. Configure Supabase before using the application with real customer or booking data.

## Available Scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Deployment

The frontend can be deployed to Vercel:

1. Import the repository into Vercel.
2. Set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables.
3. Use `npm run build` as the build command.
4. Use the project root as the deployment directory.
5. Deploy the Supabase Edge Function separately with the Supabase CLI.

## Security Note

The included SQL policies are intentionally permissive for development and demo use. They allow direct client-side reads and writes. Before deploying publicly, replace the public write policies with authenticated admin-only policies or move privileged operations behind a server-side API. Never expose a Supabase service role key in frontend environment variables.
