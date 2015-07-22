var thinky = require('../util/thinky.js');
var r = thinky.r;
var type = thinky.type;

var Report = thinky.createModel("Report", {
  id: type.string(),
  createdAt: type.date().default(r.now()),
  allegation: type.string().required(),
  ip: type.string(),
  files: [type.string()]
});

module.exports = Report;