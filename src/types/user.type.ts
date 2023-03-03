import { UserRoleEnum } from "./enums";

export type User = {
  username: string;
  role: UserRoleEnum;
  createdAt: string;
};

export type CreateUserDTO = {
  username: string;
  role: UserRoleEnum;
  password: string;
};

export type Catalog = {
  id: string;
  products: Product[];
};

export type Product = {
  id: string;
  name: string;
  price: string;
};

export type Order = {
  id: string;
  address: string;
  catalogues: Catalog[];
};

export type CreateOrderDTO = {
  address: string;
  catalogIds: string[];
};

export type CreateCatalogDTO = {
  products: Product[];
};

