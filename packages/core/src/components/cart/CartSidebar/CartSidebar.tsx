import dynamic from 'next/dynamic'

import type {
  ButtonProps,
  CartSidebarProps as UICartSidebarProps,
} from '@faststore/ui'

import type { CurrencyCode, ViewCartEvent } from '@faststore/sdk'
import { Icon, useFadeEffect, useUI } from '@faststore/ui'
import { type ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useCart } from 'src/sdk/cart'
import { useCheckoutButton } from 'src/sdk/cart/useCheckoutButton'
import { useSession } from 'src/sdk/session'

const UIButton = dynamic<ButtonProps>(
  () =>
    import(/* webpackChunkName: "UIButton" */ '@faststore/ui').then(
      (mod) => mod.Button
    ),
  { ssr: false }
)
const UICartSidebarFooter = dynamic<{ children: ReactNode }>(
  () =>
    import(/* webpackChunkName: "UICartSidebarFooter" */ '@faststore/ui').then(
      (mod) => mod.CartSidebarFooter
    ),
  { ssr: false }
)
const UICartSidebarList = dynamic<{ children: ReactNode }>(
  () =>
    import(/* webpackChunkName: "UICartSidebarList" */ '@faststore/ui').then(
      (mod) => mod.CartSidebarList
    ),
  { ssr: false }
)
const UICartSidebar = dynamic<UICartSidebarProps>(
  () =>
    import(/* webpackChunkName: "UICartSidebar" */ '@faststore/ui').then(
      (mod) => mod.CartSidebar
    ),
  { ssr: false }
)
const EmptyCart = dynamic(
  () => import(/* webpackChunkName: "EmptyCart" */ '../EmptyCart'),
  { ssr: false }
)
const Gift = dynamic(
  () => import(/* webpackChunkName: "Gift" */ '../../ui/Gift'),
  {
    ssr: false,
  }
)
const CartItem = dynamic(
  () => import(/* webpackChunkName: "CartItem" */ '../CartItem'),
  { ssr: false }
)
const OrderSummary = dynamic(
  () => import(/* webpackChunkName: "OrderSummary" */ '../OrderSummary'),
  { ssr: false }
)

import styles from './section.module.scss'

function useViewCartEvent() {
  const {
    currency: { code },
  } = useSession()
  const { items: itemsFromCart, gifts: giftsFromCart, total } = useCart()

  // We need to stringify the items and gifts to avoid circular references
  // when sending the event to the analytics
  const gifts = JSON.stringify(giftsFromCart)
  const items = JSON.stringify(itemsFromCart)

  const sendViewCartEvent = useCallback(() => {
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
      return sendAnalyticsEvent<ViewCartEvent>({
        name: 'view_cart',
        params: {
          currency: code as CurrencyCode,
          value: total,
          items: itemsFromCart.concat(giftsFromCart).map((item) => ({
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
          })),
        },
      })
    })
  }, [code, gifts, items, total])

  return useMemo(() => ({ sendViewCartEvent }), [sendViewCartEvent])
}

export interface CartSidebarProps {
  title: UICartSidebarProps['title']
  alert?: {
    icon?: {
      icon: string
      alt: string
    }
    text: UICartSidebarProps['alertText']
  }
  checkoutButton: {
    label: string
    loadingLabel: string
    icon?: {
      icon: string
      alt: string
    }
  }
  quantitySelector: {
    useUnitMultiplier?: boolean
  }
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean
    taxesLabel?: string
  }
}

function CartSidebar({
  title,
  alert: {
    icon: { icon: alertIcon, alt: alertIconAlt },
    text: alertText,
  },
  checkoutButton: {
    label: checkoutLabel,
    loadingLabel: checkoutLoadingLabel,
    icon: { icon: checkoutButtonIcon, alt: checkoutButtonIconAlt },
  },
  quantitySelector,
  taxesConfiguration,
}: CartSidebarProps) {
  const btnProps = useCheckoutButton()
  const {
    items,
    gifts,
    totalItems,
    isValidating,
    subTotal,
    total,
    subTotalWithTaxes,
    totalWithTaxes,
  } = useCart({ useUnitMultiplier: quantitySelector?.useUnitMultiplier })
  const { cart: displayCart, closeCart } = useUI()
  const { fadeOut } = useFadeEffect()
  const { sendViewCartEvent } = useViewCartEvent()

  const isEmpty = useMemo(() => items.length === 0, [items])

  useEffect(() => {
    if (!displayCart) {
      return
    }

    sendViewCartEvent()
  }, [displayCart, sendViewCartEvent])

  return (
    <>
      {displayCart && (
        <UICartSidebar
          overlayProps={{
            className: `section ${styles.section} section-cart-sidebar`,
          }}
          title={title}
          totalItems={totalItems}
          alertIcon={<Icon name={alertIcon} aria-label={alertIconAlt} />}
          alertText={alertText}
          onClose={fadeOut}
        >
          {isEmpty ? (
            <EmptyCart onDismiss={closeCart} />
          ) : (
            <>
              <UICartSidebarList>
                {items.map((item) => (
                  <li key={item.id}>
                    <CartItem
                      item={item}
                      taxesConfiguration={taxesConfiguration}
                      useUnitMultiplier={
                        quantitySelector?.useUnitMultiplier ?? false
                      }
                    />
                  </li>
                ))}
                {gifts.length > 0 && (
                  <>
                    {gifts.map((item) => (
                      <li key={item.id}>
                        <Gift item={item} />
                      </li>
                    ))}
                  </>
                )}
              </UICartSidebarList>

              <UICartSidebarFooter>
                <OrderSummary
                  subTotal={
                    taxesConfiguration?.usePriceWithTaxes
                      ? subTotalWithTaxes
                      : subTotal
                  }
                  total={
                    taxesConfiguration?.usePriceWithTaxes
                      ? totalWithTaxes
                      : total
                  }
                  includeTaxes={taxesConfiguration?.usePriceWithTaxes}
                  includeTaxesLabel={taxesConfiguration?.taxesLabel}
                  numberOfItems={totalItems}
                  checkoutButton={
                    <UIButton
                      variant="primary"
                      icon={
                        !isValidating && (
                          <Icon
                            name={checkoutButtonIcon}
                            aria-label={checkoutButtonIconAlt}
                            width={18}
                            height={18}
                          />
                        )
                      }
                      iconPosition="right"
                      {...btnProps}
                    >
                      {isValidating ? checkoutLoadingLabel : checkoutLabel}
                    </UIButton>
                  }
                />
              </UICartSidebarFooter>
            </>
          )}
        </UICartSidebar>
      )}
    </>
  )
}

export default CartSidebar
