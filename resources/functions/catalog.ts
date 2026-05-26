/**
 * Stamped storefront catalog (UI-only).
 *
 * This is static sample data so `./buddy dev` renders the full storefront
 * without a migrated database. Swap this out for `commerce.products.*`
 * (see @stacksjs/commerce) once the backend is wired up — the views only
 * depend on the shape returned by `getProducts()` / `findProduct()`.
 *
 * Images are served from /assets/images/stamped/* (see resources/assets).
 */

const IMG = '/assets/images/stamped'

export interface Product {
  slug: string
  name: string
  color: string
  /** price in whole USD */
  price: number
  compareAt?: number
  category: 'Tees' | 'Hoodies' | 'Crewnecks'
  badge?: string
  /** first image is the hero/primary */
  images: string[]
  sizes: string[]
  blurb: string
  description: string
  details: string[]
}

export const products: Product[] = [
  {
    slug: 'ny-tee',
    name: 'I ❤ New York Tee',
    color: 'Vintage White',
    price: 42,
    category: 'Tees',
    badge: 'Bestseller',
    images: [`${IMG}/product-ny-tee.jpg`, `${IMG}/gallery-street.jpg`, `${IMG}/lifestyle-sidewalk.jpg`],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    blurb: 'Heavyweight 100% cotton tee with our hand-drawn city mark.',
    description:
      'A heavyweight everyday tee cut for a relaxed, boxy fit. Garment-dyed in small batches for that lived-in vintage feel, with double-stitched seams that hold their shape wash after wash. The city mark is printed soft-hand so it never cracks.',
    details: [
      '100% combed ring-spun cotton, 240gsm',
      'Boxy relaxed fit — size down for a classic fit',
      'Garment-dyed, pre-shrunk',
      'Screen-printed in New York',
    ],
  },
  {
    slug: 'ny-hoodie',
    name: 'I ❤ New York Hoodie',
    color: 'Vintage White',
    price: 78,
    category: 'Hoodies',
    badge: 'Bestseller',
    images: [`${IMG}/lifestyle-dumbo.jpg`, `${IMG}/gallery-park.jpg`, `${IMG}/gallery-night.jpg`],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    blurb: 'Brushed-fleece heavyweight hoodie, built for the long walk home.',
    description:
      'Our signature pullover in a heavyweight brushed fleece that softens with every wear. Dropped shoulders, a double-layer hood, and ribbed cuffs that actually stay put. Roomy enough to layer all winter.',
    details: [
      '420gsm cotton-rich brushed fleece',
      'Oversized fit with dropped shoulders',
      'Double-layer hood, kangaroo pocket',
      'Embroidered interior neck label',
    ],
  },
  {
    slug: 'ny-hoodie-heather',
    name: 'I ❤ New York Hoodie',
    color: 'Heather Grey',
    price: 78,
    category: 'Hoodies',
    images: [`${IMG}/gallery-waterfront.jpg`, `${IMG}/lifestyle-stadium-stand.jpg`],
    sizes: ['S', 'M', 'L', 'XL'],
    blurb: 'The hoodie you already own — in a classic marled heather grey.',
    description:
      'The same heavyweight fleece as our vintage white pullover, in a timeless marled heather grey that goes with everything. Pairs with raw denim and red runners, or whatever you already have on.',
    details: [
      '420gsm cotton-rich brushed fleece',
      'Oversized fit with dropped shoulders',
      'Marled heather grey, garment-washed',
      'Embroidered interior neck label',
    ],
  },
  {
    slug: 'ny-hoodie-gameday',
    name: 'I ❤ New York Hoodie',
    color: 'Game Day',
    price: 82,
    compareAt: 92,
    category: 'Hoodies',
    badge: 'New',
    images: [`${IMG}/gallery-stadium.jpg`, `${IMG}/lifestyle-stadium-hood.jpg`],
    sizes: ['S', 'M', 'L', 'XL'],
    blurb: 'A heavier, stadium-ready cut for cold afternoons in the stands.',
    description:
      'Our warmest pullover yet — a brushed sherpa-back fleece built for game day in the upper deck. Cut a touch longer in the body so it stays put when you stand up to cheer.',
    details: [
      '480gsm sherpa-back fleece',
      'Extended body length',
      'Ribbed thumb-loop cuffs',
      'Made in limited runs',
    ],
  },
  {
    slug: 'ny-hoodie-park',
    name: 'I ❤ New York Hoodie',
    color: 'Park Edition',
    price: 78,
    category: 'Hoodies',
    images: [`${IMG}/gallery-park.jpg`, `${IMG}/gallery-night.jpg`],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    blurb: 'A softer, sun-faded white inspired by an afternoon in Central Park.',
    description:
      'A limited Park Edition of our pullover, over-dyed to a soft sun-faded white. Same heavyweight fleece and oversized fit — just a quieter, warmer tone.',
    details: [
      '420gsm cotton-rich brushed fleece',
      'Oversized fit with dropped shoulders',
      'Over-dyed sun-faded white',
      'Limited Park Edition',
    ],
  },
  {
    slug: 'ny-tee-night',
    name: 'I ❤ New York Tee',
    color: 'Midnight',
    price: 44,
    category: 'Tees',
    badge: 'New',
    images: [`${IMG}/gallery-night.jpg`, `${IMG}/gallery-street.jpg`],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    blurb: 'The city-after-dark cut of our signature tee.',
    description:
      'A late-night take on our heavyweight tee, finished with a tonal city mark that catches the neon. Same boxy relaxed fit, same soft-hand print — built for the walk between the train and the next place.',
    details: [
      '100% combed ring-spun cotton, 240gsm',
      'Boxy relaxed fit — size down for a classic fit',
      'Tonal soft-hand print',
      'Screen-printed in New York',
    ],
  },
]

export function getProducts(): Product[] {
  return products
}

export function findProduct(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function priceLabel(value: number): string {
  return `$${value.toFixed(2)}`
}

export function relatedProducts(slug: string, limit = 4): Product[] {
  return products.filter(p => p.slug !== slug).slice(0, limit)
}

/** Lifestyle/editorial shots reused across the home + lookbook. */
export const lookbook: { src: string, alt: string }[] = [
  { src: `${IMG}/gallery-street.jpg`, alt: 'Wearing the tee on a midtown sidewalk' },
  { src: `${IMG}/gallery-waterfront.jpg`, alt: 'On the Brooklyn waterfront with the Manhattan skyline' },
  { src: `${IMG}/gallery-stadium.jpg`, alt: 'Game day in the stands' },
  { src: `${IMG}/gallery-park.jpg`, alt: 'An afternoon in the park' },
  { src: `${IMG}/gallery-night.jpg`, alt: 'Chinatown after dark' },
]
