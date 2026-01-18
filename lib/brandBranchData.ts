// lib/brandBranchData.ts

export interface BranchConfig {
  [platform: string]: {
    [brand: string]: string[]
  }
}

export const PLATFORMS = ['Shopee', 'TikTok', 'Lazada']

export const BRANDS: { [platform: string]: string[] } = {
  Shopee: ['Brighty', 'Ciara', 'Harnisch', 'Herbikids', 'Herbiglow', 'Jiera'],
  TikTok: ['Brighty', 'Ciara', 'Harnisch', 'Herbikids', 'Herbiglow', 'Jiera'],
  Lazada: ['Brighty', 'Ciara'],
}

export const BRANCHES: BranchConfig = {
  Shopee: {
    Brighty: [
      'Brighty Official Shop',
      'Brighty Official Store',
      'Brighty Jakarta Selatan',
      'Brighty Jawa Tengah',
      'Brighty Kalimantan',
      'Brighty Makassar',
      'Brighty Medan',
      'Brighty Surabaya',
      'Brighty Malaysia',
      'Brighty Filipina',
      'Brighty Singapura',
    ],
    Ciara: [
      'Ciara Indonesia',
      'Ciara Beauty',
      'Ciara Jawa Tengah',
      'Ciara Kalimantan',
      'Ciara Makassar',
      'Ciara Medan',
      'Ciara Surabaya',
      'Ciara Malaysia',
      'Ciara Singapura',
      'Ciara Filipina',
    ],
    Harnisch: ['Harnisch'],
    Herbikids: ['Herbikids'],
    Herbiglow: ['Herbiglow'],
    Jiera: ['Jiera Official', 'Jiera Surabaya'],
  },
  TikTok: {
    Brighty: ['Brighty.id', 'Brighty Malaysia'],
    Ciara: ['Ciara Indonesia', 'Ciara Malaysia'],
    Harnisch: ['Harnisch'],
    Herbikids: ['Herbikids'],
    Herbiglow: ['Herbiglow'],
    Jiera: ['Jiera'],
  },
  Lazada: {
    Brighty: ['Brighty Official Store'],
    Ciara: ['Ciara Official Store'],
  },
}

export const getBrandsByPlatform = (platform: string): string[] => {
  return BRANDS[platform] || []
}

export const getBranchesByPlatformAndBrand = (
  platform: string,
  brand: string
): string[] => {
  return BRANCHES[platform]?.[brand] || []
}
