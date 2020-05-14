const enforce = require("express-sslify");
const axios = require("axios");

mockCompression = jest.fn();
jest.mock("express-sslify");
jest.mock("compression", () => mockCompression);
const originalEnvironment = process.env;

describe("Manage Environment, Set Production Environment", () => {
  let server;
  const port = 5003;
  const serverHost = `http://localhost:${port}`;
  const lastfmPath = "/lastfm/";

  beforeAll(() => {
    enforce.HTTPS.mockReset();
    mockCompression.mockReset();
    enforce.HTTPS.mockImplementation(() => (req, res, next) => {
      next();
    });
    mockCompression.mockImplementation(() => (req, res, next) => {
      next();
    });
    process.env.PORT = port;
    process.env.NODE_ENV = "production";
    process.env.STATIC_SERVER_ENABLED = "1";
    process.env.STATIC_FILE_LOCATION = "test.fixtures";
    process.env.STATIC_FILE_INDEX = "test.html";
    server = require("../server");
  });

  afterAll(function (done) {
    process.env = originalEnvironment;
    server.close(done);
  });

  it("should load https enforcement on startup", async (done) => {
    expect(enforce.HTTPS.mock.calls.length).toBe(1);
    expect(enforce.HTTPS.mock.calls[0][0]).toEqual({ trustProtoHeader: true });
    expect(mockCompression.mock.calls.length).toBe(1);
    done();
  });
});
