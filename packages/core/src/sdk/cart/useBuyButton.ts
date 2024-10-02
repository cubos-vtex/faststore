import { sendAnalyticsEvent } from '@faststore/sdk'
import { useCallback } from 'react'
import type { CurrencyCode, AddToCartEvent } from '@faststore/sdk'

import type { AnalyticsItem } from 'src/sdk/analytics/types'
import type { CartItem } from 'src/sdk/cart'

import { useSession } from '../session'
import { useUI } from '@faststore/ui'
import { cartStore } from './index'

export const useBuyButton = (item: CartItem | CartItem[] | null) => {
  const { openCart } = useUI()
  const {
    currency: { code },
  } = useSession()

  const itemIsArray = Array.isArray(item)

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!item) {
        return
      }

      const value = itemIsArray
        ? item.reduce((sum, item) => (sum += item.price * item.quantity), 0)
        : item.price * item.quantity

      function generatedItem(item: CartItem) {
        return {
          item_id: item.itemOffered.isVariantOf.productGroupID,
          item_name: item.itemOffered.isVariantOf.name,
          item_brand: item.itemOffered.brand.name,
          item_variant: item.itemOffered.sku,
          quantity: item.quantity,
          price: item.price,
          discount: item.listPrice - item.price,
          currency: code as CurrencyCode,
          item_variant_name: item.itemOffered.name,
          product_reference_id: item.itemOffered.gtin,
        }
      }

      function getItems() {
        if (!itemIsArray) {
          return [generatedItem(item)]
        }

        return item.map(generatedItem)
      }

      sendAnalyticsEvent<AddToCartEvent<AnalyticsItem>>({
        name: 'add_to_cart',
        params: {
          currency: code as CurrencyCode,
          // TODO: In the future, we can explore more robust ways of
          // calculating the value (gift items, discounts, etc.).
          value,
          items: getItems(),
        },
      })

      itemIsArray
        ? item.map((value) => cartStore.addItem(value))
        : cartStore.addItem(item)

      openCart()
    },
    [code, item, openCart, itemIsArray]
  )

  return {
    onClick,
    'data-testid': 'buy-button',
    'data-sku': itemIsArray ? item[0]?.itemOffered.sku : item?.itemOffered.sku,
    'data-seller': itemIsArray
      ? item[0]?.seller.identifier
      : item?.seller.identifier,
  }
}
