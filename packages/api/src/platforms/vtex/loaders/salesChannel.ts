import DataLoader from 'dataloader'

import type { Options } from '..'
import type { Clients } from '../clients'

import type { SalesChannel } from './../clients/commerce/types/SalesChannel'

export const getSalesChannelLoader = (_: Options, clients: Clients) => {
  const loader = async (channels: readonly string[]) =>
    Promise.all(channels.map((sc) => clients.commerce.catalog.salesChannel(sc)))

  return new DataLoader<string, SalesChannel>(loader)
}
