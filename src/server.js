const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const { getTopAlbums } = require("./util/lastfm.api");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
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
