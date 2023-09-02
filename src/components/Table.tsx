import clsx from 'clsx'
import { forwardRef } from 'react'

export function Table(
  props: Omit<JSX.IntrinsicElements['table'], 'className'>
) {
  return <table {...props} className="min-w-full divide-y divide-gray-200" />
}

function TableHead(props: Omit<JSX.IntrinsicElements['thead'], 'className'>) {
  return <thead {...props} className="sticky top-0 z-10 bg-white" />
}

const TableBody = forwardRef<
  HTMLTableSectionElement,
  Omit<JSX.IntrinsicElements['tbody'], 'className'>
>(function TableBody(props, ref) {
  return (
    <tbody ref={ref} {...props} className="divide-y divide-gray-200 bg-white" />
  )
})

interface TableRowProps extends Omit<JSX.IntrinsicElements['tr'], 'className'> {
  highlightOnHover?: boolean
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    { highlightOnHover, onClick, onClickCapture, ...props },
    ref
  ) {
    return (
      <tr
        ref={ref}
        {...props}
        onClick={onClick}
        onClickCapture={onClickCapture}
        className={clsx({
          group: highlightOnHover,
          'cursor-pointer': !!onClick || !!onClickCapture
        })}
      />
    )
  }
)

interface TableHeaderProps
  extends Omit<JSX.IntrinsicElements['th'], 'className' | 'scope'> {
  align?: 'left' | 'center' | 'right'
}

function TableHeader({ align, ...props }: TableHeaderProps) {
  return (
    <th
      {...props}
      scope="col"
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right'
        }
      )}
    />
  )
}

interface TableDataProps
  extends Omit<JSX.IntrinsicElements['td'], 'className'> {
  align?: 'left' | 'center' | 'right'
}

function TableData({ align = 'left', ...props }: TableDataProps) {
  return (
    <td
      {...props}
      className={clsx(
        'group-hover:bg-black-alpha-50 relative bg-white px-6 py-4 text-sm font-medium text-gray-900',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right'
        }
      )}
    />
  )
}

Table.Head = TableHead
Table.Body = TableBody
Table.Row = TableRow
Table.Header = TableHeader
Table.Data = TableData
