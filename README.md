# Personal OS - Self-Improvement App

A comprehensive personal development application built with Next.js 13+ and Supabase for tracking daily habits, feelings, overthinking, and AI-powered insights.

## Features

- **Daily Journaling** - Track SWE hours, sleep quality, and more
- **Feelings Journal** - Mood, motivation, and stress assessment
- **Overthinking Journal** - Capture thoughts to reflect on later
- **Checklists** - Manage daily routines and habits
- **Analytics Dashboard** - Visualize your progress over time
- **AI Insights** - Weekly review powered by AI analysis
- **Settings** - Account management and preferences

## Tech Stack

- **Next.js 13+** (App Router)
- **Supabase** (Database, Auth, Storage)  
- **Tailwind CSS** (Styling)
- **TypeScript** (Type Safety)
- **Shadcn/ui** (UI Components)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-os
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```bash
app/                    # Next.js App Router pages
├── api/               # API routes
├── components/        # Reusable UI components
├── lib/               # Utility functions and services
└── styles/            # Global styles

supabase/              # Supabase database schema
```

## Database Schema

The application uses Supabase with the following tables:

- `profiles` - User profiles and settings
- `diary_entries` - Daily journals with SWE hours, sleep, etc.
- `feelings` - Mood and emotional states  
- `overthoughts` - Thoughts and reflections
- `checklist_templates` - Reusable checklist templates
- `checklist_instances` - Instance of checklists for specific days
- `ai_reviews` - Weekly AI insights and recommendations

## API Routes

- `/api/profile` - User profile operations
- `/api/diary` - Diary entry management  
- `/api/feelings` - Feelings journal
- `/api/checklists` - Checklist templates and instances
- `/api/overthinking` - Thoughts capture
- `/api/analytics` - Data analytics endpoint

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.