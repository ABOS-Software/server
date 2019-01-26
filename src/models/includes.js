const {ordersAttr, customerAttr, orderedProductsAttr, yearAttr, userAttr, productsAttr} = require('./attributes');

module.exports = {
  productsInc: function (seqClient) {
    const categories = seqClient.models['categories'];
    const products = seqClient.models['products'];
    const year = seqClient.models['year'];
    return {
      model: products,
      attributes: productsAttr,
      include: [{model: categories}, {model: year, attributes: yearAttr}],
      as: 'products'
    };
  }

};






