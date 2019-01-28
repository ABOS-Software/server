/* eslint-disable no-unused-vars */
class Service {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async get(id, params) {
  }

  async createProduct(product, year) {
    const seqClient = this.app.get('sequelizeClient');

    const products = seqClient.models['products'];
    await products.create({
      human_product_id: product.humanProductId,
      product_name: product.productName,
      unit_size: product.unitSize,
      unit_cost: product.unitCost,
      category_id: product.category,
      year_id: year
    });
  }

  async updateProducts(product) {
    const seqClient = this.app.get('sequelizeClient');

    const products = seqClient.models['products'];
    let prod = await products.findByPk(product.id);

    prod.human_product_id = product.humanProductId;
    prod.product_name = product.productName;
    prod.unit_size = product.unitSize;
    prod.unit_cost = product.unitCost;
    prod.category_id = product.category;
    await prod.save();
  }

  async create(data, params) {
    const seqClient = this.app.get('sequelizeClient');

    const products = seqClient.models['products'];

    let newProducts = data.newProducts;
    let updatedProducts = data.updatedProducts;
    let deletedProducts = data.deletedProducts;
    for (const product of newProducts) {

      if (product.status !== 'DELETE') {
        await this.createProduct(product, data.year);
      }
    }
    for (const product of updatedProducts) {
      await this.updateProducts(product);

    }
    for (const product of deletedProducts) {

      let prod = await products.findByPk(product.id);
      await prod.destroy();

    }

    return ['success'];


  }

  async update(id, data, params) {
  }

  async patch(id, data, params) {
  }

  async remove(id, params) {
  }
}

module.exports = function (options, app) {
  return new Service(options, app);
};

module.exports.Service = Service;
