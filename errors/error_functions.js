exports.methodNotAllowed = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};

exports.psqlErrors = err => {
  const { code } = err;
  const errors = {
    "22P02": { status: 404, msg: "Invalid_text_representation" }
  };
  return errors[code];
};
