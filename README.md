# Swish Analytics FE Coding Assessment

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Overview

You’ll find 2 JSON files attached of mock data from an NBA game representing 2 API endpoints Swish offers:

- **props.json**:
  - This represents the optimal betting line being offered for each market, where a market is defined as the line for a specific stat type of a player.
  - i.e. for Russell Westbrook, his 4 unique markets and respective optimal lines are points(19.0), rebounds(9.0), assists(8.5), and steals(1.5).
- **alternates.json**:
  - This represents all of the lines offered at one point for a market, and their respective under, over, and push probabilities.
  - i.e. for Russell Westbrook’s points market, there were 5 different lines - 18.5, 19.0, 19.5, 20, and 20.5

## Goal

Build a table representation of the data provided in `props.json`, where each row represents a market. For each market, also include the low and high lines for that market from `alternates.json`.

- i.e. for Westbrook’s points, there should be column’s for his low (18.5) and high (20.5)

### Table functionality:

- The ability to filter by position, stat type, and or market status (suspended or not)
- A search bar that filters on player name or team name
- An indication of whether a market is suspended or not (detailed below)

#### A market is suspended if any of these 3 cases are true:

1. `marketSuspended = 1` for that market in `props.json`
2. That market’s optimal line does not exist in `alternates.json`. i.e. Jordan Poole points
3. That market exists in `alternates.json`, but none of the 3 probabilities for the optimal line are greater than 40%.

- i.e. Steph Curry steals. His optimal line is 1, but the under, push, and over probs are each under .4

Additionally, for each market/row, add the ability to manually suspend or release. If a manual lock is set, this value will override the value calculated above for that market/row.

- Steph Curry’s assists market, which would initially be suspended due to sub-40% probabilities, could be manually set to unsuspended
- Russell Westbrook’s assists market, initially unsuspended, could manually be suspended

**Note**: Data management should be done in state - the JSON files do not need to be updated.
