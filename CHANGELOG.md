# Changelog

All notable changes to the Backpack Brawl Combat Log Analyzer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2025-10-02

### Added
- 📄 **Legal Disclaimer** - Added disclaimer to README and footer
  - Clarifies project is not affiliated with Rapidfire Games or Azur Games
  - States Backpack Brawl is a trademark of the game developers
  - Identifies this as an independent fan-made educational project
- 🔗 **Enhanced Footer** - Improved footer with better information architecture
  - Added GitHub repository link with icon
  - Added direct links to Cloudflare D1 and AG Charts documentation
  - Restructured layout for better readability

### Changed
- Footer layout reorganized with centered content and improved spacing
- Technology stack links now clickable and lead to official documentation

## [0.1.1] - 2025-10-02

### Fixed
- 🐛 **Log Parser** - Fixed incorrect parsing of burn mechanics
  - "N Burn extinguished" events no longer treated as items
  - "Burn N Damage" (DoT ticks) now correctly identified as game mechanics
  - Game mechanics now excluded from item usage statistics
  - Prevents pollution of item analysis with non-item events

### Changed
- Game mechanics now labeled with "(Mechanic)" suffix for clarity
- Item usage calculator now filters out all mechanic events

## [0.1.0] - 2025-10-02

### Added
- 🎉 **Initial Beta Release** - Complete combat log analysis application
- ⚔️ **Combat Log Parser** - Intelligent parsing of Backpack Brawl combat logs
  - Supports 15+ event types (damage, healing, buffs, status effects, etc.)
  - Extracts player names, items, actions, and values
  - Handles multi-player combat scenarios
- 📊 **Interactive Charts** - Data visualization with AG Charts React
  - Damage over time line chart
  - Player stats comparison bar chart
  - Top items usage chart
- 📈 **Statistical Analysis** - Comprehensive combat metrics
  - Total damage, healing, and armor per player
  - Critical hits, misses, and status effects tracking
  - Item usage frequency and effectiveness
- 💾 **Drizzle ORM Integration** - Type-safe database access
  - Auto-generated migrations from schema
  - Batch insert operations for performance
  - Drizzle Studio support for visual database browsing
- 🗄️ **Cloudflare D1 Database** - Serverless SQLite storage
  - 4-table schema for comprehensive data storage
  - Indexed for optimal query performance
  - Historical session tracking
- 🎨 **Modern UI/UX** - Beautiful, responsive interface
  - Dark mode support
  - Mobile-friendly design
  - Sample log quick-load buttons
  - Real-time analysis feedback
- 📱 **Responsive Design** - Works on all devices
  - Mobile, tablet, and desktop layouts
  - Touch-friendly controls
- ⚡ **Cloudflare Workers Deployment** - Edge computing
  - Global CDN distribution
  - Sub-100ms response times
  - Automatic scaling
- 📚 **Comprehensive Documentation**
  - README.md - Project overview
  - SETUP_GUIDE.md - Step-by-step deployment
  - DRIZZLE_SETUP.md - ORM usage guide
  - FEATURES.md - Feature breakdown

### Technical Details
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Charts**: AG Charts React 12.2.0
- **Database**: Cloudflare D1 with Drizzle ORM 0.44.6
- **Deployment**: Cloudflare Workers via OpenNext
- **Package Manager**: pnpm 10.15.0

### Database Schema
- `combat_sessions` - Session metadata and player info
- `combat_events` - Individual combat events with timestamps
- `player_stats` - Aggregated player statistics
- `item_usage` - Item usage tracking per player

### API Endpoints
- `POST /api/analyze` - Analyze combat logs and return insights
- `GET /api/sessions` - Retrieve historical combat sessions

### Sample Data
- Included 2 sample combat logs for testing
- Burn damage scenario (105 events)
- Melee combat scenario (54 events)

---

## Version History

- **0.1.2** - Legal disclaimer and footer enhancements
- **0.1.1** - Bug fix for burn mechanic parsing
- **0.1.0** - Initial beta release with complete feature set

## Links
- [Repository](https://github.com)
- [Documentation](./README.md)
- [Setup Guide](./SETUP_GUIDE.md)

