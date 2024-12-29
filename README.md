# 🃏 Liar's Bar

A companion app for the party game "Liar's Bar" (card edition)

This app allows playing the game IRL and keeping track of the game state like players, rounds, bullets in chambers, etc.
Keep in mind that this is not a full-fledged game, but rather a companion app for the game (optimized for mobile).
This will require you to have the playing cards availble or custom printed

## 🎯 Game Overview

Liar's Bar is a social deduction game that combines elements of Roulette with card-based bluffing. Players must navigate through rounds of psychological warfare while avoiding a lethal chamber in their virtual revolver.

### 🎮 Game Rules

1. **Setup**
   - Each player receives a virtual revolver with one bullet in a random chamber
   - Each round displays a table card (Q, K, or A)
   - Players must claim they have the displayed card

2. **Gameplay**
   - Players can choose to:
     - Pull their own trigger
     - Shoot another player
   - If a player is shot with a bullet, they're eliminated
   - Survivors continue to the next round

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/liars-bar.git
cd liars-bar
```
2. Install dependencies for server and client:
```bash
# Install root dependencies
npm install
```

```bash
# Install server dependencies
cd server
npm install
```
```bash
# Install client dependencies
cd ../app
npm install
```

3. Set up environment variables:
For the server (server/.env):
```bash
PORT=3001
CLIENT_URL=http://localhost:5173
```
For the client (app/.env):
```bash
VITE_SERVER_URL=http://localhost:3001
```

4. Start the development servers (production mode possibly available in the future):
```bash
# From the root directory
npm run dev
```
Go to exposed local ip and port (default: 5173) in your browser on mobile.

## 🔧 Technical Stack

Frontend:
- React
- TypeScript
- Tailwind CSS
- Socket.io Client
- i18next (Internationalization)

Backend:
- Node.js
- Express
- Socket.io
- TypeScript

## 🌍 Internationalization
The app supports multiple languages:

English (default)

French

Language can be changed using the language switcher in the top right corner.