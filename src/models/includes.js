const {ordersAttr, customerAttr, orderedProductsAttr, yearAttr, userAttr, productsAttr} = require('./attributes');
const productsInc = (seqClient) => {
  const categories = seqClient.models['categories'];
  const products = seqClient.models['products'];
  return {
    model: products,
    attributes: productsAttr,
    include: [{model: categories}, yearInc(seqClient)],
    as: 'products'
  };
};
const yearInc = (seqClient) => {

  const year = seqClient.models['year'];
  return {model: year, attributes: yearAttr};
};
const ordersInc = (seqClient) => {
  const orderedProducts = seqClient.models['ordered_products'];
  const orders = seqClient.models['orders'];
  return {
    model: orders,
    attributes: ordersAttr,
    include: [{
      model: orderedProducts,
      attributes: orderedProductsAttr,
      include: [productsInc(seqClient), yearInc(seqClient)],
      as: 'orderedProducts'
    }, yearInc(seqClient)],
    as: 'order'
  };
};
module.exports = {
  productsInc: productsInc,
  yearInc: yearInc,
  ordersInc: ordersInc,

};






