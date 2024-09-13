export const tableColumns: string[] = [
  'Part Number',
  'Storage',
  'Color',
  'Availability',
  'Price (Tax included)',
  '',
  'Quantity',
]

export const mockTableData: {
  partNumber: string
  storage: string
  color: string
  availability: 'available' | 'out of stock'
  price: number
  quantity: number
}[] = [
  {
    partNumber: 'SGS23U-256GRN-EU',
    storage: '256GB | 8GB',
    color: 'Green',
    availability: 'available',
    price: 1249.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS23U-256BLK-EU',
    storage: '256GB | 8GB',
    color: 'Lavender',
    availability: 'available',
    price: 1249.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS23U-256LVD-EU',
    storage: '512GB | 8GB',
    color: 'Phantom Black',
    availability: 'out of stock',
    price: 1249.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS23U-128LVD-EU',
    storage: '128GB | 4GB',
    color: 'Phantom Black',
    availability: 'out of stock',
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS24U-128LVD-EU',
    storage: '128GB | 6GB',
    color: 'Black',
    availability: 'available',
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS25U-128LVD-EU',
    storage: '128GB | 6GB',
    color: 'Green',
    availability: 'available',
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS22U-512LVD-EU',
    storage: '512GB | 6GB',
    color: 'Gray',
    availability: 'available',
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS27U-512LVD-EU',
    storage: '512GB | 6GB',
    color: 'White',
    availability: 'out of stock',
    price: 989.9,
    quantity: 0,
  },
  {
    partNumber: 'SGS18U-256LVD-EU',
    storage: '256GB | 8GB',
    color: 'White',
    availability: 'available',
    price: 1089.9,
    quantity: 0,
  },
]
