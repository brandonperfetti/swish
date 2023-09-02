export interface PlayerAlternateMarket {
  playerName: string
  playerId: number
  statType: string
  statTypeId: number
  line: number
  underOdds: number
  overOdds: number
  pushOdds: number
}
export interface Player {
  line: number
  marketSuspended: number
  playerId: number
  playerName: string
  position: string
  teamAbbr: string
  teamId: number
  teamNickname: string
}

export interface PlayerMarket {
  line: number
  marketSuspended: number
  playerId: number
  playerName: string
  position: string
  statType: string
  statTypeId: number
  teamAbbr: string
  teamId: number
  teamNickname: string
  manualMarketStatus?: 'suspended' | 'not_suspended' | 'manual'
}

export interface PlayerProps {
  player: Player
  markets: PlayerMarket[]
}