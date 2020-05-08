const express = require("express");
const logger = require("express-requests-logger");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const { getTopAlbums } = require("./util/lastfm.api");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

const server = app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port: " + port);
});

module.exports = server;
