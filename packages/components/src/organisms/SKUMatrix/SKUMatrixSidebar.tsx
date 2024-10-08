import Image from 'next/image'
import type { HTMLAttributes } from 'react'
import React, { useEffect, useMemo } from 'react'
import { Badge, Button, OverlayProps, QuantitySelector, Skeleton } from '../..'
import Price, { PriceFormatter } from '../../atoms/Price'
import { useFadeEffect, useSKUMatrix } from '../../hooks'
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
    availability: {
      label: string
      stockDisplaySettings: 'showStockQuantity' | 'showAvailability'
    }
    price: number
    quantitySelector: number
  }
  /**
   * AllVariantProducts.
   */
  allVariantProducts: {
    id: string
    name: string
    image: { url: string; alternateName: string }
    availability: string
    inventory: number
    price: number
    quantity: number
    specification: { [key: string]: any }
    offers: {
      highPrice: number
      lowPrice: number
      lowPriceWithTaxes: number
      offerCount: number
      priceCurrency: string
      offers: Array<{
        listPrice: number
        listPriceWithTaxes: number
        sellingPrice: number
        priceCurrency: string
        price: number
        priceWithTaxes: number
        priceValidUntil: string
        itemCondition: string
        availability: string
        quantity: number
      }>
    }
  }[]
  /**
   * Properties related to the 'add to cart' button
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
  /**
   * Function that returns the data reflected from changes.
   */
  onChangeItems?(items: SKUMatrixSidebarProps['allVariantProducts']): void

  /**
   * Check if some result is still loading before render the result.
   */
  loading?: boolean
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
  onChangeItems,
  loading,
  formatter,
  ...otherProps
}: SKUMatrixSidebarProps) {
  const { fade } = useFadeEffect()
  const {
    open,
    setOpen,
    onChangeAllVariantProducts,
    allVariantProducts: allVariantProductsFromHook,
    handleChangeQuantityItem,
  } = useSKUMatrix()

  useEffect(() => {
    onChangeAllVariantProducts(allVariantProducts)
  }, [allVariantProducts])

  const cartDetails = useMemo(() => {
    return allVariantProductsFromHook.reduce(
      (acc, product) => ({
        amount: acc.amount + product.quantity,
        subtotal: acc.subtotal + product.quantity * product.price,
      }),
      { amount: 0, subtotal: 0 }
    )
  }, [allVariantProductsFromHook])

  function resetQuantityItems() {
    onChangeAllVariantProducts(
      allVariantProductsFromHook.map((item) => ({ ...item, quantity: 0 }))
    )
  }

  function handleQuantitySelectorChange(id: string, value: number) {
    const response = handleChangeQuantityItem(id, value)

    onChangeItems?.(response)
  }

  const totalColumnsSkeletonLength =
    Object.values(columns).length + (columns.additionalColumns?.length ?? 0) - 1

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
          resetQuantityItems()
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
              {columns.availability.label}
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
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <TableRow key={`table-row-${index}`}>
                    {Array.from({
                      length: totalColumnsSkeletonLength,
                    }).map((_, index) => {
                      return (
                        <TableCell key={`table-cel-${index}`}>
                          <span>
                            <Skeleton
                              key={index}
                              size={{ width: '100%', height: '30px' }}
                            />
                          </span>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </>
          ) : (
            <>
              {allVariantProductsFromHook.map((variantProduct) => (
                <TableRow key={`${variantProduct.name}-${variantProduct.id}`}>
                  <TableCell data-fs-sku-matrix-sidebar-cell-image align="left">
                    <div>
                      <Image
                        src={variantProduct.image.url}
                        alt={variantProduct.image.alternateName}
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
                      {variantProduct.specification[value]}
                    </TableCell>
                  ))}

                  <TableCell align="left">
                    {columns.availability.stockDisplaySettings ===
                      'showAvailability' && (
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
                    )}

                    {columns.availability.stockDisplaySettings ===
                      'showStockQuantity' && variantProduct.inventory}
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
                          handleQuantitySelectorChange(variantProduct.id, value)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>

      <footer data-fs-sku-matrix-sidebar-footer>
        <div>
          <p>
            {cartDetails.amount} {cartDetails.amount !== 1 ? 'Items' : 'Item'}
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
