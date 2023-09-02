import { Player, PlayerAlternateMarket, PlayerMarket } from './interfaces'
import playerProps from './props'

export function isMarketSuspended(
  market: PlayerMarket,
  alternates: PlayerAlternateMarket[]
): boolean {
  if (market.manualMarketStatus === 'suspended') {
    return true // Manual override to suspend takes precedence
  }

  if (market.manualMarketStatus === 'not_suspended') {
    return false // Manual override to not suspend takes precedence
  }

  if (market.manualMarketStatus === undefined) {
    // Market status not manually altered
    if (market.marketSuspended === 1) {
      return true // Regular market suspension
    }
  }

  if (market.marketSuspended === 1) {
    return true // Regular market suspension
  }

  // Find the market in alternates.json
  const matchingAlternate = alternates.find(
    (alternate) =>
      alternate.playerId === market.playerId &&
      alternate.statType === market.statType &&
      alternate.statTypeId === market.statTypeId
  )

  if (!matchingAlternate) {
    return true // Market suspended if no alternate exists
  }

  // Check if any of the probabilities for the optimal line are greater than 40%
  if (
    matchingAlternate.underOdds > 0.4 ||
    matchingAlternate.overOdds > 0.4 ||
    matchingAlternate.pushOdds > 0.4
  ) {
    return false // Market not suspended
  }

  return true // Market suspended if none of the probabilities are greater than 40%
}

const data: PlayerMarket[] = playerProps

export const groupedData = data.reduce(
  (acc, playerStat) => {
    const { playerId } = playerStat
    if (!acc[playerId]) {
      acc[playerId] = {
        player: playerStat,
        markets: []
      }
    }
    acc[playerId].markets.push(playerStat)
    return acc
  },
  {} as { [key: number]: { player: Player; markets: PlayerMarket[] } }
)

function getAlternateByStatAndOperator(
  playerId: number,
  statTypeId: number,
  data: PlayerAlternateMarket[],
  comparisonOperator: 'highest' | 'lowest'
): PlayerAlternateMarket | null {
  return data.reduce(
    (result, alternate) => {
      if (
        alternate.playerId === playerId &&
        alternate.statTypeId === statTypeId
      ) {
        if (
          comparisonOperator === 'highest' &&
          alternate.line > (result?.line || -Infinity)
        ) {
          return alternate
        } else if (
          comparisonOperator === 'lowest' &&
          alternate.line < (result?.line || Infinity)
        ) {
          return alternate
        }
      }
      return result
    },
    null as PlayerAlternateMarket | null
  )
}

export function getAlternateWithHighestLineByStat(
  playerId: number,
  statTypeId: number,
  data: PlayerAlternateMarket[]
): number | null {
  const highestLineStat = getAlternateByStatAndOperator(
    playerId,
    statTypeId,
    data,
    'highest'
  )
  return highestLineStat?.line || null
}

export function getAlternateWithLowestLineByStat(
  playerId: number,
  statTypeId: number,
  data: PlayerAlternateMarket[]
): number | null {
  const lowestLineStat = getAlternateByStatAndOperator(
    playerId,
    statTypeId,
    data,
    'lowest'
  )
  return lowestLineStat?.line || null
}
