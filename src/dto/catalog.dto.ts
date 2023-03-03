import { CatalogModel } from '../models';
import { Catalog } from '../types';

export const catalogDTO = (catalog: CatalogModel): Catalog => {
  const catalogDTO: Catalog = {
    id: catalog.id,
    products: catalog.products
  };

  return catalogDTO;
};
