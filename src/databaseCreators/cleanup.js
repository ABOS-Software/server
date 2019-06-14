const cleanupYears = (app) => {
  return app.service('Years').remove(null);

};

const cleanupUsers = (app) => {
  return app.service('user').remove(null, {query: {id: {$in: [2,3,4, 5]}}});

};


const cleanup = (app) => {
  return cleanupUsers(app)
    .then(cleanupYears(app));

};

module.exports = {
  cleanup: cleanup
};
