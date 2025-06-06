/// <reference types="cypress" />
/**
 * Cypress tests for testing the Analytics module
 */

import { cypress } from '../../discovery.config'
import { options } from '../global'

const { pages } = cypress

beforeEach(() => {
  cy.clearIDB()
  cy.log('IDB Cleared')
})

const dataLayerHasEvent = (eventName) => {
  cy.waitUntil(
    () =>
      cy.window({ log: false }).then((window) => {
        const allEvents = window.dataLayer.map((evt) => evt.event)

        return allEvents.includes(eventName)
      }),
    { errorMsg: `Event ${eventName} not found` }
  ).then((assert) => expect(assert).to.be.true)
}

const eventDataHasCurrencyProperty = () => {
  return cy.window().then((window) => {
    const allEvents = window.dataLayer.map((evt) => evt.ecommerce || {})

    allEvents.forEach((event) => {
      if (event.value !== undefined) {
        expect(event).to.have.property('value')
        expect(event).to.have.property('currency')
      }
    })
  })
}

describe('add_to_cart event', () => {
  const testAddToCartEvent = ({ skuId, numberOfEvents }) => {
    cy.window().then((window) => {
      const { dataLayer } = window

      const addToCartEvents = [...dataLayer]
        .reverse()
        .filter((e) => e.event === 'add_to_cart')

      expect(addToCartEvents).to.have.length(numberOfEvents)

      const [event] = addToCartEvents

      expect(event).to.not.be.undefined
      expect(event.ecommerce).to.have.property('value')

      const item = event.ecommerce.items.find((i) => i.item_variant === skuId)

      expect(item).to.not.be.undefined
      expect(item).to.have.property('currency')
      expect(item).to.have.property('item_name')
      expect(item).to.have.property('quantity').and.to.have.eq(1)
    })
  }

  context('when adding a product to the cart', () => {
    it('adds add_to_cart event in the data layer at product description page', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      // Add to cart
      cy.getById('buy-button').as('buy-button')
      cy.get('@buy-button').contains('Add to Cart').and('be.visible')
      cy.get('@buy-button')
        .trigger('click', { force: true, cancelable: false })
        .then(($btn) => {
          cy.itemsInCart(1)

          const skuId = $btn.attr('data-sku')
          testAddToCartEvent({ skuId, numberOfEvents: 1 })
        })
    })
  })

  context('when increasing product quantity', () => {
    it('adds add_to_cart event in the data layer at quantity increase in the minicart', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      // Add to cart
      cy.getById('buy-button').as('buy-button')
      cy.get('@buy-button').contains('Add to Cart').and('be.visible')
      cy.get('@buy-button')
        .trigger('click', { force: true, cancelable: false })
        .then(($btn) => {
          cy.itemsInCart(1)
          const skuId = $btn.attr('data-sku')

          testAddToCartEvent({ skuId, numberOfEvents: 1 })
        })

      cy.get(
        '[data-testid=fs-cart-item] [data-testid=fs-quantity-selector-right-button]'
      ).trigger('click', { force: true, cancelable: false })

      cy.get('@buy-button').then(($btn) => {
        cy.itemsInCart(2)
        const skuId = $btn.attr('data-sku')

        testAddToCartEvent({ skuId, numberOfEvents: 2 })
      })
    })
  })
})

describe('remove_from_cart event', () => {
  const testRemoveFromCartEvent = ({ skuId, numberOfEvents, quantity }) => {
    cy.window().then((window) => {
      const { dataLayer } = window

      const removeFromCartEvents = [...dataLayer]
        .reverse()
        .filter((e) => e.event === 'remove_from_cart')

      expect(removeFromCartEvents).to.have.length(numberOfEvents)

      const [event] = removeFromCartEvents

      expect(event).to.not.be.undefined
      expect(event.ecommerce).to.have.property('value')

      const item = event.ecommerce.items.find((i) => i.item_variant === skuId)

      expect(item).to.not.be.undefined
      expect(item).to.have.property('currency')
      expect(item).to.have.property('item_name')
      expect(item).to.have.property('quantity').and.to.have.eq(quantity)
    })
  }

  context('when removing a product from cart', () => {
    it('adds remove_from_cart event in the data layer', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      // Add item to cart
      cy.getById('buy-button').as('buy-button')
      cy.get('@buy-button').contains('Add to Cart').should('be.visible')
      cy.get('@buy-button').trigger('click')

      cy.getById('fs-cart-sidebar').should('be.visible')

      cy.itemsInCart(1)

      // Remove the added item
      cy.getById('remove-from-cart-button').as('remove-from-cart-button')
      cy.get('@remove-from-cart-button')
        .click({ force: true })
        .then(($btn) => {
          cy.itemsInCart(0)

          const skuId = $btn.attr('data-sku')

          testRemoveFromCartEvent({
            skuId,
            quantity: 1,
            numberOfEvents: 1,
          })
        })
    })
  })

  context('when decreasing product quantity', () => {
    it('adds remove_from_cart event in the data layer at quantity decrease in the minicart', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      // Add item to cart
      cy.get('[data-testid=fs-quantity-selector-right-button]')
        .click({ force: true })
        .then(() => {
          cy.getById('buy-button')
            .should('be.visible')
            .scrollIntoView({ duration: 500 })
            .then(($btn) => {
              cy.getById('buy-button').click({ force: true })
              cy.itemsInCart(2)
              cy.getById('checkout-button')
                .should('be.visible')
                .should('be.enabled')
              cy.itemsInCart(2)

              // Remove the added item
              cy.get(
                '[data-testid=fs-cart-item] [data-testid=fs-quantity-selector-left-button]'
              )
                .click({ force: true })
                .then(() => {
                  cy.itemsInCart(1)
                  cy.getById('checkout-button')
                    .should('be.visible')
                    .should('be.enabled')
                  cy.itemsInCart(1)
                  const skuId = $btn.attr('data-sku')

                  testRemoveFromCartEvent({
                    skuId,
                    numberOfEvents: 1,
                    quantity: 1,
                  })
                })
            })
        })
    })
  })
})

