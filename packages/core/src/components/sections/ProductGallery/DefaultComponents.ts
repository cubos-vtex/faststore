import { lazy } from 'react'
import {
  Button as UIButton,
  LinkButton as UILinkButton,
  Skeleton as UISkeleton,
  Icon as UIIcon,
  ToggleField as UIToggleField,
  ProductComparison as UIProductComparison,
  ProductComparisonSidebar as UIProductComparisonSidebar,
  ProductComparisonToolbar as UIProductComparisonToolbar,
} from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import FilterDesktop from 'src/components/search/Filter/FilterDesktop'
import EmptyGallery from './EmptyGallery'
import ProductComparisonSidebar from 'src/components/ui/ProductComparison'

const FilterSlider = lazy(
  () => import('src/components/search/Filter/FilterSlider')
)
export const ProductGalleryDefaultComponents = {
  MobileFilterButton: UIButton,
  FilterIcon: UIIcon,
  PrevIcon: UIIcon,
  ResultsCountSkeleton: UISkeleton,
  SortSkeleton: UISkeleton,
  FilterButtonSkeleton: UISkeleton,
  ToggleField: UIToggleField,
  ProductComparison: UIProductComparison,
  ProductComparisonSidebar: UIProductComparisonSidebar,
  ProductComparisonToolbar: UIProductComparisonToolbar,
  LinkButtonPrev: UILinkButton,
  LinkButtonNext: UILinkButton,
  __experimentalFilterDesktop: FilterDesktop,
  __experimentalFilterSlider: FilterSlider,
  __experimentalProductCard: ProductCard,
  __experimentalEmptyGallery: EmptyGallery,
  __experimentalProductComparisonSidebar: ProductComparisonSidebar,
} as const
