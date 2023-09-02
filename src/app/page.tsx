'use client'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { SearchFilterInput } from '@/components/SearchFilterInput'
import { Table } from '@/components/Table'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ChangeEvent, Fragment, useMemo, useState } from 'react'
import playerAlternates from './utilities/alternates'
import { PlayerMarket, PlayerProps } from './utilities/interfaces'
import {
  getAlternateWithHighestLineByStat,
  getAlternateWithLowestLineByStat,
  groupedData,
  isMarketSuspended
} from './utilities/misc'
import { useDebounce } from './utilities/useDebounce'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}
const navigation = [{ name: 'Dashboard', href: '#', current: true }]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
]

const playerdata = Object.values(groupedData)

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [selectedStatType, setSelectedStatType] = useState('')
  const [selectedMarketStatus, setSelectedMarketStatus] = useState('')
  const [playerData, setPlayerData] = useState(playerdata)

  function toggleMarketStatus(playerId: number, statTypeId: number) {
    setPlayerData((prevData) => {
      const updatedData = [...prevData]
      const playerIndex = updatedData.findIndex(
        ({ player }) => player.playerId === playerId
      )

      if (playerIndex !== -1) {
        const { markets } = updatedData[playerIndex]
        const marketIndex = markets.findIndex(
          (market) =>
            market.statTypeId === statTypeId &&
            market.manualMarketStatus !== 'manual'
        )

        if (marketIndex !== -1) {
          const newStatus =
            markets[marketIndex].manualMarketStatus === 'suspended'
              ? 'not_suspended'
              : 'suspended'

          markets[marketIndex].manualMarketStatus = newStatus
          markets[marketIndex].marketSuspended =
            newStatus === 'suspended' ? 1 : 0
        }
      }

      return updatedData
    })
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const filterPlayers = (
    players: PlayerProps[] | undefined | null,
    searchTerm: string
  ) => {
    if (!players) return []

    return players.filter(
      (player) =>
        player.player.playerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        player.player.teamNickname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        player.player.teamAbbr.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredPlayers = useMemo(() => {
    let filteredData = playerData // Use playerData state

    // Filter by search term
    if (debouncedSearchTerm) {
      filteredData = filterPlayers(filteredData, debouncedSearchTerm)
    }

    // Filter by selected position
    if (selectedPosition) {
      filteredData = filteredData.filter(
        (item) =>
          item.player.position.toLowerCase() === selectedPosition.toLowerCase()
      )
    }

    // Filter by selected market status
    if (selectedMarketStatus === 'suspended') {
      filteredData = filteredData.map((item) => ({
        ...item,
        markets: item.markets.filter(
          (market) =>
            market.manualMarketStatus === 'suspended' ||
            isMarketSuspended(market, playerAlternates)
        )
      }))
    } else if (selectedMarketStatus === 'not_suspended') {
      filteredData = filteredData.map((item) => ({
        ...item,
        markets: item.markets.filter(
          (market) =>
            market.manualMarketStatus === 'not_suspended' ||
            !isMarketSuspended(market, playerAlternates)
        )
      }))
    }

    // Filter by selected stat type
    if (selectedStatType) {
      // Only include players with markets matching the selected stat type
      filteredData = filteredData.filter((item) =>
        item.markets.some(
          (market) =>
            market.statType.toLowerCase() === selectedStatType.toLowerCase()
        )
      )

      // For each player, filter their markets to only include the selected stat type
      filteredData = filteredData.map((item) => ({
        ...item,
        markets: item.markets.filter(
          (market) =>
            market.statType.toLowerCase() === selectedStatType.toLowerCase()
        )
      }))
    }

    return filteredData
  }, [
    debouncedSearchTerm,
    selectedPosition,
    selectedStatType,
    selectedMarketStatus,
    playerData
  ])

  console.log(filteredPlayers)

  const clearFilters = () => {
    setSelectedPosition('')
    setSelectedStatType('')
    setSelectedMarketStatus('')
  }

  const getMarketSuspensionStatus = (market: PlayerMarket) =>
    market.manualMarketStatus === 'suspended'
      ? 'Yes'
      : market.manualMarketStatus === 'not_suspended'
      ? 'No'
      : isMarketSuspended(market, playerAlternates)
      ? 'Yes'
      : 'No'

  return (
    <>
      <div className="min-h-max">
        <div className="bg-indigo-600 pb-32">
          <Disclosure
            as="nav"
            className="border-b border-indigo-300 border-opacity-25 bg-indigo-600 lg:border-none">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
                    <div className="flex items-center px-2 lg:px-0">
                      <div className="flex-shrink-0">
                        <img
                          className="block h-10 w-10"
                          src="https://res.cloudinary.com/dgwdyrmsn/image/upload/v1693499404/swish_2_ryuf5t.svg"
                          alt="Swish Analytics Logo"
                        />
                      </div>
                      <div className="hidden lg:ml-10 lg:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={clsx(
                                item.current
                                  ? 'bg-indigo-700 text-white'
                                  : 'text-white hover:bg-indigo-500 hover:bg-opacity-75',
                                'rounded-md py-2 px-3 text-sm font-medium'
                              )}
                              aria-current={item.current ? 'page' : undefined}>
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                      <div className="w-full lg:w-1/2 sm:text-sm md:text-md">
                        <SearchFilterInput
                          value={searchTerm}
                          placeholder="Search by Name or Team"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setSearchTerm(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="hidden lg:ml-4 lg:block">
                      <div className="flex items-center">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3 flex-shrink-0">
                          <div>
                            <Menu.Button className="relative flex rounded-full bg-indigo-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src={user.imageUrl}
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      className={clsx(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                      )}>
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="lg:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={clsx(
                          item.current
                            ? 'bg-indigo-700 text-white'
                            : 'text-white hover:bg-indigo-500 hover:bg-opacity-75',
                          'block rounded-md py-2 px-3 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}>
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="border-t border-indigo-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium text-indigo-300">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75">
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Swish Analytics FE Coding Assessment
              </h1>
              {/* Filter Dropdowns */}
              <div className="sm:block md:flex md:space-x-4 mb-4 mt-4">
                {/* Position Dropdown */}
                <div>
                  <label htmlFor="position" className="text-white">
                    Position:
                  </label>
                  <select
                    id="position"
                    className="block w-full px-4 py-2 mt-1 border rounded-md"
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}>
                    <option value="">All</option>
                    <option value="PG">Point Guard</option>
                    <option value="SG">Shooting Guard</option>
                    <option value="SF">Small Forward</option>
                    <option value="PF">Power Forward</option>
                    <option value="C">Center</option>
                  </select>
                </div>

                {/* Stat Type Dropdown */}
                <div>
                  <label htmlFor="statType" className="text-white">
                    Stat Type:
                  </label>
                  <select
                    id="statType"
                    className="block w-full px-4 py-2 mt-1 border rounded-md"
                    value={selectedStatType}
                    onChange={(e) => setSelectedStatType(e.target.value)}>
                    <option value="">All</option>
                    Replace with your list of stat types
                    <option value="points">Points</option>
                    <option value="assists">Assists</option>
                    <option value="rebounds">Rebounds</option>
                    <option value="steals">Steals</option>
                    Add more options as needed
                  </select>
                </div>

                {/* Market Status Dropdown */}
                <div>
                  <label htmlFor="marketStatus" className="text-white">
                    Market Status:
                  </label>
                  <select
                    id="marketStatus"
                    className="block w-full px-4 py-2 mt-1 border rounded-md"
                    value={selectedMarketStatus}
                    onChange={(e) => setSelectedMarketStatus(e.target.value)}>
                    <option value="">All</option>
                    <option value="suspended">Suspended</option>
                    <option value="not_suspended">Not Suspended</option>
                  </select>
                </div>
                {/* Clear Filters Button */}
                <div className="mt-8 text-right">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => clearFilters()}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main>
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {filteredPlayers.length === 0 ? (
              <p className="p-4 text-center text-lg">
                No players found {debouncedSearchTerm && 'for the search term'}
                {debouncedSearchTerm && (
                  <span className="font-bold text-indigo-400">
                    {' '}
                    "{debouncedSearchTerm}"{' '}
                  </span>
                )}
                {'with the applied filters'}.
              </p>
            ) : (
              filteredPlayers?.map(({ player, markets }) => (
                <div key={player.playerId} className="align-items-middle">
                  {markets.length > 0 ? (
                    <>
                      <div className="pt-6 pb-4 flex">
                        <Avatar
                          src={
                            'https://swish-assets.s3-us-west-2.amazonaws.com/imgs/business/sportsbook/lebron-james-headshot-2020.png' ||
                            undefined
                          }
                          name={player?.playerName || undefined}
                          size="sm"
                        />
                        <div className="space-x-2 px-2">
                          <div className="flex">
                            <div>
                              {player.playerName} - {player.position} -{' '}
                              {player.teamNickname}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <Table>
                          <Table.Head>
                            <Table.Row>
                              <Table.Header align="left">Market</Table.Header>
                              <Table.Header align="center">Line</Table.Header>
                              <Table.Header align="center">
                                Low Line
                              </Table.Header>
                              <Table.Header align="center">
                                High Line
                              </Table.Header>
                              <Table.Header align="center">
                                Suspended
                              </Table.Header>
                              <Table.Header align="center">
                                Override
                              </Table.Header>
                            </Table.Row>
                          </Table.Head>
                          <Table.Body>
                            {markets.map((market) => (
                              <Table.Row key={market.statTypeId}>
                                <Table.Data>
                                  <span className="capitalize">
                                    {market.statType}
                                  </span>
                                </Table.Data>
                                <Table.Data align="center">
                                  {market.line}
                                </Table.Data>
                                <Table.Data align="center">
                                  {getAlternateWithLowestLineByStat(
                                    market.playerId,
                                    market.statTypeId,
                                    playerAlternates
                                  )}
                                </Table.Data>
                                <Table.Data align="center">
                                  {getAlternateWithHighestLineByStat(
                                    market.playerId,
                                    market.statTypeId,
                                    playerAlternates
                                  )}
                                </Table.Data>
                                <Table.Data align="center">
                                  {getMarketSuspensionStatus(market)}
                                </Table.Data>
                                <Table.Data align="center">
                                  <Button
                                    size="xs"
                                    onClick={() =>
                                      toggleMarketStatus(
                                        player.playerId,
                                        market.statTypeId
                                      )
                                    }>
                                    {market.manualMarketStatus === 'suspended'
                                      ? 'Release'
                                      : market.manualMarketStatus ===
                                        'not_suspended'
                                      ? 'Suspend'
                                      : 'Manual'}
                                  </Button>
                                </Table.Data>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </div>
                    </>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  )
}
