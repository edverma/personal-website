# Evan's Weekly Newsletter Codebase

[https://evanverma.com](https://evanverma.com)

A modern, flexible personal website and newsletter platform built with SvelteKit, PostgreSQL, and Tailwind CSS. Features include blog post management, email newsletter distribution via Mailgun, Nostr integration, and RSS feed generation.

## Features

- 📝 Blog post management system
- 📧 Newsletter functionality via Mailgun
- 🔗 Nostr social network integration
- 📰 RSS feed generation
- 🌓 Dark mode support
- 🎨 Markdown rendering with custom styling
- 🖼️ Image hosting on DigitalOcean Spaces
- 🔒 Secure admin interface
- 🏷️ Tag-based post organization

## Tech Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Backend**: Node.js, PostgreSQL
- **Email**: Mailgun
- **Storage**: DigitalOcean Spaces
- **Other**: Nostr Protocol Integration

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- Mailgun account
- DigitalOcean Spaces account
- Environment variables configured

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DATABASE=
POSTGRES_SSL_MODE=

# DigitalOcean Spaces
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_FOLDER_NAME=
DO_BUCKET_NAME=

# Mailgun
PERSONAL_SITE_MAILGUN=
PERSONAL_SITE_DOMAIN_MAILGUN=
PERSONAL_SITE_USERNAME_MAILGUN=
TO_ADDRESS_MAILGUN=

# Nostr
NOSTR_SECRET_KEY=
NOSTR_RELAYS=

# Admin
SECRET=

# Public
PUBLIC_BASE_URL=
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# The database tables will be automatically created when the application starts
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
personal-website/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable Svelte components
│   │   ├── server/         # Server-side utilities
│   │   └── marked.js       # Markdown configuration
│   ├── routes/
│   │   ├── admin/         # Admin interface routes
│   │   ├── api/           # API endpoints
│   │   └── [post]/        # Dynamic post routes
│   ├── app.css
│   ├── app.html
│   └── hooks.server.js
```

## Features Documentation

### Blog Posts
- Create, edit, and delete posts through the admin interface
- Support for Markdown content with custom styling
- Automatic image uploads to DigitalOcean Spaces
- Tag-based organization

### Newsletter
- Subscribe form for collecting email addresses
- Send newsletters to subscribers via Mailgun
- Track email delivery status

### Nostr Integration
- Publish posts to Nostr network
- Custom NIP-05 verification endpoint
- Multi-relay support

### RSS Feed
- Automatic RSS feed generation
- Support for full content in feed
- RFC822 date formatting

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```
