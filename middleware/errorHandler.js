//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const error = `An account with that ${field} already exists.`;
  return res.status(code).send({ messages: error, fields: field });
};
//handle field formatting, empty fields, and mismatched passwords
//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  if (errors.length > 1) {
    const formattedErrors = errors.join(",");
    res.status(code).send({
      messages: formattedErrors,
      fields: fields,
    });
  } else {
    res.status(code).send({
      messages: errors,
      // fields: fields
    });
  }
};
//error controller function
const error = (err, req, res, next) => {
  console.log("Error handling middleware", err.name, err);
  try {
    if (err.name === "ValidationError") {
      let errors = Object.values(err.errors).map((el) => el.message);
      return res.status(400).json({ error: errors });
      // handleValidationError(err, res);
    }
    // return (err = handleValidationError(err, res));
    if (err.code && err.code === 11000) {
      handleDuplicateKeyError(err, res);
    }
    // } else {
    //   return res.status(500).json({ msg: "Unknown error occurred" });
    // }
    // return (err = handleDuplicateKeyError(err, res));
  } catch (err) {
    return res.status(500).send("An unknown error occurred.");
  }
};
module.exports = error;
