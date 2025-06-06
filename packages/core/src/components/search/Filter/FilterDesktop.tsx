import { setFacet, toggleFacet, useSearch } from '@faststore/sdk'

import {
  Filter as UIFilter,
  FilterFacetBoolean as UIFilterFacetBoolean,
  FilterFacetBooleanItem as UIFilterFacetBooleanItem,
  FilterFacetRange as UIFilterFacetRange,
  FilterFacets as UIFilterFacets,
} from '@faststore/ui'
import { gql } from '@generated/gql'
import type { Filter_FacetsFragment } from '@generated/graphql'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { useFilter } from 'src/sdk/search/useFilter'
import { deliveryPromise } from 'discovery.config'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Title for the `FilterDesktop` component.
   */
  title?: string
}

function FilterDesktop({
  facets,
  testId,
  dispatch,
  expanded,
  title,
}: Props & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, state, setState } = useSearch()

  const filteredFacets = deliveryPromise.enabled
    ? facets
    : facets.filter((facet) => facet.key !== 'shipping')

  return (
    <UIFilter
      testId={`desktop-${testId}`}
      title={title}
      indicesExpanded={expanded}
      onAccordionChange={(idx) =>
        dispatch({ type: 'toggleExpanded', payload: idx })
      }
    >
      {filteredFacets.map((facet, index) => {
        const { __typename: type, label } = facet
        const isExpanded = expanded.has(index)
        return (
          <UIFilterFacets
            key={`${testId}-${label}-${index}`}
            testId={testId}
            index={index}
            type={type}
            label={label}
          >
            {type === 'StoreFacetBoolean' && isExpanded && (
              <UIFilterFacetBoolean>
                {facet.values.map((item) => (
                  <UIFilterFacetBooleanItem
                    key={`${testId}-${facet.label}-${item.label}`}
                    id={`${testId}-${facet.label}-${item.label}`}
                    testId={testId}
                    onFacetChange={(facet) => {
                      setState({
                        ...state,
                        selectedFacets: toggleFacet(
                          state.selectedFacets,
                          facet
                        ),
                        page: 0,
                      })
                      resetInfiniteScroll(0)
                    }}
                    selected={item.selected}
                    value={item.value}
                    quantity={item.quantity}
                    facetKey={facet.key}
                    label={item.label}
                  />
                ))}
              </UIFilterFacetBoolean>
            )}
            {type === 'StoreFacetRange' && isExpanded && (
              <UIFilterFacetRange
                facetKey={facet.key}
                min={facet.min}
                max={facet.max}
                formatter={
                  facet.key.toLowerCase() === 'price'
                    ? useFormattedPrice
                    : undefined
                }
                onFacetChange={(facet) => {
                  setState({
                    ...state,
                    selectedFacets: setFacet(state.selectedFacets, facet, true),
                    page: 0,
                  })
                  resetInfiniteScroll(0)
                }}
              />
            )}
          </UIFilterFacets>
        )
      })}
    </UIFilter>
  )
}

export const fragment = gql(`
  fragment Filter_facets on StoreFacet {
    ... on StoreFacetRange {
      key
      label

      min {
        selected
        absolute
      }

      max {
        selected
        absolute
      }

      __typename
    }
    ... on StoreFacetBoolean {
      key
      label
      values {
        label
        value
        selected
        quantity
      }

      __typename
    }
  }
`)

export default FilterDesktop
