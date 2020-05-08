const lastfm = require("../util/lastfm.api");
const axios = require("axios");

jest.mock("../util/lastfm.api");
const originalEnvironment = process.env;

describe("Manage Environment, Static File Serving OFF", () => {
  let server;
  const port = 5002;
  const serverHost = `http://localhost:${port}/`;

  beforeAll(() => {
    process.env.PORT = port;
    process.env.STATIC_SERVER_ENABLED = "0";
    process.env.STATIC_FILE_LOCATION = "test.fixtures";
    process.env.STATIC_FILE_INDEX = "test.html";
    server = require("../server");
  });

  afterAll(function (done) {
    process.env = originalEnvironment;
    server.close(done);
  });

  describe("Given a Valid Static File Request to /lastfm/", () => {
    it("returns a 404 on failure", async (done) => {
      await axios.get(serverHost + "/test.html").catch((err) => {
        expect(err.response.status).toEqual(404);
      });
      done();
    });
  });
});
