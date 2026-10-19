// The Lagom 5 home designs, as listed on lagomdevelopment.com
export const homes = [
  {
    id: 'Model 1',
    beds: 3,
    baths: 2,
    sqft: 1493,
    dimensions: '62′ × 26′',
    image: new URL('../assets/model-1.jpg', import.meta.url).href,
    description: 'Designed for comfortable everyday living, this thoughtfully planned home features an open-concept layout, spacious gathering areas, and private bedroom retreats, bringing together style, functionality, and lasting value.',
  },
  {
    id: 'Model 2',
    beds: 3,
    baths: 2,
    sqft: 1400,
    dimensions: '43′ × 45′',
    image: new URL('../assets/model-2.jpg', import.meta.url).href,
    description: 'Designed for modern family living, this thoughtfully planned home combines open gathering spaces, comfortable private bedrooms, and smart everyday functionality in an efficient footprint.',
  },
  {
    id: 'Model 3',
    beds: 2,
    baths: 2,
    sqft: 1200,
    dimensions: '49′ × 32′',
    image: new URL('../assets/model-3.jpg', import.meta.url).href,
    description: 'Thoughtfully designed for comfortable everyday living, this efficient two-bedroom home features open-concept spaces, abundant natural light, and a private primary suite — all in a smart, easy-to-maintain layout.',
  },
  {
    id: 'Model 4',
    beds: 3,
    baths: 2,
    sqft: 1176,
    dimensions: '47′ × 28′',
    image: new URL('../assets/model-4.jpg', import.meta.url).href,
    description: 'Designed for growing families, this thoughtfully planned home offers three comfortable bedrooms, open-concept living, and functional spaces that make everyday life effortless.',
  },
  {
    id: 'Model 5',
    beds: 3,
    baths: 2,
    sqft: 1277,
    dimensions: '50′ × 29′',
    image: new URL('../assets/model-5.jpg', import.meta.url).href,
    description: 'Designed for modern family living, this spacious home features an open-concept layout, a private primary suite, and thoughtfully designed spaces that bring comfort and functionality together.',
  },
]

export function getHome(id) {
  return homes.find((h) => h.id === id) || null
}

export function homeSpecs(home) {
  return `${home.beds} Bed · ${home.baths} Bath · ${home.sqft.toLocaleString()} sq ft`
}
