module.exports = function () {

  return async context => {
    if (context.type === 'before') {
      if (!(context.data instanceof Array)) {
        context.data = [context.data];
      }
    }
    if (context.type === 'after') {
      let custData;
      if (context.method === 'update') {
        if (!(context.data instanceof Array)) {
          context.data = [context.data];
        }
      } else {
        if (!(context.result instanceof Array)) {
          context.result = [context.result];
        }

      }
    }
    return context;



  };
};
