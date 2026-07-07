# LOTTO AI - Smart Lottery Prediction with Horoscope

AI-powered lottery prediction system with horoscope integration for Thai, Vietnam, and Laos lotteries.

## Features

- **Multi-Lottery Support**: Thai Lottery, Vietnam XSMB, and Laos Lottery
- **AI Predictions**: Statistical analysis and pattern recognition for smarter predictions
- **Horoscope Integration**: Chinese astrology (Zi Wei Dou Shu) for personalized lucky numbers
- **Membership System**: Email and Google authentication
- **Modern UI**: Beautiful, responsive design with dark theme

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with email and Google providers
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Horoscope**: iztro library for Zi Wei Dou Shu

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20 or 22)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lottery-prediction
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/lottery_prediction"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
lottery-prediction/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── horoscope/     # Horoscope generation
│   │   │   ├── lottery/       # Lottery data management
│   │   │   └── predictions/   # AI predictions
│   │   ├── dashboard/         # Dashboard page
│   │   ├── horoscope/         # Horoscope page
│   │   ├── login/             # Login page
│   │   └── register/          # Registration page
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       ├── auth.ts            # Authentication configuration
│       ├── horoscope.ts       # Horoscope generation logic
│       ├── prediction-engine.ts # AI prediction algorithms
│       ├── prisma.ts          # Database client
│       ├── scrapers/          # Lottery data scrapers
│       └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Predictions
- `POST /api/predictions` - Generate prediction
- `GET /api/predictions?type=thai` - Get prediction by type

### Lottery Data
- `GET /api/lottery?type=thai&limit=50` - Get lottery draws
- `POST /api/lottery` - Scrape and save lottery data

### Horoscope
- `POST /api/horoscope` - Generate horoscope
- `GET /api/horoscope?birthDate=2000-01-01` - Get horoscope

## Features

### Lottery Systems
- **Thai Lottery**: First prize, last 2/3 digits, running numbers
- **Vietnam XSMB**: Multiple regions with various prize tiers
- **Laos Lottery**: First prize, last 2/3 digits

### AI Prediction Engine
- Frequency analysis
- Hot/cold number detection
- Pattern recognition
- Combined statistical methods

### Horoscope Integration
- Western zodiac analysis
- Chinese zodiac (Zi Wei Dou Shu)
- Five elements balance
- Personalized lucky numbers

## Disclaimer

This application is for entertainment purposes only. Lottery predictions are based on statistical analysis and should not be considered guaranteed. Please gamble responsibly.

## License

MIT License
