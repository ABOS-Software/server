const logger = require('../../logger');

const auth = require('@feathersjs/authentication');
const ReportsGenerator = require('./ReportsGenerator.class');

const template = require('./Reports.js');

const jsReportTemplate = {
  content: template,
  engine: 'handlebars',
  recipe: 'chrome-pdf',
  chrome: {
    marginTop: '1in',
    marginBottom: '1in',
    marginLeft: '0.5in',
    marginRight: '0.5in',
  }
};
const writeResponse = (data, resp, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=' + data.fileName,
    'Content-Length': resp.content.length,
    'Access-Control-Expose-Headers': 'Content-Disposition'
  });
  res.end(resp.content);
};
const reportsMiddleware = (app) => {
  return async (req, res) => {
    const paginate = app.get('paginate');

    const options = {
      paginate
    };

    try {
      let generator = new ReportsGenerator(options, app);
      let data = await generator.generate(req.body);
      const jsreport = app.get('jsreport');
      await jsreport.render({
        template: jsReportTemplate,
        data: data.data
      }).then((resp) => {

        writeResponse(data, resp, res);
        return '';
      }).catch(e => {
        logger.error(e);
      });
    } catch (e) {
      logger.error(e);
    }
  };
};
module.exports = function (app) {


  app.use('/reports', auth.express.authenticate('jwt'), reportsMiddleware(app));

};
