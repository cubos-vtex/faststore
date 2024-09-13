import { SKUMatrixSidebar as UISKUMatrixSidebar } from '@faststore/ui'
import type { SKUMatrixSidebarProps as UISKUMatrixSidebarProps } from '@faststore/ui'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import styles from './section.module.scss'

type SKUMatrixSidebarProps = UISKUMatrixSidebarProps

function SKUMatrixSidebar({
  overlayProps,
  ...otherProps
}: SKUMatrixSidebarProps) {
  return (
    <UISKUMatrixSidebar
      title="Nome do Produto"
      overlayProps={{ className: `section  ${styles.section}` }}
      formatter={useFormattedPrice}
      {...otherProps}
    />
  )
}

export default SKUMatrixSidebar
