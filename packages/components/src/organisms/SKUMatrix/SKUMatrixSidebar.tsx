import React, { useMemo, useState } from 'react'
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
import { Button, OverlayProps } from '../..'

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
  partNumber: string
  storage: string
  color: string
  stock: number
  price: number
  quantity: number
}[] = [
  {
    partNumber: 'SGS23U-256GRN-EU',
    storage: '256GB | 8GB',
    color: 'Green',
    stock: 84,
    price: 1249.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS23U-256BLK-EU',
    storage: '256GB | 8GB',
    color: 'Lavender',
    stock: 90,
    price: 1249.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS23U-256LVD-EU',
    storage: '512GB | 8GB',
    color: 'Phantom Black',
    stock: 48,
    price: 1249.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS23U-128LVD-EU',
    storage: '128GB | 4GB',
    color: 'Phantom Black',
    stock: 23,
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS24U-128LVD-EU',
    storage: '128GB | 6GB',
    color: 'Black',
    stock: 29,
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS25U-128LVD-EU',
    storage: '128GB | 6GB',
    color: 'Green',
    stock: 45,
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS22U-512LVD-EU',
    storage: '512GB | 6GB',
    color: 'Gray',
    stock: 45,
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS27U-512LVD-EU',
    storage: '512GB | 6GB',
    color: 'White',
    stock: 89,
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS18U-256LVD-EU',
    storage: '256GB | 8GB',
    color: 'White',
    stock: 54,
    price: 1089.9,
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

  const [cartItems, setCartItems] = useState(mockTableData)

  function heandleQuantityChange(partNumber: string, value: number) {
    setCartItems((prev) => {
      const findSKU = prev.find((item) => item.partNumber === partNumber)

      if (findSKU) {
        findSKU.quantity = value
      }

      return [...prev]
    })
  }

  const cartDetails = useMemo(() => {
    return cartItems.reduce(
      (acc, product) => ({
        amount: acc.amount + product.quantity,
        subtotal: acc.subtotal + product.quantity * product.price,
      }),
      { amount: 0, subtotal: 0 }
    )
  }, [cartItems])

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
      >
        <h2 data-fs-sku-matrix-sidebar-title>{title}</h2>
      </SlideOverHeader>

      {children}

      <Table variant="bordered">
        <TableHead>
          <TableRow>
            {tableColumns.map((columnName) => (
              <TableCell key={columnName} align="left">
                {columnName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.partNumber}>
              <TableCell
                data-fs-sku-matrix-sidebar-table-cell
                data-fs-sku-matrix-sidebar-table-cell-first
                align="left"
              >
                {item.partNumber}
              </TableCell>
              <TableCell align="left">{item.storage}</TableCell>
              <TableCell align="left">{item.color}</TableCell>
              <TableCell align="left">{item.stock}</TableCell>
              <TableCell align="left" data-fs-sku-matrix-sidebar-table-cell>
                <Price
                  value={item.price}
                  variant="spot"
                  formatter={formatter}
                />
              </TableCell>
              <TableCell
                align="left"
                data-fs-sku-matrix-sidebar-table-cell-quantity-selector
              >
                <QuantitySelector
                  min={0}
                  initial={item.quantity}
                  onChange={(value) =>
                    heandleQuantityChange(item.partNumber, value)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <footer data-fs-sku-matrix-sidebar-footer>
        <div>
          <p>
            {cartDetails.amount} {cartDetails.amount !== 1 ? 'Items' : 'Item'}{' '}
          </p>
          <Price
            value={cartDetails.subtotal}
            variant="spot"
            formatter={formatter}
          />
        </div>

        <Button variant="primary" disabled={cartDetails.amount < 1}>
          Add to Cart
        </Button>
      </footer>
    </SlideOver>
  )
}

export default SKUMatrixSidebar
