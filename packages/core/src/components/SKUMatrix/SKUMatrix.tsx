import { useState } from 'react'

import {
  SKUMatrixSidebar as SKUMatrixSidebar,
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
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div>
      <UISKUMatrixTrigger onClick={() => setIsOpen(true)}>
        {label}
      </UISKUMatrixTrigger>
      <SKUMatrixSidebar
        title="Galaxy S23 Ultra"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        overlayProps={{ className: styles.section }}
        formatter={useFormattedPrice}
      />
    </div>
  )
}

export default SKUMatrix
