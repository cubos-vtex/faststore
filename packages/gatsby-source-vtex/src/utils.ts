import { SourceNodesArgs } from 'gatsby'

import { Category, Product, Channel } from './types'

const parseProductToDataNode = (product: Product) => ({
  ...product,
  slug: `/${product.linkText}/p`,
  categoryId: Number(product.categoryId),
})

export const createProductNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  product: Product
) => {
  const NODE_TYPE = 'Product'
  const data = parseProductToDataNode(product)

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.productId}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}

export const createCategoryNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { id, children, ...category }: Category
) => {
  const NODE_TYPE = 'Category'
  const urlSplited = category.url.split('/')
  const slug = urlSplited[urlSplited.length - 1]
  const data = {
    ...category,
    slug,
    categoryId: Number(id),
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.categoryId}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}

export const createChannelNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { extraContext, ...channel }: Channel
) => {
  const NODE_TYPE = 'Channel'
  const data = {
    salesChannel: extraContext?.portal?.salesChannel,
    ...channel,
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.id}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}
