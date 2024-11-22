import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

import { OverriddenDefaultHero as Hero } from 'src/components/sections/Hero/OverriddenDefaultHero'
import Incentives from 'src/components/sections/Incentives'
import { default as GLOBAL_COMPONENTS } from '../global/Components'

import CUSTOM_COMPONENTS from 'src/customizations/src/components'

const BannerText = dynamic(
  () =>
    import(
      /* webpackChunkName: "BannerText" */ 'src/components/sections/BannerText/OverriddenDefaultBannerText'
    ).then((mod) => ({ default: mod.OverriddenDefaultBannerText })),
  { ssr: false }
)
const Newsletter = dynamic(
  () =>
    import(
      /* webpackChunkName: "Newsletter" */ 'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
    ).then((mod) => ({ default: mod.OverriddenDefaultNewsletter })),
  { ssr: false }
)
const ProductShelf = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductShelf" */ 'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
    ).then((mod) => ({ default: mod.OverriddenDefaultProductShelf })),
  { ssr: false }
)
const ProductTiles = dynamic(
  () =>
    import(
      /* webpackChunkName: "ProductTiles" */ 'src/components/sections/ProductTiles'
    ),
  { ssr: false }
)

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  Hero,
  Incentives,
  BannerText,
  Newsletter,
  ProductShelf,
  ProductTiles,
  ...CUSTOM_COMPONENTS,
}

export default COMPONENTS
