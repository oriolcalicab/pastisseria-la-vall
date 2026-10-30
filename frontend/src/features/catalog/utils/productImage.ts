import noProductImage from '../../../assets/no-product.svg'

export const getProductImageUrl = (imageUrl: string | null): string =>
  imageUrl || noProductImage