export type CartItemType = {
  name: string
  storage: string
  color: string
  inventory: 'available' | 'out of stock'
  price: number
  // quantity: number
}

export const mockTableData: CartItemType[] = [
  {
    name: 'SGS23U-256GRN-EU',
    storage: '256GB | 8GB',
    color: 'Green',
    inventory: 'available',
    price: 1249.9,
    // quantity: 0,
  },
  {
    name: 'SGS23U-256BLK-EU',
    storage: '256GB | 8GB',
    color: 'Lavender',
    inventory: 'available',
    price: 1249.9,
    // quantity: 0,
  },
  {
    name: 'SGS23U-256LVD-EU',
    storage: '512GB | 8GB',
    color: 'Phantom Black',
    inventory: 'out of stock',
    price: 1249.9,
    // quantity: 0,
  },
  {
    name: 'SGS23U-128LVD-EU',
    storage: '128GB | 4GB',
    color: 'Phantom Black',
    inventory: 'out of stock',
    price: 989.9,
    // quantity: 0,
  },
  {
    name: 'SGS24U-128LVD-EU',
    storage: '128GB | 6GB',
    color: 'Black',
    inventory: 'available',
    price: 989.9,
    // quantity: 0,
  },
  {
    name: 'SGS25U-128LVD-EU',
    storage: '128GB | 6GB',
    color: 'Green',
    inventory: 'available',
    price: 989.9,
    // quantity: 0,
  },
  {
    name: 'SGS22U-512LVD-EU',
    storage: '512GB | 6GB',
    color: 'Gray',
    inventory: 'available',
    price: 989.9,
    // quantity: 0,
  },
  {
    name: 'SGS27U-512LVD-EU',
    storage: '512GB | 6GB',
    color: 'White',
    inventory: 'out of stock',
    price: 989.9,
    // quantity: 0,
  },
  {
    name: 'SGS18U-256LVD-EU',
    storage: '256GB | 8GB',
    color: 'White',
    inventory: 'available',
    price: 1089.9,
    // quantity: 0,
  },
]
