import type { SKUMatrixSidebarProps as UISKUMatrixSidebarProps } from '@faststore/ui'
import { SKUMatrixSidebar as UISKUMatrixSidebar } from '@faststore/ui'
import { gql } from '@generated/gql'
import { useCart } from 'src/sdk/cart'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import { useAllVariantProducts } from 'src/sdk/product/useAllVariantProducts'

interface SKUMatrixProps extends UISKUMatrixSidebarProps {}

function SKUMatrixSidebar(props: SKUMatrixProps) {
  const {
    data: { product },
  } = usePDP()

  const { data: client, isValidating } = useAllVariantProducts(product.id, {
    product,
  })

  const cartItem = useCart().items.reduce<{
    [id: string]: number
  }>((acc, item) => ({ ...acc, [item.itemOffered.sku]: item.quantity }), {})

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
  } = client.product
  console.log(allVariantProducts)
  // FIXME - Inventory property
  // const variantProducts: {
  //   id: string
  //   [key: string]: any
  //   name: string
  //   image: { url: string; alt: string }
  //   availability: 'outOfStock' | 'available'
  //   inventory: number
  //   price: number
  //   quantity: number
  // }[] = useMemo(() => {
  //   return (allVariantProducts ?? []).map((item) => {
  //     const formatedAditionalProperties = item.additionalProperty.reduce<{
  //       [key: string]: any
  //     }>(
  //       (acc, prop) => ({
  //         ...acc,
  //         [prop.name.toLowerCase()]: prop.value,
  //       }),
  //       {}
  //     )

  //     const outOfStock =
  //       item.offers.offers[0].availability === 'https://schema.org/OutOfStock'

  //     return {
  //       id: item.sku,
  //       name: item.name,
  //       image: { url: item.image[0].url, alt: item.image[0].alternateName },
  //       inventory: item.offers.offers[0].quantity,
  //       availability: outOfStock ? 'outOfStock' : 'available',
  //       price: item.offers.offers[0].price,
  //       quantity: cartItem[item.sku] ?? 0,
  //       ...formatedAditionalProperties,
  //     }
  //   })
  // }, [allVariantProducts, cartItem])

  // const buyButtonProps = allVariantProducts.map((item) => {
  //   const {
  //     offers: {
  //       offers: [{ price, priceWithTaxes, listPrice, listPriceWithTaxes }],
  //     },
  //   } = item

  //   // FIXME - Rever essa lógica
  //   return {
  //     id: item.sku,
  //     price,
  //     priceWithTaxes,
  //     listPrice,
  //     listPriceWithTaxes,
  //     seller,
  //     quantity: 1,
  //     itemOffered: {
  //       sku: item.sku,
  //       name: item.name,
  //       gtin,
  //       image: item.image,
  //       brand,
  //       // FIXME - Rever
  //       isVariantOf: {
  //         ...isVariantOf,
  //         skuVariants: {
  //           ...isVariantOf.skuVariants,
  //           activeVariations: {
  //             ...item.additionalProperty.reduce(
  //               (acc, item) => ({ ...acc, [item.name]: item.value }),
  //               {}
  //             ),
  //           },
  //         },
  //       },
  //       additionalProperty,
  //       unitMultiplier,
  //     },
  //   }
  // })
  const buyProps = useBuyButton([])

  return (
    <UISKUMatrixSidebar
      buyProps={buyProps}
      title={isVariantOf.name}
      // initialQuantitySelectorValue={defaulCartItemQuantityValue}
      allVariantProducts={allVariantProducts}
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
