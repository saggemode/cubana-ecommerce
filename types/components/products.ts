export type ProductProps = {
  id: string;
  name: string;
  images?: string[];
  unit_amount: number | null;
  currency: string;
};

export type ProductListProps = {
  data?: ProductProps[];
};

export type ProductDetailsProps = {
  id?: string;
  data: {
    id?: string;
    name: string;
    images: string;
    unit_amount: string | number | null;
    description?: string;
  };
};
