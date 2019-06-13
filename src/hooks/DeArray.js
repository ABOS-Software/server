module.exports = function () {

  return async context => {
    if (context.type === 'before') {
      if ((context.data instanceof Array) && context.data.length === 1) {
        context.data = context.data[0];
      }
    }
    if (context.type === 'after') {
      let custData;
      if (context.method === 'update') {
        if ((context.data instanceof Array) && context.data.length === 1) {
          context.data = context.data[0];
        }
        if ((context.result instanceof Array) && context.result.length === 1) {
          context.result = context.result[0];
        }
      } else {
        if ((context.result instanceof Array) && context.result.length === 1) {
          context.result = context.result[0];
        }

      }
    }
    return context;



  };
};
