import type { SKUMatrixSidebarProps as UISKUMatrixSidebarProps } from '@faststore/ui'
import { SKUMatrixSidebar as UISKUMatrixSidebar } from '@faststore/ui'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { usePDP } from 'src/sdk/overrides/PageProvider'

interface SKUMatrixProps extends UISKUMatrixSidebarProps {}

function SKUMatrixSidebar(props: SKUMatrixProps) {
  const {
    data: { product },
  } = usePDP()

  const {
    id,
    sku,
    gtin,
    unitMultiplier,
    name: variantName,
    brand,
    isVariantOf,
    isVariantOf: { skuVariants },
    image: productImages,
    additionalProperty,
    offers: {
      offers: [
        {
          availability,
          price,
          priceWithTaxes,
          listPrice,
          seller,
          listPriceWithTaxes,
        },
      ],
    },
  } = product

  const buyProps = useBuyButton({
    id,
    price,
    priceWithTaxes,
    listPrice,
    listPriceWithTaxes,
    seller,
    quantity: 10,
    itemOffered: {
      sku,
      name: variantName,
      gtin,
      image: productImages,
      brand,
      isVariantOf,
      additionalProperty,
      unitMultiplier,
    },
  })
  console.log({ buyProps })

  return <UISKUMatrixSidebar {...props} />
}

export default SKUMatrixSidebar
