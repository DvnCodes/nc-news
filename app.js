const apiRouter = require("./routes/api.route");
const express = require("express");
const { psqlErrors } = require("./errors/error_functions");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  next({ status: 404, msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.code) {
    // psqlErrors(err).then(err => {
    //   console.log("xxxxxxxxx");
    //   res.status(err.status).send({ msg: err.msg });
    // });
    res.status(400).send({ msg: "Invalid_text_representation" });
  }
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
