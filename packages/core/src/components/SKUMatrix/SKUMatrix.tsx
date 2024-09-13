import {
  SKUMatrix as UISKUMatrix,
  SKUMatrixProps as UISKUMatrixProps,
} from '@faststore/ui'

type SKUMatrixProps = UISKUMatrixProps

function SKUMatrix(props: SKUMatrixProps) {
  return <UISKUMatrix {...props} />
}

export default SKUMatrix

// import {
//   SKUMatrix as UISKUMatrix,
//   SKUMatrixProps as UISKUMatrixProps,
//   SKUMatrixTrigger as UISKUMatrixTrigger,
//   SKUMatrixSidebar as UISKUMatrixSidebar,
// } from '@faststore/ui'

// import styles from './SKUMatrixSidebar/section.module.scss'

// type SKUMatrixProps = UISKUMatrixProps

// function SKUMatrix(props: SKUMatrixProps) {
//   return (
//     <UISKUMatrix className="section" {...props}>
//       <UISKUMatrixTrigger>Selecionar multiplos</UISKUMatrixTrigger>
//       <UISKUMatrixSidebar
//         overlayProps={{ className: styles.section }}
//         title="Nome do produto"
//       />
//     </UISKUMatrix>
//   )
// }

// export default SKUMatrix
