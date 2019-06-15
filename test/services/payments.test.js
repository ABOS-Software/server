const request = require('supertest');

const assert = require('assert');
const app = require('../../src/app');
const {createYears} = require('../../src/databaseCreators/years');
const {createCustomers} = require('../../src/databaseCreators/customers');
const {createProducts} = require('../../src/databaseCreators/products');
const {createUsers, createAdmin} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const {cleanup} = require('../../src/databaseCreators/cleanup');
const {createCategories} = require('../../src/databaseCreators/categories');
const validatePaid =  (app, amountPaid) => (done) =>{
  request(app)
    .get('/customers/20')
    .query({
      'year': 20
    })
    .set('Authorization', app.get('USER2_JWT'))
    .expect(200)
    .then(response => {
      response.body.order.amountPaid.should.equal(amountPaid);
      done();
    })
    .catch(err => done(err));
}
describe('\'payments\' service', () => {
  let id = 1;
  let updateID = 2;
  let deleteID = 3;
  let orderID = 20;
  step('Creating Users', function(done)  {
    this.timeout(10000);

    createUsers(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Admin Users', function(done)  {
    this.timeout(10000);

    createAdmin(app).then((res, err) => {
      done(err);
    });
  });

  step('Get JWT', function(done) {
    request(app)
      .post('/authentication')
      .send({
        'strategy': 'local',
        'username': 'test2',
        'password': 'test2'
      })
      .expect(201)
      .end((err, res) => {
        app.set('USER2_JWT', res.body.accessToken);
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
  step('Creating Years', function(done)  {
    this.timeout(10000);

    createYears(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating userMangagers', function(done)  {
    this.timeout(10000);

    createUsersManagement(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Categories', function(done)  {
    this.timeout(10000);

    createCategories(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Products', function(done)  {
    this.timeout(10000);

    createProducts(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Customers', function(done)  {
    this.timeout(10000);

    createCustomers(app).then((res, err) => {
      done(err);
    });

  });
  step('Get Customer Details', function(done) {
    request(app)
      .get('/customers/20')
      .query({
        'year': 20
      })
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        orderID = response.body.order.id;
        done();
      })
      .catch(err => done(err));
  });
  step('Creates Payments', function(done) {
    this.timeout(100000);

    request(app)
      .post('/payments')
      .send([
        { 'amount': '10.00',
          'payment_method_id': 1,
          'payment_date': '2019-06-13',
          'note': 'Paid',
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2',
          'order_id': orderID},
        { 'amount': '14.00',
          'payment_method_id': 1,
          'payment_date': '2019-06-13',
          'note': 'Paid-Update',
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2',
          'order_id': orderID},
        { 'amount': '11.00',
          'payment_method_id': 1,
          'payment_date': '2019-06-13',
          'note': 'Paid-Delete',
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2',
          'order_id': orderID}
      ])
      .query({'year_id': 20})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(201)
      .then(response => {

        response.body.should.containDeep([
          { 'amount': '10.00',
            'payment_method_id': 1,
            'payment_date': '2019-06-13',
            'note': 'Paid',
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2',
            'order_id': orderID},
          { 'amount': '14.00',
            'payment_method_id': 1,
            'payment_date': '2019-06-13',
            'note': 'Paid-Update',
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2',
            'order_id': orderID},
          { 'amount': '11.00',
            'payment_method_id': 1,
            'payment_date': '2019-06-13',
            'note': 'Paid-Delete',
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2',
            'order_id': orderID}
        ]);
        updateID = response.body[1].id;
        deleteID = response.body[2].id;

        done();
      })
      .catch(err => done(err));
  });
  step('Valdiate Payment Initial', validatePaid(app, 35));
  step('Updates Payments', function(done) {
    this.timeout(100000);
    request(app)
      .put('/payments/' + updateID)
      .send({
        'id': updateID,
        'amount': 17.00,
        'payment_method': {'id': 1},
        'payment_date': '2019-06-13',
        'note': 'Paid-Updated',
        'year_id': 20,
        'customer_id': 20,
        'user_id': 2,
        'user_name': 'test2',
        'order_id': orderID},)
      .query({'year_id': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep({
          'id': updateID,
          'amount': 17.00,
          'payment_method_id': 1,
          'payment_date': '2019-06-13',
          'note': 'Paid-Updated',
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2',
          'order_id': orderID},);
        done();
      })
      .catch(err => done(err));
  });
  step('Valdiate Payment Updated', validatePaid(app, 38));

  step('Deletes Payments', function(done) {
    request(app)
      .delete('/payments/' + deleteID)
      .query({'year_id': 20})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Valdiate Payment Deleted', validatePaid(app, 27));

  step('Finds Payments', function(done) {
    request(app)
      .get('/payments')
      .query({'year': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.containDeep([
          { 'amount': 10.00,
            'payment_method': {'id': 1},
            'payment_date': '2019-06-13',
            'note': 'Paid',
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2',
            'order_id': orderID},
          { 'amount': 17.00,
            'payment_method': {'id': 1},
            'payment_date': '2019-06-13',
            'note': 'Paid-Updated',
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2',
            'order_id': orderID},
        ]);
        id = response.body.data[0].id;
        done();
      })
      .catch(err => done(err));
  });
  step('Gets Payment', function(done) {
    request(app)
      .get('/payments/' + id)
      .query({'year': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep(
          { 'amount': 10.00,
            'payment_method': {'id': 1},
            'payment_date': '2019-06-13',
            'note': 'Paid',
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2',
            'order_id': orderID},
        );
        done();
      })
      .catch(err => done(err));
  });


  after('Cleanup', function(done)  {
    this.timeout(10000);

    cleanup(app).then((res, err) => {
      done(err);
    });
  });
});
