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
import { useSKUMatrix } from './SKUMatrix'
import Image from 'next/image'

// type AllVariantProducts = {
//   name: string
//   image: Array<{
//     url: string
//     alternateName: string
//   }>
//   offers: {
//     highPrice: number
//     lowPrice: number
//     lowPriceWithTaxes: number
//     offerCount: number
//     priceCurrency: string
//     offers: Array<{
//       listPrice: number
//       listPriceWithTaxes: number
//       sellingPrice: number
//       priceCurrency: string
//       price: number
//       priceWithTaxes: number
//       priceValidUntil: string
//       itemCondition: string
//       availability: string
//       quantity: number
//     }>
//   }
//   additionalProperty: Array<{
//     propertyID: string
//     value: any
//     name: string
//     valueReference: any
//   }>
// }

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
    [key: string]: any
    name: string
    image: { url: string; alt: string }
    availability: string
    inventory: number
    price: number
  }[]
  /**
   * All Variant Products.
   */
  // allVariantProducts: AllVariantProducts[]
  /**
   * All Variant Products.
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
  formatter,
  ...otherProps
}: SKUMatrixSidebarProps) {
  const { fade } = useFadeEffect()
  const { open, setOpen } = useSKUMatrix()

  const [cartItems, setCartItems] = useState<
    SKUMatrixSidebarProps['allVariantProducts']
  >(
    allVariantProducts.map((item) => ({
      ...item,
      quantity: 0,
    }))
  )

  function heandleQuantityChange(name: string, value: number) {
    console.log({ name, value })
    setCartItems((prev) => {
      const findSKU = prev.find((item) => item.name === name)

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
            <TableRow key={variantProduct.name}>
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
                <TableCell key={`${variantProduct.name}-${value}`} align="left">
                  {variantProduct['value']}
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
                    onChange={(value) => {
                      console.log({ value })
                      heandleQuantityChange(variantProduct.name, value)
                    }}
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
