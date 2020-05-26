const EventEmitter = require("events");
const http = require("http");

const originalEnvironment = process.env;

describe("Manage Environment, Set Serverless Production Environment", () => {
  let server;

  beforeAll(() => {
    process.env.SERVERLESS = "1";
    process.env.STATIC_SERVER_ENABLED = "";
    server = require("../server");
  });

  afterAll(function (done) {
    process.env = originalEnvironment;
  });

  it("the server should be exported as an express handler", () => {
    expect(server.name).toBe("app");
    expect(server.constructor).toBe(EventEmitter);
    expect(server).not.toBeInstanceOf(http.Server);
  });
});
