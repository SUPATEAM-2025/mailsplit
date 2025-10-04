# MailSplit

A modern email management dashboard with Resend/Linear-inspired styling. Built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI.

## Features

- **Email Management**: View and manage incoming emails with clean card-based interface
- **AI-Powered Assignment**: Automatic email routing powered by Algolia's intelligent classification
- **Team Assignment**: Assign emails to specific teams with dropdown selection
- **Notes System**: Add contextual notes to emails for team collaboration
- **Team Management**: Create and manage teams with products and issue categorization
- **Document Upload**: Auto-fill team creation form from uploaded documents
- **Responsive Design**: Clean, minimal design with dark mode and rounded corners

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app
  /layout.tsx          # Root layout with sidebar
  /page.tsx            # Emails list view (default)
  /emails/[id]/page.tsx  # Email detail view
  /teams/page.tsx      # Teams management view
/components
  /sidebar.tsx         # Navigation sidebar
  /email-list.tsx      # Email cards list
  /email-detail.tsx    # Email detail with assignment & notes
  /team-list.tsx       # Teams list with create/upload
  /team-form.tsx       # Team creation form
  /ui/*                # Shadcn UI components
/lib
  /types.ts           # TypeScript interfaces
  /data.ts            # Mock data
  /utils.ts           # Utilities
  /format-date.ts     # Date formatting
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React

## Design System

- **Primary Color**: White highlights on dark background
- **Theme**: Dark mode with subtle accents
- **Rounded Corners**: 0.75rem (rounded-lg, rounded-xl)
- **Typography**: Inter font family
- **Style Inspiration**: Resend/Linear (minimal, clean, modern)

## AI Assignment

Emails are automatically assigned to the most appropriate team using Algolia-powered intelligent classification:

- **Smart Routing**: Analyzes email content, keywords, and context
- **Team Matching**: Considers team specializations and issue categories
- **Manual Override**: Users can reassign emails via dropdown selector
- **Transparency**: Auto-assignments clearly marked with "Auto-generated with Algolia"

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