describe('view_item event', () => {
  it('add view_item event in data layer', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    cy.getById('product-link')
      .first()
      .click()
      .then(() => {
        dataLayerHasEvent('view_item')
        eventDataHasCurrencyProperty()
      })
  })
})

describe('select_item event', () => {
  it('select_item has the right properties', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    let skuId

    cy.getById('fs-product-card')
      .first()
      .click()
      .then(() => {
        cy.getById('buy-button')
          .should('be.visible')
          .scrollIntoView({ duration: 0 })
          .then(($btn) => {
            skuId = $btn.attr('data-sku')
          })
          .then(() => {
            cy.window().then((window) => {
              const event = window.dataLayer.find(
                ({ event: eventName }) => eventName === 'select_item'
              )

              expect(event).to.exist
              expect(skuId).to.equal(event.ecommerce.items[0].item_variant)
            })
          })
      })
  })
})

describe('view_item_list event', () => {
  it('is sent when viewing the PLP', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    cy.get('[data-fs-product-grid] [data-testid=product-link]').then(() => {
      cy.scrollTo('bottom', { duration: 500 }).then(() => {
        cy.scrollTo('top', { duration: 500 }).then(() => {
          dataLayerHasEvent('view_item_list')
          eventDataHasCurrencyProperty()

          cy.window().then((window) => {
            const event = window.dataLayer.find(
              (evt) => evt.event === 'view_item_list'
            )

            expect(event.ecommerce.items.length).to.eq(12)
          })
        })
      })
    })
  })

  it('is sent when viewing a products shelf', () => {
    cy.visit(pages.home, options)
    cy.waitForHydration()

    cy.get('[data-fs-product-shelf]:last')
      .scrollIntoView()
      .then(() => {
        dataLayerHasEvent('view_item_list')

        cy.window().then((window) => {
          const event = window.dataLayer.find(
            (evt) => evt.event === 'view_item_list'
          )

          expect(event.ecommerce.items.length).to.eq(5)
        })
      })
  })

  it('is sent when viewing a product tiles', () => {
    cy.visit(pages.home, options)
    cy.waitForHydration()

    cy.get('[data-fs-tiles]:last')
      .scrollIntoView()
      .then(() => {
        dataLayerHasEvent('view_item_list')

        cy.window().then((window) => {
          const event = window.dataLayer.find(
            (evt) => evt.event === 'view_item_list'
          )

          expect(event.ecommerce.items.length).to.eq(3)
        })
      })
  })
})

describe('search event', () => {
  it('raises search', () => {
    cy.visit(pages.home, options)
    cy.waitForHydration()

    cy.getById('store-input-mobile-button').click({ force: true })

    cy.getById('store-input-mobile')
      .click()
      .within(() => {
        cy.getById('fs-input').type('shirt')
        cy.getById('store-input-mobile-button')
          .click()
          .then(() => {
            dataLayerHasEvent('search')
          })
      })
  })
})

describe('view_cart event', () => {
  it('is fired when the minicart is opened (without items)', () => {
    cy.visit(pages.pdp, options)
    cy.waitForHydration()

    cy.getById('cart-toggle').click()
    cy.getById('fs-cart-sidebar').should('be.visible')

    dataLayerHasEvent('view_cart')

    cy.itemsInCart(0)

    cy.window().then((window) => {
      const event = window.dataLayer.find(
        ({ event: eventName }) => eventName === 'view_cart'
      )

      expect(event.ecommerce.value).to.equal(0)
      expect(event.ecommerce.items.length).to.equal(0)
    })
  })

  it('is fired when the minicart is opened (with items)', () => {
    cy.visit(pages.pdp, options)
    cy.waitForHydration()

    cy.itemsInCart(0)

    cy.getById('buy-button').as('buy-button')
    cy.get('@buy-button').contains('Add to Cart').should('be.visible')
    cy.get('@buy-button').trigger('click', { force: true, cancelable: false })

    cy.getById('fs-cart-sidebar').should('be.visible')

    dataLayerHasEvent('view_cart')

    cy.itemsInCart(1)

    cy.window().then((window) => {
      const event = window.dataLayer.find(
        ({ event: eventName }) => eventName === 'view_cart'
      )

      expect(event.ecommerce.value).to.equal(420)
      expect(event.ecommerce.items.length).to.equal(1)
    })
  })
})
