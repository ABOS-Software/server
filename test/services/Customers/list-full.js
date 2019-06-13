module.exports = [
  {
    id: 20,
    phone: '555-555-5555',
    home: null,
    interested: null,
    ordered: null,
    donation: 12.45,
    state: 'PA',
    latitude: 39.949897,
    longitude: -75.163895,
    city: 'Philadelphia',
    use_coords: true,
    year_id: 20,
    user_id: 2,
    userName: 'test2',
    zipCode: '19109',
    customerName: 'Test Test',
    streetAddress: '123 S Broad St',
    custEmail: 'test@example.com',
    year: { id: 20, year: '1234' },
    user: { id: 2, fullName: 'test2 Name', username: 'test2' },
    order: {
      id: 1,
      cost: 60,
      quantity: 3,
      amountPaid: 0,
      delivered: false,
      userName: 'test2',
      orderedProducts: [
        {
          id: 1,
          quantity: 1,
          userName: 'test2',
          products: {
            id: 20,
            humanProductId: '1',
            unitCost: 40,
            unitSize: '3',
            productName: '1',
            category: {
              id: 20,
              category_name: 'P',
              delivery_date: '2017-05-30T00:00:00.000Z',
              year_id: 20
            },
            year: { id: 20, year: '1234' }
          },
          year: { id: 20, year: '1234' },
          extendedCost: 40
        },
        {
          id: 2,
          quantity: 2,
          userName: 'test2',
          products: {
            id: 23,
            humanProductId: '2',
            unitCost: 10,
            unitSize: '4',
            productName: '2',
            category: {
              id: 21,
              category_name: 'F',
              delivery_date: '2017-05-30T00:00:00.000Z',
              year_id: 20
            },
            year: { id: 20, year: '1234' }
          },
          year: { id: 20, year: '1234' },
          extendedCost: 20
        }
      ],
      year: { id: 20, year: '1234' }
    }
  },
  {
    id: 23,
    phone: '555-111-1111',
    home: null,
    interested: null,
    ordered: null,
    donation: 0,
    state: 'PA',
    latitude: 39.949924,
    longitude: -75.163949,
    city: 'Philadelphia',
    use_coords: true,
    year_id: 20,
    user_id: 2,
    userName: 'test2',
    zipCode: '19109',
    customerName: 'John Smith',
    streetAddress: '125 S Broad St',
    custEmail: 'john@example.com',
    year: { id: 20, year: '1234' },
    user: { id: 2, fullName: 'test2 Name', username: 'test2' },
    order: {
      id: 2,
      cost: 120,
      quantity: 6,
      amountPaid: 0,
      delivered: true,
      userName: 'test2',
      orderedProducts: [
        {
          id: 3,
          quantity: 2,
          userName: 'test2',
          products: {
            id: 20,
            humanProductId: '1',
            unitCost: 40,
            unitSize: '3',
            productName: '1',
            category: {
              id: 20,
              category_name: 'P',
              delivery_date: '2017-05-30T00:00:00.000Z',
              year_id: 20
            },
            year: { id: 20, year: '1234' }
          },
          year: { id: 20, year: '1234' },
          extendedCost: 80
        },
        {
          id: 4,
          quantity: 4,
          userName: 'test2',
          products: {
            id: 23,
            humanProductId: '2',
            unitCost: 10,
            unitSize: '4',
            productName: '2',
            category: {
              id: 21,
              category_name: 'F',
              delivery_date: '2017-05-30T00:00:00.000Z',
              year_id: 20
            },
            year: { id: 20, year: '1234' }
          },
          year: { id: 20, year: '1234' },
          extendedCost: 40
        }
      ],
      year: { id: 20, year: '1234' }
    }
  }
] ;
