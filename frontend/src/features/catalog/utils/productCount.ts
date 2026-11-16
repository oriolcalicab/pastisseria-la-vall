export const formatProductCount = (total: number): string =>
  `${total} ${total === 1 ? 'producte' : 'productes'}`
