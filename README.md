# Radio Program Schedule

A static Next.js application that displays a radio program schedule fetched from a custom API. The app is designed to be deployed to GitHub Pages.

## Features

- Static site generation using Next.js `export`
- Fetches data from external API
- Responsive design
- GitHub Pages compatible
- Automatic deployment via GitHub Actions

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure your API endpoint:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and set your API endpoint:
   ```
   NEXT_PUBLIC_API_ENDPOINT=https://your-api-endpoint.com/api/programs
   ```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build and Export

To build and export the static site:
```bash
npm run export
```

This will generate static files in the `out/` directory.

## Deployment

The app is configured to automatically deploy to GitHub Pages when you push to the main branch. The GitHub Actions workflow will:

1. Build the Next.js app
2. Export static files
3. Add `.nojekyll` file
4. Deploy to `gh-pages` branch

Make sure to enable GitHub Pages in your repository settings and set the source to the `gh-pages` branch.

## API Data Format

The app expects the API to return an array of program objects with the following structure:

```json
[
  {
    "id": "1",
    "title": "Morning Show",
    "time": "06:00 - 09:00",
    "description": "Start your day with music and news"
  }
]
```

## Configuration

The app is configured for GitHub Pages with:
- `basePath: '/radioproglist'` (update this to match your repository name)
- `trailingSlash: true`
- `output: 'export'`
- Image optimization disabled for static export