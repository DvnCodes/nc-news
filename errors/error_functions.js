exports.methodNotAllowed = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};

exports.psqlErrors = code => {
  console.log("using psql error handler........");

  const errors = {
    "22P02": { status: 400, msg: "Invalid text representation" }
  };
  return errors[code];
};
