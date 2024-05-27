type Params = {
  id: string;
};

type SearchedProductParams = {
  name: string;
  unit_amount: string | null;
  description?: string;
  images: string;
  id: string;
};

export type ProductPageProps = {
  params: Params;
  searchParams: SearchedProductParams;
};

export interface ProductResponse {
  id: string;
  object: object;
  active: boolean;
  attributes: any[];
  created: number;
  default_price: string;
  description: string;
  features: any[];
  images: string[];
  livemode: boolean;
  metadata: Record<string, string>;
  name: string;
  package_dimensions: null | string;
  shippable: null | boolean;
  statement_descriptor: null | string;
  tax_code: null | string | number;
  type: string;
  unit_label: null | string;
  updated: number;
  url: null | string;
}

export type ProductsResponse = {
  data: ProductResponse[];
};
