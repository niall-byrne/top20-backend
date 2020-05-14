const express = require("express");
const winston = require("winston");
const expressWinston = require("express-winston");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const enforce = require("express-sslify");
const compression = require("compression");
require("dotenv").config();

const { getTopAlbums } = require("./util/lastfm.api");
const { getPort } = require("./util/util");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
  expressWinston.logger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
    level: "info",
    metaField: null,
    requestField: null,
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(compression());
}

app.post("/lastfm", (req, res) => {
  if (req.body.username === undefined) {
    // validation
    res.status(400).send({ content: "Bad Request" });
  } else {
    // proxy request
    getTopAlbums(req.body.username).then((response) => {
      if (response.error) {
        res.status(500).send({ content: response });
      } else {
        res.status(response.status).send({ content: response.content });
      }
    });
  }
});

if (process.env.STATIC_SERVER_ENABLED === "1") {
  app.use(
    express.static(path.join(__dirname, process.env.STATIC_FILE_LOCATION))
  );
  app.get("*", function (req, res) {
    res.sendFile(
      path.join(
        __dirname,
        process.env.STATIC_FILE_LOCATION,
        process.env.STATIC_FILE_INDEX
      )
    );
  });
}

const server = app.listen(getPort(), (error) => {
  /* istanbul ignore next */
  if (error) throw error;
  console.log("Server running on port: " + getPort());
});

module.exports = server;
