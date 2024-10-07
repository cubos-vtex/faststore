import type { SKUMatrixSidebarProps as UISKUMatrixSidebarProps } from '@faststore/ui'
import {
  SKUMatrixSidebar as UISKUMatrixSidebar,
  useSKUMatrix,
} from '@faststore/ui'
import { useMemo } from 'react'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { usePDP } from 'src/sdk/overrides/PageProvider'

interface SKUMatrixProps extends UISKUMatrixSidebarProps {}

function SKUMatrixSidebar(props: SKUMatrixProps) {
  const {
    data: { product },
  } = usePDP()
  const { allVariantProducts: allVariantProductsFromHook } = useSKUMatrix()

  const {
    gtin,
    unitMultiplier,
    brand,
    isVariantOf,
    isVariantOf: {
      skuVariants: { allVariantProducts },
    },
    additionalProperty,
    offers: {
      offers: [{ seller }],
    },
  } = product

  // FIXME - Inventory property

  const formattedVariantProducts = useMemo(() => {
    const response = allVariantProducts.map((item) => {
      const formatedAditionalProperties = item.additionalProperty.reduce<{
        [key: string]: any
      }>(
        (acc, prop) => ({
          ...acc,
          [prop.name.toLowerCase()]: prop.value,
        }),
        {}
      )

      const outOfStock =
        item.offers.offers[0].availability === 'https://schema.org/OutOfStock'

      return {
        id: item.sku,
        name: item.name,
        image: {
          url: item.image[0].url,
          alternateName: item.image[0].alternateName,
        },
        inventory: item.offers.offers[0].quantity,
        availability: outOfStock ? 'outOfStock' : 'available',
        price: item.offers.offers[0].price,
        quantity: 0,
        specification: formatedAditionalProperties,
        offers: item.offers,
      }
    })
    return response
  }, [allVariantProducts])

  const buyButtonProps = allVariantProductsFromHook
    .filter((item) => item.quantity)
    .map((item) => {
      const {
        offers: {
          offers: [{ price, priceWithTaxes, listPrice, listPriceWithTaxes }],
        },
      } = item

      // FIXME - Rever essa lógica
      return {
        id: item.id,
        price,
        priceWithTaxes,
        listPrice,
        listPriceWithTaxes,
        seller,
        quantity: item.quantity,
        itemOffered: {
          sku: item.id,
          name: item.name,
          gtin,
          image: [item.image],
          brand,
          // FIXME - Rever
          isVariantOf: {
            ...isVariantOf,
            skuVariants: {
              ...isVariantOf.skuVariants,
              activeVariations: item.specification,
            },
          },
          additionalProperty,
          unitMultiplier,
        },
      }
    })

  const buyProps = useBuyButton(buyButtonProps)

  return (
    <UISKUMatrixSidebar
      buyProps={buyProps}
      title={isVariantOf.name}
      allVariantProducts={formattedVariantProducts}
      {...props}
    />
  )
}

export default SKUMatrixSidebar
