const { getPort } = require("../util");
const originalEnvironment = process.env;

describe("Manage Environment", () => {
  beforeAll(() => {});

  afterAll(function (done) {
    process.env = originalEnvironment;
  });

  it("The getPort should default to 5000", () => {
    delete process.env.PORT;
    expect(getPort()).toBe(5000);
  });

  it("Otherwise getPort returns the value of the environment variable PORT", () => {
    process.env.PORT = 9000;
    expect(getPort()).toBe(process.env.PORT);
  });
});
