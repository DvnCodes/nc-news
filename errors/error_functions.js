exports.methodNotAllowed = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};

exports.psqlErrors = code => {
  console.log(code);

  const errors = {
    "22P02": { status: 400, msg: "Invalid text representation" },
    "42703": { status: 400, msg: "Undefined column" }
  };

  return errors[code];
};
