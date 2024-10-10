import {
  SKUMatrixTriggerProps,
  SKUMatrixTrigger as UISKUMatrixTrigger,
} from '@faststore/ui'

type SKUMatrixTrigger = SKUMatrixTriggerProps

function SKUMatrixTrigger(props: SKUMatrixTrigger) {
  return <UISKUMatrixTrigger {...props} />
}

export default SKUMatrixTrigger
