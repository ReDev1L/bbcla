# Backpack Brawl Combat Log Analyzer

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

A powerful web application for analyzing Backpack Brawl combat logs, providing detailed insights into player performance, item usage, and combat statistics. Built with Next.js, TypeScript, Cloudflare D1, and AG Charts.

## Features

- 📊 **Real-time Combat Analysis** - Parse and analyze combat logs instantly
- 📈 **Interactive Charts** - Visualize damage over time, player comparisons, and item usage with AG Charts
- 💾 **D1 Database Storage** - Persist combat sessions in Cloudflare D1 for historical analysis
- ⚡ **Edge Computing** - Deploy to Cloudflare Workers for global low-latency access
- 🎨 **Modern UI** - Beautiful, responsive interface with dark mode support
- 📱 **Mobile-Friendly** - Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Charts**: AG Charts React
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **ORM**: Drizzle ORM for type-safe database access
- **Deployment**: Cloudflare Workers via OpenNext
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ 
- pnpm 10+
- Cloudflare account
- Wrangler CLI

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Cloudflare D1 Database

Create a D1 database:

```bash
pnpm wrangler d1 create combat-logs-db
```

Copy the database ID from the output and update `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "combat-logs-db",
    "database_id": "YOUR_DATABASE_ID" // Replace with your actual database ID
  }
]
```

### 3. Apply Database Migrations

Using Drizzle ORM migrations:

```bash
pnpm db:migrate
```

For local development:

```bash
pnpm db:migrate:local
```

**Note**: Migrations are auto-generated from the schema using `pnpm db:generate`

### 4. Generate TypeScript Types

Generate Cloudflare environment types:

```bash
pnpm cf-typegen
```

## Development

### Local Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

Build the application:

```bash
pnpm build
```

### Preview Production Build

Preview the production build locally:

```bash
pnpm preview
```

## Deployment

### Deploy to Cloudflare Workers

```bash
pnpm deploy
```

This will:
1. Build your Next.js application
2. Optimize it for Cloudflare Workers using OpenNext
3. Deploy to Cloudflare's global network

## Usage

1. **Paste Combat Log**: Copy your combat log from Backpack Brawl and paste it into the text area
2. **Load Sample**: Click "Load Sample 1" or "Load Sample 2" to see example analysis
3. **Analyze**: Click "Analyze Combat Log" to process the log
4. **View Results**: Explore the charts, statistics, and detailed breakdowns

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/      # Combat log analysis API (Drizzle ORM)
│   │   │   └── sessions/     # Session history API (Drizzle ORM)
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   ├── DamageChart.tsx   # Damage over time chart
│   │   ├── PlayerStatsChart.tsx # Player comparison chart
│   │   ├── ItemUsageChart.tsx   # Item usage chart
│   │   ├── StatsTable.tsx    # Detailed statistics table
│   │   └── LogInput.tsx      # Log input form
│   ├── db/
│   │   ├── schema.ts         # Drizzle ORM schema
│   │   └── index.ts          # Database initialization
│   ├── lib/
│   │   └── logParser.ts      # Combat log parser utility
│   └── types/
│       └── combat.ts         # TypeScript type definitions
├── drizzle/
│   └── migrations/           # Auto-generated SQL migrations
├── public/
│   ├── sample_log1.txt       # Sample combat log 1
│   └── sample_log2.txt       # Sample combat log 2
├── drizzle.config.ts         # Drizzle Kit configuration
├── wrangler.jsonc            # Cloudflare Workers configuration
├── open-next.config.ts       # OpenNext configuration
└── package.json              # Dependencies and scripts

```

## Database Schema

The application uses **Drizzle ORM** with four main tables:

- **combat_sessions** - Store session metadata
- **combat_events** - Store individual combat events
- **player_stats** - Store aggregated player statistics
- **item_usage** - Store item usage statistics per player

See `src/db/schema.ts` for the Drizzle schema definition.

### Drizzle ORM Features

✅ Type-safe queries with full TypeScript support  
✅ Auto-generated migrations from schema  
✅ Batch insert operations for performance  
✅ Built-in indexes for optimized queries  
✅ Drizzle Studio for visual database exploration  

See [DRIZZLE_SETUP.md](./DRIZZLE_SETUP.md) for detailed ORM usage.

## API Endpoints

### POST `/api/analyze`

Analyze a combat log and return detailed insights.

**Request:**
```json
{
  "logText": "0.0s\tGuest 72981\tDanger Candle gained +33% speed\n..."
}
```

**Response:**
```json
{
  "session": { ... },
  "playerStats": [ ... ],
  "itemUsage": [ ... ],
  "timeline": [ ... ]
}
```

### GET `/api/sessions`

Retrieve recent combat sessions.

**Response:**
```json
{
  "sessions": [
    {
      "sessionId": "session_...",
      "playerNames": ["Player1", "Player2"],
      "totalDuration": 13.3,
      "totalEvents": 105,
      "createdAt": "2025-10-02T12:00:00.000Z"
    }
  ]
}
```

## Scripts

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the Next.js application
- `pnpm start` - Start production server (for testing)
- `pnpm lint` - Run ESLint

### Deployment
- `pnpm deploy` - Build and deploy to Cloudflare Workers
- `pnpm preview` - Build and preview locally with Wrangler
- `pnpm cf-typegen` - Generate Cloudflare environment types

### Database (Drizzle ORM)
- `pnpm db:generate` - Generate migrations from schema
- `pnpm db:migrate` - Apply migrations to production
- `pnpm db:migrate:local` - Apply migrations to local database
- `pnpm db:studio` - Open Drizzle Studio (visual database browser)

## Environment Variables

For local development, create a `.dev.vars` file:

```
# Add any environment variables here if needed
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by [Rapidfire Games](https://rapidfire.games/) or [Azur Games](https://azurgames.com/). Backpack Brawl is a trademark and property of Rapidfire Games and Azur Games. This tool is an independent fan-made project created for educational and analytical purposes.

## Acknowledgments

- Backpack Brawl - The game ([Google Play](https://play.google.com/store/apps/details?id=com.rapidfiregames.backpackbrawl) | [App Store](https://apps.apple.com/us/app/backpack-brawl-hero-battles/id6479175676))
- [Next.js](https://nextjs.org/) - React framework
- [AG Charts](https://charts.ag-grid.com/) - Charting library
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
- [OpenNext](https://opennext.js.org/) - Next.js adapter for Cloudflare
