import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'
import {
  createSlugsMap,
  getActiveSkuVariations,
  getFormattedVariations,
  getVariantsByName,
} from '../utils/skuVariants'

export type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

type SlugsMapArgs = {
  dominantVariantName: string
}

export const SkuVariants: Record<string, Resolver<Root>> = {
  activeVariations: (root) => getActiveSkuVariations(root.variations),
  allVariantsByName: (root) =>
    getVariantsByName(root.isVariantOf.skuSpecifications),

  slugsMap: (root, args) =>
    createSlugsMap(
      root.isVariantOf.items,
      (args as SlugsMapArgs).dominantVariantName ?? root.variations[0]?.name,
      root.isVariantOf.linkText
    ),

  /*
  Implementei aqui o que está definido em src/typeDefs/skuVariants.graphql, retornando um string só para teste, mas ainda assim dá o erro "Error: SkuVariants.allSkuVariants defined in resolvers, but not in schema". Por isso deixei comentado. Precisamos tirar a dúvida do que precisa mais. Creio que devemos manipular esse root para formar o objeto necessário no frontend.
  */
  // allSkuVariants: (root) => {
  //   console.log('root:', root)
  //   return "teste all sku variants"
  // },

  availableVariations: (root, args) => {
    const dominantVariantName = (args as SlugsMapArgs).dominantVariantName ?? root.variations[0]?.name
    const activeVariations = getActiveSkuVariations(root.variations)

    const activeDominantVariationValue = activeVariations[dominantVariantName]

    const filteredFormattedVariations = getFormattedVariations(
      root.isVariantOf.items,
      dominantVariantName,
      activeDominantVariationValue
    )

    return filteredFormattedVariations
  },
}
