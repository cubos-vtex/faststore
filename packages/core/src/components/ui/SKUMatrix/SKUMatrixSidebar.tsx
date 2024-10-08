import type { SKUMatrixSidebarProps as UISKUMatrixSidebarProps } from '@faststore/ui'
import {
  SKUMatrixSidebar as UISKUMatrixSidebar,
  useSKUMatrix,
} from '@faststore/ui'
import { gql } from '@generated/gql'
import { useMemo } from 'react'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import { useAllVariantProducts } from 'src/sdk/product/useAllVariantProducts'

interface SKUMatrixProps extends UISKUMatrixSidebarProps {}

interface teste {
  sku: string
  name: string
  image: Array<{ url: string; alternateName: string }>
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
  additionalProperty: Array<{
    propertyID: string
    value: any
    name: string
    valueReference: any
  }>
}

function SKUMatrixSidebar(props: SKUMatrixProps) {
  const {
    data: { product },
  } = usePDP()

  const { allVariantProducts: allVariantProductsFromHook, open } =
    useSKUMatrix()
  const { data: client, isValidating } = useAllVariantProducts(product.id, open)

  const {
    gtin,
    unitMultiplier,
    brand,
    additionalProperty,
    offers: {
      offers: [{ seller }],
    },
  } = product

  const formattedVariantProducts = useMemo(() => {
    const response = (
      client?.product.isVariantOf.skuVariants.allVariantProducts ?? []
    ).map((item: teste) => {
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
  }, [client?.product.isVariantOf.skuVariants.allVariantProducts])

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
            ...client.product.isVariantOf,
            skuVariants: {
              ...client.product.isVariantOf.skuVariants,
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
      title={product.isVariantOf.name ?? ''}
      loading={isValidating}
      allVariantProducts={formattedVariantProducts}
      {...props}
    />
  )
}

export const fragment = gql(`
  fragment ProductSKUMatrixSidebarFragment_product on StoreProduct {
    id: productID
    isVariantOf {
      name
      productGroupID
      skuVariants {
        activeVariations
        slugsMap
        availableVariations
        allVariantProducts {
					sku
          name
          image {
            url
            alternateName
          }
          offers {
            highPrice
            lowPrice
            lowPriceWithTaxes
            offerCount
            priceCurrency
            offers {
              listPrice
              listPriceWithTaxes
              sellingPrice
              priceCurrency
              price
              priceWithTaxes
              priceValidUntil
              itemCondition
              availability
              quantity
            }
          }
          additionalProperty {
            propertyID
            value
            name
            valueReference
          }
        }
      }
    }
  }
`)

export default SKUMatrixSidebar
