# Spelling Bee

A browser-based Spelling Bee-style word game built with React and Vite that generates a 7-letter puzzle using Gemini and scores guesses.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Typical User Workflow](#typical-user-workflow)
- [Tech Stack](#tech-stack)
- [Architecture / Project Structure](#architecture--project-structure)
- [Getting Started (Developer)](#getting-started-developer)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Security / Privacy Notes](#security--privacy-notes)
- [Contributing](#contributing)
- [License](#license)
- [Live Demo](#live-demo)

## Overview

Spelling Bee is a single-page word puzzle where players form words from seven letters around a required center letter. Puzzles are generated at runtime via the Google Generative AI SDK (Gemini), while difficulty thresholds are computed locally from a bundled dictionary. The result is a lightweight, replayable word game for players and a concise reference project for developers exploring React + Vite + Tailwind with client-side AI calls.

Key differentiators visible in the codebase:

- Puzzle generation and word validation are driven by Gemini from the browser.
- Difficulty thresholds are computed from a local dictionary using a trie-based counter.
- Game state persists in `localStorage` for continuity across refreshes.

## Features

### Core gameplay

- **7-letter puzzle generation**: Gemini selects a real English pangram (7+ letters, exactly seven unique letters) and derives the seven-letter set with a fixed central letter.
- **Multi-input word entry**: Players can type letters on the keyboard or click the hex tiles; input enforces a 4-character minimum and a 20-character maximum.
- **Rule enforcement**: Words must use only the seven letters and include the central letter; invalid entries trigger inline feedback.
- **Word validity checks**: Each submitted word is validated by Gemini, with a separate Gemini check for pangram scoring.

### Scoring and progress

- **Point system**: Regular words score `length - 3`; pangrams score a flat 7 points.
- **Rank thresholds**: A local dictionary is scanned to count all possible words for the puzzle, then cumulative thresholds are computed for nine ranks.
- **Progress visualization**: A rank progress bar updates as you score, and a detailed rankings modal shows current and next thresholds.

### UX and feedback

- **Shuffle letters**: A rotate button shuffles the six outer letters while preserving the center letter.
- **Status toasts**: Feedback for too-short words, missing center letter, invalid letters, duplicates, and word not found.
- **Loading state**: A spinner appears while the puzzle is generated.
- **Win celebration**: Confetti overlay and a "Play again" reset when the top rank is reached.
- **Persistent state**: Letters, scores, guessed words, and thresholds are stored in `localStorage`.

## Typical User Workflow

- Step 1: The user opens the app and immediately sees the title and empty board; a loading spinner appears while Gemini generates a new puzzle.
- Step 2: Once letters arrive, the hex board populates with seven letters; the center letter is highlighted to show the required character.
- Step 3: The user clicks tiles or types on the keyboard to build a word; the input shows a blinking caret and colors the center letter for emphasis.
- Step 4: On Enter, the app enforces rules (minimum length, only allowed letters, center letter required). If a rule fails, a short toast explains why.
- Step 5: If the word is valid, Gemini confirms it exists; points are awarded, the progress bar updates, and the guessed word is added to the list. The user can open the rankings modal to see the next threshold.
- Step 6: After enough points to reach the top rank, a confetti overlay appears. Clicking "Play again" clears stored state and generates a fresh puzzle.

## Tech Stack

This is a client-only single-page application. On first load, it calls Gemini to produce a pangram and letter set, then uses a local dictionary to compute score thresholds. User guesses are validated through Gemini, while the UI is rendered and managed entirely in React.

- **Frontend framework**: React 19 with functional components and hooks; no router or external state manager.
- **Build tool**: Vite 6 with `@vitejs/plugin-react`.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`, plus custom CSS in `src/App.css`.
- **AI/LLM**: Google Generative AI SDK (`@google/generative-ai`) imported from `https://esm.sh/` and used with the `gemini-2.5-flash` model.
- **Local data**: A bundled dictionary (`src/trie/words_dictionary.json`) is fetched at runtime to build a trie for word counting.
- **State persistence**: Browser `localStorage` stores letters, pangram, guessed words, points, and rank thresholds.
- **UI utilities**: `react-icons` for controls, `react-spinners` for loading, and `react-confetti` for the win overlay.
- **Linting**: ESLint with React Hooks and React Refresh rules.
- **Testing**: No test runner configured.
- **CI/CD and deployment**: No pipeline or deployment config present.
- **Observability/logging**: No logging or monitoring tooling beyond basic console usage.

## Architecture / Project Structure

```
.
|-- public/
|   |-- sb-apple-touch-icon.png
|   |-- sb-safari-pinned-tab.svg
|   `-- vite.svg
|-- src/
|   |-- assets/
|   |   `-- react.svg
|   |-- backend/
|   |   |-- Server.jsx
|   |   |-- pangramValidator.js
|   |   `-- validator.js
|   |-- components/
|   |   |-- ButtonsRow.jsx
|   |   |-- GuessedWords.jsx
|   |   |-- Header.jsx
|   |   |-- HexBoard.jsx
|   |   |-- HexLetters.jsx
|   |   |-- InputDiv.jsx
|   |   |-- ProgressBar.jsx
|   |   |-- Rankings.jsx
|   |   |-- WordPanel.jsx
|   |   |-- YouWon.jsx
|   |   `-- server.js
|   |-- scoring/
|   |   `-- scoring.js
|   |-- trie/
|   |   |-- Trie.js
|   |   |-- wordFinder.js
|   |   `-- words_dictionary.json
|   |-- App.jsx
|   |-- App.css
|   |-- draft.html
|   |-- index.css
|   `-- main.jsx
|-- .env
|-- eslint.config.js
|-- index.html
|-- package.json
`-- vite.config.js
```

Notable modules and responsibilities:

- `src/App.jsx`: Main state orchestration, input handling, scoring logic, and persistence.
- `src/backend/Server.jsx`: Client-side puzzle generation and initial setup via Gemini.
- `src/backend/validator.js` and `src/backend/pangramValidator.js`: Gemini-based word and pangram validation.
- `src/trie/*`: Trie construction and word counting to compute rank thresholds.
- `src/scoring/scoring.js`: Rank threshold calculation based on word count.
- `src/components/*`: Presentational UI components (board, input, rankings, win overlay).
- `src/components/server.js`: Standalone Gemini letter generator utility (not imported by the app).
- `src/draft.html`: Static layout draft used as a design scratchpad.

Patterns used:

- Component-based UI with React hooks.
- Client-only architecture; no backend service or database in this repository.

## Getting Started (Developer)

### Prerequisites

- Node.js and npm.
- A Google Generative AI API key (see Environment Variables).

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root (or update the existing one).

| Variable              | Required | Description                                                  | Referenced in                                                                                                       |
| --------------------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `VITE_GEMINI_API_KEY` | Yes      | API key used by the Google Generative AI SDK in the browser. | `src/backend/Server.jsx`, `src/backend/validator.js`, `src/backend/pangramValidator.js`, `src/components/server.js` |

> Note: This key is used client-side. Treat it as public and consider proxying through a backend if you need to protect it.

### Run locally (dev)

```bash
npm run dev
```

### Build / production run

```bash
npm run build
npm run preview
```

### Tests and linting

```bash
npm run lint
```

No automated test runner is configured.

## Configuration

- `vite.config.js`: Vite setup with React and Tailwind CSS plugins.
- `eslint.config.js`: ESLint rules for React, hooks, and refresh behavior.
- `index.html`: Vite entry HTML and root mount point.
- `src/index.css`: Tailwind CSS import entry point.
- `.env`: Environment variables for the Gemini API key.

## Deployment

No deployment configuration is included in this repository. Generic static deployment steps:

1. Run `npm run build` to generate the production bundle in `dist/`.
2. Host the `dist/` folder on a static host (Netlify, Vercel static, GitHub Pages, etc.).
3. Provide `VITE_GEMINI_API_KEY` at build time in the host's environment settings.

## Security / Privacy Notes

- Gemini API calls are made directly from the browser, so the API key is exposed to clients.
- User-submitted words are sent to Gemini for validation.
- "Play again" clears all `localStorage` keys for the origin, not just this app's keys.

## Contributing

- Fork the repo and create a feature branch.
- Keep changes focused and run `npm run lint` before opening a PR.
- If you add features, consider adding a test setup (none exists today).

## License

No license specified.

## Live Demo

[Open the app](LIVE_DEPLOYMENT_URL)
