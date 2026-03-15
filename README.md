# Government Scheme Eligibility Checker

A modern, responsive web application designed to help citizens find and manage government schemes and exams based on their eligibility.

## Features

- **Personalized Recommendations**: Find schemes and exams tailored to your age, gender, category, and income.
- **Admin Dashboard**: Comprehensive management interface for schemes, exams, and user statistics.
- **Dynamic Eligibility Filtering**: Built-in logic to cross-reference user profiles with scheme requirements.
- **"Show All" Toggle**: Explore all available opportunities even if not currently eligible.
- **Authentication & Roles**: Secure login with automatic admin redirection.

## Tech Stack

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend & Auth**: Supabase.
- **Icons**: Lucide React.
- **Styling**: Modern dark-themed design with glassmorphism effects.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

### Local Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/MouliRitchie/Govt-scheme-eligibility-checker.git
   cd Govt-scheme-eligibility-checker
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Environment variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```sh
   npm run dev
   ```

## Database Setup

To populate the database with schemes and exams:

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/htvhahlwfkevrmdkyrbf/sql).
2. Create the necessary tables (`schemes`, `exams`, `profiles`, `user_roles`).
3. Run the provided seed script found in `supabase/seed.sql` (if available) or copy the contents of the generated `comprehensive_seed.sql`.

## Deployment

Simply publish via Lovable or host on platforms like Vercel/Netlify connected to your GitHub repository.
