import { SKUMatrix, SKUMatrixTrigger, SKUMatrixSidebar } from '@faststore/ui'

function Page() {
  return (
    <div>
      <SKUMatrix>
        <SKUMatrixTrigger>Selecionar multiplos</SKUMatrixTrigger>
        <SKUMatrixSidebar />
      </SKUMatrix>
    </div>
  )
}

export default Page
