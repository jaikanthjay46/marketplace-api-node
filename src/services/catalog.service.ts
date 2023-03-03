import { NotFound, BadRequest } from 'http-errors';
import { Service } from 'typedi';
import { catalogDTO } from '../dto/catalog.dto';
import { CatalogModel, UserModel } from '../models';
import ProductModel from '../models/product.model';
import { Catalog, Product } from '../types';

@Service()
export default class CatalogService {
  /**
   * Returns the catalog of a seller or throws a `NotFound` error if not found.
   */
  async getCatalogByUser(sellerId: string): Promise<Catalog[]> {
    const catalogues = await CatalogModel.findAll({where: { sellerId }});

    if (!catalogues) {
      throw new NotFound('Seller not found.');
    }

    return catalogues.map( catalog => catalogDTO(catalog));
  }

  /**
   * Create catalog for User
   */
  async createCatalogForUser(userId: string, products: Product[]): Promise<Catalog> {
    const catalogues = await CatalogModel.findOne({where: { sellerId: userId }});

    if (catalogues) {
      throw new BadRequest('Catalog already exists for this seller');
    }

    const catalog = new CatalogModel();
    catalog.sellerId = userId;
    catalog.seller = await UserModel.findByPk(userId) as UserModel;
    await catalog.save()

    const catalogues$ = products.map( async (product) => {
      const productInstance = await ProductModel.create({...product, catalogId: catalog.id, catalog: catalog });

      return catalog.$add('products', productInstance)
    });

    Promise.all(catalogues$);

    return catalogDTO(catalog);

  }

}
