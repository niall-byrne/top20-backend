const lastfm = require("./util/lastfm.api");
const axios = require("axios");

jest.mock("./util/lastfm.api");
const serverHost = "http://localhost:5000/";
const lastfmPath = "lastfm/";

describe("Manage Environment", () => {
  let server;

  beforeAll(() => {
    server = require("./server");
  });

  afterAll(function (done) {
    server.close(done);
  });

  describe("Given Invalid Data", () => {
    it("returns a 400 error", async (done) => {
      await axios.post(serverHost + lastfmPath, {}).catch((err) => {
        expect(err.response.data).toEqual({ content: "Bad Request" });
        expect(err.response.status).toEqual(400);
      });
      done();
    });
  });

  describe("Given a Valid Request", () => {
    beforeEach(() => {
      lastfm.getTopAlbums.mockReset();
      lastfm.getTopAlbums.mockImplementation(() =>
        Promise.resolve({
          content: { message: "Some Listening Data." },
          status: 200,
        })
      );
    });
    it("returns a 200 on success", async (done) => {
      await axios
        .post(serverHost + lastfmPath, { username: "someguy" })
        .then((response) => {
          expect(response.data).toEqual({
            content: { message: "Some Listening Data." },
          });
          expect(response.status).toEqual(200);
        });
      done();
    });
  });

  describe("Given a an unknown but valid request", () => {
    beforeEach(() => {
      lastfm.getTopAlbums.mockReset();
      lastfm.getTopAlbums.mockImplementation(() =>
        Promise.resolve({
          message: "Not found.",
          status: 404,
        })
      );
    });
    it("returns a 404 on notfound", async (done) => {
      await axios
        .post(serverHost + lastfmPath, { username: "unknownguy" })
        .catch((err) => {
          expect(err.response.data).toEqual({});
          expect(err.response.status).toEqual(404);
        });
      done();
    });
  });

  describe("Given a Server Error", () => {
    beforeEach(() => {
      lastfm.getTopAlbums.mockReset();
      lastfm.getTopAlbums.mockImplementation(() =>
        Promise.resolve({
          message: "Some Listening Data.",
          status: 500,
          error: true,
        })
      );
    });
    it("returns a 500 on error", async (done) => {
      await axios
        .post(serverHost + lastfmPath, { username: "someguy" })
        .catch((err) => {
          expect(err.response.data.content.message).toEqual(
            "Some Listening Data."
          );
          expect(err.response.data.content.status).toEqual(500);
          expect(err.response.status).toEqual(500);
        });
      done();
    });
  });
});
