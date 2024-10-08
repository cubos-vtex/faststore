import { useMemo } from 'react'

import { gql } from '@generated'
import type {
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'

const query = gql(`
  query ClientAllVariantProductsQuery($locator: [IStoreSelectedFacet!]!) {
      product(locator: $locator) {
      ...ProductSKUMatrixSidebarFragment_product
    }
  }
`)

export const useAllVariantProducts = <T extends ClientProductQueryQuery>(
  productID: string,
  fallbackData?: T
) => {
  const { channel, locale } = useSession()
  const variables = useMemo(() => {
    if (!channel) {
      throw new Error(
        `useAllVariantProducts: 'channel' from session is an empty string.`
      )
    }

    return {
      locator: [
        { key: 'id', value: productID },
        { key: 'channel', value: channel },
        { key: 'locale', value: locale },
      ],
    }
  }, [channel, locale, productID])

  return useQuery<
    ClientProductQueryQuery & T,
    ClientProductQueryQueryVariables
  >(query, variables, {
    fallbackData,
    revalidateOnMount: true,
  })
}
