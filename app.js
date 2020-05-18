const apiRouter = require("./routes/api.route");
const express = require("express");
const { psqlErrors } = require("./errors/error_functions");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  next({ status: 404, msg: "Not found" });
});

app.use((err, req, res, next) => {
  // console.log(err);

  if (err.code !== undefined) {
    err = psqlErrors(err.code);
  } else if (err.status !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
