import Image from 'next/image'
import type { HTMLAttributes } from 'react'
import React, { useEffect, useMemo, useState } from 'react'
import { Badge, Button, OverlayProps, QuantitySelector } from '../..'
import Price, { PriceFormatter } from '../../atoms/Price'
import { useFadeEffect } from '../../hooks'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../../molecules/Table'
import SlideOver, {
  SlideOverDirection,
  SlideOverHeader,
  SlideOverWidthSize,
} from '../SlideOver'
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
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
  /**
   * Columns.
   */
  columns: {
    name: string
    additionalColumns?: Array<{ label: string; value: string }>
    availibility: 'outOfStock' | 'available'
    price: number
    quantitySelector: number
  }
  /**
   * SKUVariants.
   */
  allVariantProducts: {
    id: string
    [key: string]: any
    name: string
    image: { url: string; alt: string }
    availability: string
    inventory: number
    price: number
    quantity: number
  }[]
  /**
   * Buy props.
   */
  buyProps: {
    'data-testid': string
    'data-sku': string
    'data-seller': string
    onClick(e: React.MouseEvent<HTMLButtonElement>): void
  }
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter

  // initialQuantitySelectorValue: {
  //   [id: string]: number
  // }
}

function SKUMatrixSidebar({
  direction = 'rightSide',
  title,
  overlayProps,
  size = 'partial',
  children,
  columns,
  allVariantProducts,
  buyProps,
  // initialQuantitySelectorValue,
  formatter,
  ...otherProps
}: SKUMatrixSidebarProps) {
  const { fade } = useFadeEffect()
  const { open, setOpen } = useSKUMatrix()
  const [cartItems, setCartItems] = useState<
    SKUMatrixSidebarProps['allVariantProducts']
  >([])
  useEffect(() => {
    setCartItems(allVariantProducts)
  }, [allVariantProducts])

  function heandleQuantityChange(id: string, value: number) {
    setCartItems((prev) => {
      const findSKU = prev.find((item) => item.id === id)

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
  if (!open) return null
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
            <TableCell align="left" variant="header" scope="col">
              {columns.name}
            </TableCell>

            {columns.additionalColumns?.map(({ label, value }) => (
              <TableCell key={value} align="left" variant="header" scope="col">
                {label}
              </TableCell>
            ))}

            <TableCell align="left" variant="header" scope="col">
              {columns.availibility}
            </TableCell>

            <TableCell align="right" variant="header" scope="col">
              {columns.price}
            </TableCell>

            <TableCell align="left" variant="header" scope="col">
              {columns.quantitySelector}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cartItems.map((variantProduct) => (
            <TableRow key={`${variantProduct.name}-${variantProduct.id}`}>
              <TableCell data-fs-sku-matrix-sidebar-cell-image align="left">
                <div>
                  <Image
                    src={variantProduct.image.url}
                    alt={variantProduct.image.alt}
                    width={48}
                    height={48}
                  />
                </div>
                {variantProduct.name}
              </TableCell>

              {columns.additionalColumns?.map(({ value }) => (
                <TableCell
                  key={`${variantProduct.name}-${variantProduct.id}-${value}`}
                  align="left"
                >
                  {variantProduct[value]}
                </TableCell>
              ))}

              <TableCell align="left">
                <Badge
                  variant={
                    variantProduct.availability === 'outofstock'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {variantProduct.availability === 'outofstock'
                    ? 'Out of stock'
                    : 'Available'}
                </Badge>
              </TableCell>

              <TableCell align="right">
                <div data-fs-sku-matrix-sidebar-table-price>
                  <Price
                    value={variantProduct.price}
                    variant="spot"
                    formatter={formatter}
                  />
                </div>
              </TableCell>

              <TableCell
                align="right"
                data-fs-sku-matrix-sidebar-table-cell-quantity-selector
              >
                <div data-fs-sku-matrix-sidebar-table-action>
                  <QuantitySelector
                    min={0}
                    max={variantProduct.inventory}
                    disabled={
                      !variantProduct.inventory ||
                      variantProduct.availability === ''
                    }
                    initial={variantProduct.quantity}
                    onChange={(value) =>
                      heandleQuantityChange(variantProduct.name, value)
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

        <Button
          variant="primary"
          disabled={cartDetails.amount < 1}
          {...buyProps}
        >
          Add to Cart
        </Button>
      </footer>
    </SlideOver>
  )
}

export default SKUMatrixSidebar
