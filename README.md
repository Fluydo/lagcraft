# LagCraft Server Website

A futuristic Minecraft server website for LagCraft featuring real-time team, alliance, and player information.

## Features

- Real-time server information via WebSockets
- Team and alliance display
- Live server feed showing events
- Online players tracking
- Server chat display
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Backend**: Express, WebSockets (ws)
- **Data Management**: React Query
- **Styling**: TailwindCSS with custom purple theme

## Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The server will start on port 3000 by default.

## Deploying to Vercel

This project is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Use these settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

The project includes:
- `vercel.json` for configuration
- Proper WebSocket routing
- Production environment setup

After deployment, the application will be available at your Vercel domain (e.g., `your-project.vercel.app`).

## Structure

- `client/`: Frontend React application
- `server/`: Backend Express server
- `shared/`: Shared types and utilities
- `vercel.json`: Vercel deployment configuration

## Minecraft Integration

This website is designed to work with a Minecraft server running the Skript plugin to send data to the backend. The Skript should send data to the WebSocket endpoint to update:

- Team information
- Player data (online status, team membership)
- Alliance formations and breaks
- Server events
- Chat messages