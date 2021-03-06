
const should = require('should');
const MakeArray = require('../../src/hooks/makeArray');


describe('\'Make-Array\' hook', () => {



  it('Test Before', function () {
    let fakeContext = {
      type: 'before',
      method: 'update',
      data: {key: 'element'}
    };
    let returnData = MakeArray()(fakeContext);

    returnData.data.should.deepEqual([{key: 'element'}]);
  });
  it('Test Before 2 items', function () {
    let fakeContext = {
      type: 'before',
      method: 'update',
      data: [{key: 'element'}, {key: 'element2'}]
    };
    let returnData = MakeArray()(fakeContext);

    returnData.data.should.deepEqual( [{key: 'element'}, {key: 'element2'}]);
  });
  it('Test After Update', function () {
    let fakeContext = {
      type: 'after',
      method: 'update',
      data: {key: 'element'},
      result: {key: 'element'}

    };
    let returnData = MakeArray()(fakeContext);

    returnData.data.should.deepEqual([{key: 'element'}]);
    returnData.result.should.deepEqual([{key: 'element'}]);
  });
  it('Test After Create', function () {
    let fakeContext = {
      type: 'after',
      method: 'create',
      data:{key: 'element'},
      result: {key: 'element'}
    };
    let returnData = MakeArray()(fakeContext);

    returnData.result.should.deepEqual([{key: 'element'}]);
  });
  it('Test After Update 2 items', function () {
    let fakeContext = {
      type: 'after',
      method: 'update',
      data: [{key: 'element'}, {key: 'element2'}],
      result: [{key: 'element'}, {key: 'element2'}]
    };
    let returnData = MakeArray()(fakeContext);

    returnData.data.should.deepEqual( [{key: 'element'}, {key: 'element2'}]);
    returnData.result.should.deepEqual( [{key: 'element'}, {key: 'element2'}]);
  });
  it('Test After Create 2 items', function () {
    let fakeContext = {
      type: 'after',
      method: 'create',
      data: [{key: 'element'}, {key: 'element2'}],
      result: [{key: 'element'}, {key: 'element2'}]
    };
    let returnData = MakeArray()(fakeContext);

    returnData.result.should.deepEqual( [{key: 'element'}, {key: 'element2'}]);
  });

});
