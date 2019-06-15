const should = require('should');

it('test', function() {
  let ret = [
    {
      id: 1,
      category_name: 'test1',
      delivery_date: '2019-06-13T00:00:00.000Z',
      created_at: '2019-06-13T16:58:19.735Z',
      updated_at: '2019-06-13T16:58:19.735Z',
      year_id: 20
    },
    {
      id: 2,
      category_name: 'test1-Update',
      delivery_date: '2019-06-13T00:00:00.000Z',
      created_at: '2019-06-13T16:58:19.735Z',
      updated_at: '2019-06-13T16:58:19.735Z',
      year_id: 20
    },
    {
      id: 3,
      category_name: 'test1-Delete',
      delivery_date: '2019-06-13T00:00:00.000Z',
      created_at: '2019-06-13T16:58:19.735Z',
      updated_at: '2019-06-13T16:58:19.735Z',
      year_id: 20
    }
  ];
  ret.should.containDeepOrdered([
    {'category_name': 'test1', 'year_id': 20, 'delivery_date': '2019-06-13T00:00:00.000Z'},
    {'category_name': 'test1-Update', 'year_id': 20, 'delivery_date': '2019-06-13T00:00:00.000Z'},
    {'category_name': 'test1-Delete', 'year_id': 20, 'delivery_date': '2019-06-13T00:00:00.000Z'}
  ]);
});
