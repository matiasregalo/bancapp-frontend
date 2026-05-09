export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface CreateProductRequest {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export type UpdateProductRequest = Omit<CreateProductRequest, 'id'>;

export interface ProductFormState {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export type ProductFormValues = ProductFormState;

export interface ProductFormErrors {
  id?: string;
  name?: string;
  description?: string;
  logo?: string;
  date_release?: string;
}
