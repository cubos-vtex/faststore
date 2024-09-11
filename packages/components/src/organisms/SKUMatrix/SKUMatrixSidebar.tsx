import React from 'react'
import type { ReactNode, HTMLAttributes } from 'react'
import SlideOver, { SlideOverHeader } from '../SlideOver'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../../molecules/Table'
import Price, { PriceFormatter } from '../../atoms/Price'
import QuantitySelector from '../../molecules/QuantitySelector'
import { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'
import { useFadeEffect } from '../../hooks'
import { OverlayProps } from '../..'

export interface SKUMatrixSidebarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Title for the SKUMatrixSidebar component.
   */
  title?: string
  /**
   * Represents the side that the SKUMatrixSidebar comes from.
   */
  direction?: SlideOverDirection
  /**
   * Represents the size of the SKUMatrixSidebar.
   */
  size?: SlideOverWidthSize
  /**
   * Total of selected item in the Matrix.
   */
  // totalitems: number
  /**
   * A React component that will be rendered as an icon on the Alert component.
   */
  alertIcon?: ReactNode
  /**
   * The content for Alert component.
   */
  alertText?: string
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * Show slide over.
   */
  isOpen: boolean
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter
  /**
   * Function called when Close Button is clicked.
   */

  onClose: () => void
}

const mockTableData: {
  sku: string
  storage: string
  color: string
  stock: number
  price: number
  quantity: number
}[] = [
  {
    sku: 'SGS23U-256GRN-EU',
    storage: '256GB | 8GB',
    color: 'Green',
    stock: 84,
    price: 1249.9,
    quantity: 0,
  },
  {
    sku: 'SGS23U-256BLK-EU',
    storage: '256GB | 8GB',
    color: 'Lavender',
    stock: 90,
    price: 1249.9,
    quantity: 0,
  },
  {
    sku: 'SGS23U-256LVD-EU',
    storage: '512GB | 8GB',
    color: 'Phantom Black',
    stock: 48,
    price: 1249.9,
    quantity: 0,
  },
]

const tableColumns: string[] = [
  'Part Number',
  'Storage',
  'Color',
  'Stock (unit)',
  'Price (Tax included)',
  'Quantity',
]

function SKUMatrixSidebar({
  direction = 'rightSide',
  title,
  overlayProps,
  size = 'full',
  isOpen,
  children,
  // totalitems = 0,
  formatter,
  onClose,
  ...otherProps
}: SKUMatrixSidebarProps) {
  const { fade } = useFadeEffect()

  return (
    <SlideOver
      data-fs-sku-matrix-sidebar
      isOpen={isOpen}
      fade={fade}
      size={size}
      direction={direction}
      overlayProps={overlayProps}
      {...otherProps}
    >
      <SlideOverHeader
        onClose={() => {
          onClose()
        }}
        data-fs-sku-matrix-sidebar-title
      >
        <h2>{title}</h2>
      </SlideOverHeader>

      {children}

      <Table variant="bordered">
        <TableHead>
          <TableRow>
            {tableColumns.map((columnName) => (
              <TableCell key={columnName}>{columnName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {mockTableData.map((item) => (
            <TableRow key={item.sku}>
              <TableCell data-fs-sku-matrix-sidebar-table-cell>
                {item.sku}
              </TableCell>
              <TableCell>{item.storage}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell data-fs-sku-matrix-sidebar-table-cell>
                <Price
                  value={item.price}
                  variant="spot"
                  formatter={formatter}
                />
              </TableCell>
              <TableCell>
                <QuantitySelector min={0} initial={item.quantity} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SlideOver>
  )
}

export default SKUMatrixSidebar
