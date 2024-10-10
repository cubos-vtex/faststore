import {
  SKUMatrix as UISKUMatrix,
  SKUMatrixProps as UISKUMatrixProps,
} from '@faststore/ui'

type SKUMatrixProps = UISKUMatrixProps

function SKUMatrix(props: SKUMatrixProps) {
  return <UISKUMatrix {...props} />
}

export default SKUMatrix
