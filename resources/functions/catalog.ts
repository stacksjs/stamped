/**
 * Stamped storefront catalog (UI-only).
 *
 * Static sample data so `./buddy dev` renders the full storefront without a
 * migrated database. Swap this for `commerce.products.*` (see
 * @stacksjs/commerce) once the backend is wired up — the views only depend on
 * the shape returned by `getProducts()` / `findProduct()`.
 *
 * Each product carries an optional `de` block; `getProducts('de')` returns the
 * products with their German strings applied, falling back to English for any
 * field left untranslated. Images live in /assets/images/stamped/*.
 */

const IMG = '/assets/images/stamped'

export type Locale = 'en' | 'de'

interface ProductI18n {
  name?: string
  color?: string
  blurb?: string
  description?: string
  details?: string[]
}

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
  de?: ProductI18n
}

const products: Product[] = [
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
    de: {
      name: 'I ❤ New York T-Shirt',
      color: 'Vintage-Weiß',
      blurb: 'Schweres T-Shirt aus 100 % Baumwolle mit unserem handgezeichneten City-Motiv.',
      description:
        'Ein schweres Alltags-T-Shirt mit lockerem, boxy Schnitt. In kleinen Mengen stückgefärbt für das eingetragene Vintage-Gefühl, mit doppelt genähten Nähten, die Wäsche für Wäsche ihre Form behalten. Das City-Motiv ist weich gedruckt und reißt nie.',
      details: [
        '100 % gekämmte ringgesponnene Baumwolle, 240 g/m²',
        'Boxy, lockerer Schnitt — für klassische Passform eine Nummer kleiner wählen',
        'Stückgefärbt, vorgewaschen',
        'In New York gedruckt',
      ],
    },
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
    de: {
      color: 'Vintage-Weiß',
      blurb: 'Schwerer Hoodie aus angerautem Fleece, gemacht für den langen Heimweg.',
      description:
        'Unser Signature-Pullover aus schwerem, angerautem Fleece, der mit jedem Tragen weicher wird. Fallende Schultern, eine doppellagige Kapuze und gerippte Bündchen, die wirklich halten. Großzügig genug, um den ganzen Winter zu layern.',
      details: [
        '420 g/m² angerautes Fleece mit hohem Baumwollanteil',
        'Oversized Schnitt mit fallenden Schultern',
        'Doppellagige Kapuze, Känguru-Tasche',
        'Gesticktes Innenlabel am Nacken',
      ],
    },
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
    de: {
      color: 'Meliertes Grau',
      blurb: 'Der Hoodie, den du längst hast — in klassischem meliertem Grau.',
      description:
        'Dasselbe schwere Fleece wie unser Pullover in Vintage-Weiß, in einem zeitlosen melierten Grau, das zu allem passt. Kombiniere ihn mit roher Denim und roten Sneakern oder mit dem, was du schon trägst.',
      details: [
        '420 g/m² angerautes Fleece mit hohem Baumwollanteil',
        'Oversized Schnitt mit fallenden Schultern',
        'Meliertes Grau, stückgewaschen',
        'Gesticktes Innenlabel am Nacken',
      ],
    },
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
    de: {
      color: 'Game Day',
      blurb: 'Ein schwererer, stadiontauglicher Schnitt für kalte Nachmittage auf der Tribüne.',
      description:
        'Unser bisher wärmster Pullover — ein Fleece mit Sherpa-Rücken, gemacht für den Spieltag auf dem Oberrang. Im Körper etwas länger geschnitten, damit er sitzt, wenn du zum Jubeln aufstehst.',
      details: [
        '480 g/m² Fleece mit Sherpa-Rücken',
        'Verlängerte Körperlänge',
        'Gerippte Bündchen mit Daumenschlaufe',
        'In limitierter Auflage gefertigt',
      ],
    },
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
    de: {
      color: 'Park-Edition',
      blurb: 'Ein weicheres, sonnengebleichtes Weiß, inspiriert von einem Nachmittag im Central Park.',
      description:
        'Eine limitierte Park-Edition unseres Pullovers, überfärbt zu einem weichen, sonnengebleichten Weiß. Gleiches schweres Fleece und Oversized-Schnitt — nur in einem ruhigeren, wärmeren Ton.',
      details: [
        '420 g/m² angerautes Fleece mit hohem Baumwollanteil',
        'Oversized Schnitt mit fallenden Schultern',
        'Überfärbtes, sonnengebleichtes Weiß',
        'Limitierte Park-Edition',
      ],
    },
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
    de: {
      name: 'I ❤ New York T-Shirt',
      color: 'Mitternacht',
      blurb: 'Der Schnitt unseres Signature-Shirts für die Stadt nach Einbruch der Dunkelheit.',
      description:
        'Eine nächtliche Version unseres schweren T-Shirts, veredelt mit einem Ton-in-Ton-City-Motiv, das das Neonlicht einfängt. Gleicher boxy, lockerer Schnitt, gleicher weicher Druck — gemacht für den Weg zwischen Bahn und dem nächsten Ort.',
      details: [
        '100 % gekämmte ringgesponnene Baumwolle, 240 g/m²',
        'Boxy, lockerer Schnitt — für klassische Passform eine Nummer kleiner wählen',
        'Ton-in-Ton, weicher Druck',
        'In New York gedruckt',
      ],
    },
  },
]

function localized(p: Product, loc: Locale): Product {
  if (loc !== 'de' || !p.de)
    return p
  return {
    ...p,
    name: p.de.name ?? p.name,
    color: p.de.color ?? p.color,
    blurb: p.de.blurb ?? p.blurb,
    description: p.de.description ?? p.description,
    details: p.de.details ?? p.details,
  }
}

export function getProducts(loc: Locale = 'en'): Product[] {
  return products.map(p => localized(p, loc))
}

export function findProduct(slug: string, loc: Locale = 'en'): Product | undefined {
  const p = products.find(x => x.slug === slug)
  return p ? localized(p, loc) : undefined
}

export function relatedProducts(slug: string, loc: Locale = 'en', limit = 4): Product[] {
  return products.filter(p => p.slug !== slug).slice(0, limit).map(p => localized(p, loc))
}

export function priceLabel(value: number): string {
  return `$${value.toFixed(2)}`
}

/** Lifestyle/editorial shots reused across the home + lookbook. */
export function getLookbook(loc: Locale = 'en'): { src: string, alt: string }[] {
  const en = [
    { src: `${IMG}/gallery-street.jpg`, alt: 'Wearing the tee on a midtown sidewalk' },
    { src: `${IMG}/gallery-waterfront.jpg`, alt: 'On the Brooklyn waterfront with the Manhattan skyline' },
    { src: `${IMG}/gallery-stadium.jpg`, alt: 'Game day in the stands' },
    { src: `${IMG}/gallery-park.jpg`, alt: 'An afternoon in the park' },
    { src: `${IMG}/gallery-night.jpg`, alt: 'Chinatown after dark' },
  ]
  const de = [
    'Das T-Shirt auf einem Bürgersteig in Midtown',
    'An der Brooklyner Waterfront mit der Skyline von Manhattan',
    'Spieltag auf der Tribüne',
    'Ein Nachmittag im Park',
    'Chinatown nach Einbruch der Dunkelheit',
  ]
  return loc === 'de' ? en.map((s, i) => ({ src: s.src, alt: de[i] })) : en
}
