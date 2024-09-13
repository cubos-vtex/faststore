import { useState } from 'react'

import {
  SKUMatrix as UISKUMatrix,
  SKUMatrixSidebar as UISKUMatrixSidebar,
  SKUMatrixTrigger as UISKUMatrixTrigger,
} from '@faststore/ui'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import styles from './section.module.scss'

interface SKUMatrixProps {
  button: {
    label: string
  }
}

function SKUMatrix({ button: { label } }: SKUMatrixProps) {
  return (
    <UISKUMatrix>
      <UISKUMatrixTrigger>{label}</UISKUMatrixTrigger>
      <UISKUMatrixSidebar
        title="Galaxy S23 Ultra"
        overlayProps={{ className: styles.section }}
        formatter={useFormattedPrice}
      />
    </UISKUMatrix>
  )
}

export default SKUMatrix
