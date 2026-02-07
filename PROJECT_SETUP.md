# Tournament Registration System - Project Setup & Architecture

## 📋 Project Overview

A professional esports tournament registration and management platform built with Next.js 15, React 19, PostgreSQL, and Tailwind CSS. Supports BGMI (Battlegrounds Mobile India) tournament registrations with team management, match scheduling, and admin controls.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS + Shadcn UI Components
- **Notifications:** Sonner (Toast library)
- **Icons:** Lucide React
- **Animations:** Tailwind CSS animations

### Backend
- **Runtime:** Node.js
- **API Routes:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** Custom (JWT + HTTP-only cookies + bcrypt)
- **SMS Service:** Twilio / MSG91 (OTP)

### Deployment
- **Hosting:** Vercel
- **Database:** PostgreSQL (Neon/Vercel Postgres recommended)
- **Environment:** Node.js 18+

---

## 📁 Project Structure

```
tournament-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── admin/                   # Admin dashboard pages
│   │   │   ├── users/               # User management
│   │   │   ├── form-management/     # Form submission management
│   │   │   ├── bgmi-schedule/       # Tournament schedule
│   │   │   ├── room-management/     # Match room management
│   │   │   └── ...
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── login/               # Login page
│   │   │   └── register/            # Registration page
│   │   ├── dashboard/               # User dashboard
│   │   │   ├── form/                # Team registration form
│   │   │   ├── profile/             # User profile
│   │   │   ├── security/            # Password management
│   │   │   └── ...
│   │   ├── api/                     # API routes
│   │   │   ├── auth/                # Authentication endpoints
│   │   │   ├── admin/               # Admin endpoints
│   │   │   ├── form/                # Form endpoints
│   │   │   └── ...
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ui/                      # Shadcn UI components
│   │   ├── admin/                   # Admin-specific components
│   │   ├── auth/                    # Auth components
│   │   ├── user/                    # User components
│   │   └── ...
│   ├── db/
│   │   ├── schema/                  # Drizzle schema
│   │   └── index.ts                 # DB connection
│   ├── lib/
│   │   ├── auth.ts                  # Auth utilities
│   │   ├── db.ts                    # DB utilities
│   │   ├── hash.ts                  # Password hashing
│   │   ├── sms-service.ts           # SMS service
│   │   └── validations.ts           # Input validation
│   └── hooks/                       # Custom React hooks
├── drizzle/                         # Database migrations
├── scripts/                         # Utility scripts (seed.ts)
├── public/                          # Static assets
├── middleware.ts                    # Next.js middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── drizzle.config.ts
```

---

## 🗄️ Database Schema

### Core Tables
1. **users** - User accounts with auth credentials
2. **form_data** - Team registration forms (4 players per team)
3. **sessions** - User sessions
4. **verification_tokens** - Email/phone verification
5. **password_reset_tokens** - Password reset flow
6. **form_config** - Dynamic form field configuration
7. **form_status** - Form submission status tracking
8. **registration_config** - Tournament registration settings
9. **bgmi_schedule** - Tournament schedule and maps
10. **user_contact_forms** - Contact form submissions
11. **matches** - Tournament matches/rooms
12. **match_teams** - Team assignments to matches

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Vercel account (for deployment)

### Installation

1. **Clone or Extract Project**
```bash
cd tournament-app
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Set Environment Variables**
Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tournament"

# JWT
JWT_SECRET="your-secret-key-here"

# SMS Service (Twilio or MSG91)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Or MSG91
MSG91_AUTH_KEY="your-msg91-key"

# APP
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Setup Database**
```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Seed sample data
npm run db:seed
```

5. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Default Admin Account
After seeding, use these credentials:
- **Email:** admin@tournament.local
- **Password:** Admin@123

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication

### User Management
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password

### Form/Registration
- `POST /api/form` - Submit team registration
- `GET /api/form` - Get user's form
- `GET /api/form-config` - Get form configuration
- `POST /api/contact` - Submit contact form

### Admin Operations
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/forms` - List all forms
- `GET /api/admin/bgmi-schedule` - Tournament schedule
- `GET /api/admin/room-management` - Match rooms

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ HTTP-only cookies for session storage
- ✅ Input validation and sanitization
- ✅ Rate limiting ready
- ✅ Role-based access control (Admin/User)
- ✅ Secure OTP verification flow
- ✅ CORS protection on API routes

---

## 🎨 Styling System

### Tailwind Colors
- Primary: Purple (#7c3aed)
- Secondary: Cyan/Blue
- Backgrounds: Dark theme with light accents
- Accessible contrast ratios

### Custom Classes
- `.gradient-text` - Gradient text effect
- `.card-glow` - Glowing card effect
- `.hover-lift` - Lift animation on hover
- `.scale-hover` - Scale animation on hover
- `.slide-in` - Slide in animation

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons and inputs
- Mobile menu for navigation

---

## 🧪 Testing Recommendations

1. Test authentication flows (login, register, forgot password)
2. Test form submission and validation
3. Test admin operations (CRUD on users, forms)
4. Test toast notifications (single display)
5. Test responsive design on mobile devices
6. Test dark mode toggle
7. Test data export functionality

---

## 🚢 Deployment to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Visit https://vercel.com
- Import GitHub project
- Add environment variables
- Deploy

3. **Database Setup**
- Use Vercel Postgres or Neon PostgreSQL
- Update DATABASE_URL in Vercel env vars
- Run migrations: `npm run db:push`

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env.local
# Ensure PostgreSQL is running
npm run db:push  # Re-run migration
```

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET env var is set
- Verify database sessions table exists

### Toast Not Showing
- Check Sonner is imported in layout.tsx
- Verify toast calls use `toast()` from sonner
- Check browser console for errors

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Sonner Toast](https://sonner.emilkowal.ski)

---

## 📝 License

This project is private and for tournament management use only.

---
