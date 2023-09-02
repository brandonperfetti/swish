import { Tab as HeadlessTab } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, PropsWithChildren } from 'react'

interface TabsProps {
  selectedIndex?: number
  onChange?: (selectedIndex: number) => void
}

export function Tabs({
  children,
  selectedIndex,
  onChange
}: PropsWithChildren<TabsProps>) {
  return (
    <HeadlessTab.Group selectedIndex={selectedIndex} onChange={onChange}>
      {children}
    </HeadlessTab.Group>
  )
}

Tabs.Tab = Tab
Tabs.List = TabList
Tabs.Panels = TabPanels
Tabs.Panel = TabPanel

interface TabProps {
  onClick?: () => void
}

function Tab({ children, onClick }: PropsWithChildren<TabProps>) {
  return (
    <HeadlessTab as={Fragment}>
      {({ selected }) => (
        <button
          onClick={onClick}
          className={clsx('text-sm font-bold text-gray-600', {
            'text-gray-600': !selected,
            'text-indigo-400': selected
          })}>
          {children}
          <span
            className={clsx('mx-auto mt-1.5 block h-0.5 w-full max-w-[75%]', {
              'bg-indigo-400': selected,
              'bg-transparent': !selected
            })}
          />
        </button>
      )}
    </HeadlessTab>
  )
}

function TabList({ children }: PropsWithChildren<unknown>) {
  return <HeadlessTab.List className="space-x-6">{children}</HeadlessTab.List>
}

function TabPanels({ children }: PropsWithChildren<unknown>) {
  return <HeadlessTab.Panels>{children}</HeadlessTab.Panels>
}

function TabPanel({ children }: PropsWithChildren<unknown>) {
  return <HeadlessTab.Panel>{children}</HeadlessTab.Panel>
}
