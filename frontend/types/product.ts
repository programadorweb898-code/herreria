export interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  image: string;
  additionalImages?: string[];
  detailDescription?: string;
  width?: number;
  height?: number;
  depth?: number;
}
