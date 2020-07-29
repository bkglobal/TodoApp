const { validationResult } = require("express-validator");
const moment = require("moment");

module.exports.validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 422, errors: errors.array() });
  } else {
    next();
  }
};

module.exports.dateValidation = (value) => {
  const date = moment(value, ["DD-MM-YYYY", "DD/MM/YYYY"]);
  return date.isValid();
};
