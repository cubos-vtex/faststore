import React, {
  createContext,
  forwardRef,
  HTMLAttributes,
  useContext,
  useState,
} from 'react'

interface SKUMatrixContext {
  open: boolean
  setOpen(value: boolean): void
}

export type SKUMatrixProps = HTMLAttributes<HTMLDivElement>

const SKUMatrixContext = createContext<SKUMatrixContext | undefined>(undefined)

const SKUMatrix = forwardRef<HTMLDivElement, SKUMatrixProps>(function SKUMatrix(
  { children, ...otherProps },
  ref
) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <SKUMatrixContext.Provider value={{ open, setOpen }}>
      <div data-fs-sku-matrix ref={ref} {...otherProps}>
        {children}
      </div>
    </SKUMatrixContext.Provider>
  )
})

export function useSKUMatrix() {
  const context = useContext(SKUMatrixContext)

  if (context === undefined) {
    throw new Error(
      'Do not use SKUMatrix components outside the SKUMatrix context'
    )
  }

  return context
}

export default SKUMatrix
