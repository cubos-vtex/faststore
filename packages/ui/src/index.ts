/*
  O export abaixo faz com que tudo de @faststore/components seja exportado junto com o @faststore/ui.
  Por isso que `import { X } from "@faststore/ui"` dá no mesmo que `import { X } from "@faststore/components"`
*/
export * from '@faststore/components'

// Atoms
export { default as TextArea } from './components/atoms/TextArea'
export type { TextAreaProps } from './components/atoms/TextArea'

export { default as Incentive } from './components/atoms/Incentive'
export type { IncentiveProps } from './components/atoms/Incentive'

// Organisms
export { Tile, Tiles } from './components/organisms/Tiles'
export type { TilesProps, TileProps } from './components/organisms/Tiles'
