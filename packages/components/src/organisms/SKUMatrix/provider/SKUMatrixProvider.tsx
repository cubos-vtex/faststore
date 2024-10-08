import React, { createContext, useCallback, useState } from 'react'
import type { ReactNode } from 'react'

interface IAllVariantProducts {
  id: string
  name: string
  image: { url: string; alternateName: string }
  availability: string
  inventory: number
  price: number
  quantity: number
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
  specification: {
    [key: string]: any
  }
}

export interface SKUMatrixProviderContextValue {
  open: boolean
  allVariantProducts: IAllVariantProducts[]
  onChangeAllVariantProducts(items: IAllVariantProducts[]): void
  handleChangeQuantityItem(id: string, value: number): IAllVariantProducts[]
  setOpen(value: boolean): void
}

export const SKUMatrixContext =
  createContext<SKUMatrixProviderContextValue | null>(null)

function SKUMatrixProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false)
  const [allVariantProducts, setAllVariantProducts] = useState<
    IAllVariantProducts[]
  >([])

  const handleChangeQuantityItem = useCallback(
    (id: string, value: number) => {
      const data = [...allVariantProducts]
      const findedSKU = data.find((item) => item.id === id)!
      findedSKU.quantity = value

      setAllVariantProducts(data)

      return data
    },
    [allVariantProducts]
  )

  function onChangeAllVariantProducts(arr: IAllVariantProducts[]) {
    setAllVariantProducts([...arr])
  }

  return (
    <SKUMatrixContext.Provider
      value={{
        open,
        allVariantProducts,
        onChangeAllVariantProducts,
        handleChangeQuantityItem,
        setOpen,
      }}
    >
      {children}
    </SKUMatrixContext.Provider>
  )
}

export default SKUMatrixProvider