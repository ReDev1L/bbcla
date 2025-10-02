# Setup Guide - Backpack Brawl Combat Log Analyzer

This guide will walk you through setting up and deploying the Combat Log Analyzer.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create D1 Database

First, create a new D1 database:

```bash
pnpm wrangler d1 create combat-logs-db
```

You'll see output like this:

```
✅ Successfully created DB 'combat-logs-db'!

[[d1_databases]]
binding = "DB"
database_name = "combat-logs-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Important:** Copy the `database_id` value!

### 3. Update Wrangler Configuration

Open `wrangler.jsonc` and replace `YOUR_DATABASE_ID` with your actual database ID:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "combat-logs-db",
    "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  // Your actual ID here
  }
]
```

### 4. Apply Database Migrations (Drizzle ORM)

Migrations are auto-generated from the Drizzle schema. Apply them:

For **production** database:

```bash
pnpm db:migrate
```

For **local development** database:

```bash
pnpm db:migrate:local
```

**Recommendation:** Run both commands to set up both local and production databases.

**Note:** If you need to regenerate migrations after schema changes:
```bash
pnpm db:generate
```

### 5. Generate TypeScript Types

```bash
pnpm cf-typegen
```

This generates the `cloudflare-env.d.ts` file with proper types for your D1 binding.

## Development

### Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 to see your app.

**Note:** In local development mode, the D1 database binding may not work exactly as in production. The app will still function for log analysis, but data won't persist to the database.

### Test with Sample Logs

1. Click "Load Sample 1" or "Load Sample 2" to load example combat logs
2. Click "Analyze Combat Log" to see the analysis
3. Explore the charts and statistics

## Testing Production Build Locally

### Preview with Wrangler

```bash
pnpm preview
```

This builds your app and runs it with Wrangler, which provides a more accurate simulation of the Cloudflare Workers environment, including D1 bindings.

## Deployment

### Deploy to Cloudflare Workers

```bash
pnpm deploy
```

This command will:

1. Build your Next.js application
2. Adapt it for Cloudflare Workers using OpenNext
3. Deploy to Cloudflare's global network

### First-Time Deployment

If this is your first deployment, you may need to:

1. **Login to Wrangler:**
   ```bash
   pnpm wrangler login
   ```

2. **Verify your account:**
   Follow the browser prompts to authenticate

3. **Deploy:**
   ```bash
   pnpm deploy
   ```

### Subsequent Deployments

After the first deployment, simply run:

```bash
pnpm deploy
```

## Verify Deployment

After deployment, you'll see output like:

```
Uploaded combat-log-analyzer (X.XX sec)
Published combat-log-analyzer (X.XX sec)
  https://combat-log-analyzer.your-subdomain.workers.dev
Current Deployment ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Visit the URL to see your live application!

## Database Management

### View Database Data

To query your production database:

```bash
pnpm wrangler d1 execute combat-logs-db --command="SELECT * FROM combat_sessions LIMIT 10"
```

To query your local database:

```bash
pnpm wrangler d1 execute combat-logs-db --local --command="SELECT * FROM combat_sessions LIMIT 10"
```

### Backup Database

```bash
pnpm wrangler d1 backup create combat-logs-db
```

### List Backups

```bash
pnpm wrangler d1 backup list combat-logs-db
```

## Troubleshooting

### Issue: "DB is not defined"

**Solution:** Make sure you've:
1. Created the D1 database
2. Updated `wrangler.jsonc` with the correct `database_id`
3. Run the schema initialization
4. Generated types with `pnpm cf-typegen`

### Issue: Database schema errors

**Solution:** Drop and recreate the database:

```bash
# For local
pnpm wrangler d1 execute combat-logs-db --local --command="DROP TABLE IF EXISTS combat_sessions; DROP TABLE IF EXISTS combat_events; DROP TABLE IF EXISTS player_stats; DROP TABLE IF EXISTS item_usage;"
pnpm wrangler d1 execute combat-logs-db --local --file=./schema.sql

# For production
pnpm wrangler d1 execute combat-logs-db --command="DROP TABLE IF EXISTS combat_sessions; DROP TABLE IF EXISTS combat_events; DROP TABLE IF EXISTS player_stats; DROP TABLE IF EXISTS item_usage;"
pnpm wrangler d1 execute combat-logs-db --file=./schema.sql
```

### Issue: Build errors during deployment

**Solution:** 
1. Clear Next.js cache: `rm -rf .next`
2. Clear OpenNext output: `rm -rf .open-next`
3. Rebuild: `pnpm build`
4. Deploy again: `pnpm deploy`

### Issue: Charts not displaying

**Solution:** Ensure AG Charts packages are installed:

```bash
pnpm install ag-charts-community ag-charts-react
```

## Environment Variables

For local development, you can create a `.dev.vars` file in the project root:

```
# Add environment variables here if needed
# Example:
# API_KEY=your-api-key
```

For production, set secrets using Wrangler:

```bash
pnpm wrangler secret put API_KEY
```

## Performance Tips

1. **Enable Smart Placement** - Uncomment in `wrangler.jsonc`:
   ```jsonc
   "placement": { "mode": "smart" }
   ```

2. **Monitor Usage** - Check your Cloudflare dashboard for:
   - Request counts
   - D1 query performance
   - Error rates

3. **Database Indexing** - The schema includes indexes for common queries. Monitor slow queries and add indexes as needed.

## Next Steps

- Customize the UI styling in `src/app/globals.css`
- Add more chart types in `src/components/`
- Extend the log parser for additional game events
- Add user authentication
- Implement session history browsing
- Add export functionality (PDF, CSV)

## Support

For issues or questions:
- Check the [README.md](./README.md) for more details
- Review Cloudflare D1 documentation: https://developers.cloudflare.com/d1/
- Review OpenNext documentation: https://opennext.js.org/cloudflare

Happy analyzing! ⚔️

