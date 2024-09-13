import React from 'react'
import Button from '../../atoms/Button'
import type { ButtonProps } from '../../atoms/Button'
import { useSKUMatrix } from './SKUMatrix'

export type SKUMatrixTriggerProps = Omit<ButtonProps, 'onClick'>

function SKUMatrixTrigger({
  children,
  variant = 'secondary',
  ...otherProps
}: SKUMatrixTriggerProps) {
  const { setOpen } = useSKUMatrix()

  return (
    <Button variant={variant} onClick={() => setOpen(true)} {...otherProps}>
      {children}
    </Button>
  )
}

export default SKUMatrixTrigger
