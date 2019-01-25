// Initializes the `reports` service on path `/reports`

const auth = require('@feathersjs/authentication');
const reportsService = require('./reports.class');

const template = require('./Reports.js');
module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };



  // Initialize our service with any options it requires
  app.use('/reports', auth.express.authenticate('jwt'), async function (req, res, next) {
    try {
      let repServ = new reportsService(options, app);
      let data = await repServ.generate(req.body);


      const jsreport = app.get('jsreport');
      await jsreport.render({
        template: {
          content: template,
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          chrome: {
            marginTop: '1in',
            marginBottom: '1in',
            marginLeft: '0.5in',
            marginRight: '0.5in',
          }
        },
        data: data.data
      }).then((resp) => {
        // prints pdf with headline Hello world
        // console.log(resp.content.toString());
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=' + data.fileName,
          'Content-Length': resp.content.length,
          'Access-Control-Expose-Headers': 'Content-Disposition'
        });
        res.end(resp.content);
        return '';
        //  return {data: resp.content.toString('base64')};
      }).catch(e => {
        console.error(e);
      });
    } catch (e) {
      console.error(e);
    }

    // console.log(req);
  });

  // Get our initialized service so that we can register hooks
  // const service = app.service('reports');

  //service.hooks(hooks);
};
