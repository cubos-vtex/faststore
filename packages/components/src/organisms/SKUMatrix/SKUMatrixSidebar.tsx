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
import { SlideOverDirection, SlideOverWidthSize } from '../SlideOver'
import { useFadeEffect } from '../../hooks'
import { Badge, Button, OverlayProps, QuantitySelector } from '../..'
import { mockTableData, tableColumns } from './mock'
import { useSKUMatrix } from './SKUMatrix'

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
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter
}

function SKUMatrixSidebar({
  direction = 'rightSide',
  title,
  overlayProps,
  size = 'partial',
  children,
  formatter,
  ...otherProps
}: SKUMatrixSidebarProps) {
  const { fade } = useFadeEffect()
  const { open, setOpen } = useSKUMatrix()

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
      isOpen={open}
      fade={fade}
      size={size}
      direction={direction}
      overlayProps={overlayProps}
      {...otherProps}
    >
      <SlideOverHeader
        onClose={() => {
          setOpen(false)
        }}
      >
        <h2 data-fs-sku-matrix-sidebar-title>{title}</h2>
      </SlideOverHeader>

      {children}

      <Table variant="bordered">
        <TableHead>
          <TableRow>
            {tableColumns.map((columnName) => (
              <TableCell
                key={columnName}
                align={columnName.includes('Price') ? 'right' : 'left'}
                variant="header"
                scope="col"
              >
                {columnName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.partNumber}>
              <TableCell align="left">{item.partNumber}</TableCell>
              <TableCell align="left">{item.storage}</TableCell>
              <TableCell align="left">{item.color}</TableCell>
              <TableCell align="left">
                <Badge
                  variant={
                    item.availability === 'available' ? 'success' : 'warning'
                  }
                >
                  {item.availability}
                </Badge>
              </TableCell>
              <TableCell align="left">
                <div data-fs-sku-matrix-sidebar-table-price>
                  <Price
                    value={item.price}
                    variant="spot"
                    formatter={formatter}
                  />
                </div>
              </TableCell>
              <TableCell />
              <TableCell
                align="right"
                data-fs-sku-matrix-sidebar-table-cell-quantity-selector
              >
                <div data-fs-sku-matrix-sidebar-table-action>
                  <QuantitySelector
                    min={0}
                    disabled={item.availability !== 'available'}
                    initial={item.quantity}
                    onChange={(value) =>
                      heandleQuantityChange(item.partNumber, value)
                    }
                  />
                </div>
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
