const { getTopAlbums, buildUrl } = require("./lastfm.api");
const axios = require("axios");

jest.mock("axios");
let mockAxiosData = "Good Result";
let mockAxiosStatus = 200;

describe("Manage Environment", () => {
  beforeEach(() => {
    process.env.LASTFM_KEY = "secretkey";
    axios.get.mockReset();
    axios.get.mockImplementation(() =>
      Promise.resolve({
        data: { message: mockAxiosData },
        status: mockAxiosStatus,
      })
    );
  });

  afterEach(() => {
    delete process.env.LASTFM_KEY;
  });

  describe("Check buildUrl", () => {
    it("assembles the url correctly", () => {
      const api = buildUrl("niall-byrne", process.env.LASTFM_KEY);
      expect(api).toBe(
        "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=niall-byrne&api_key=secretkey&format=json"
      );
    });
  });

  describe("Check getTopAlbums api success", () => {
    it("getTopAlbums calls fetch as expected", async () => {
      const result = await getTopAlbums("niall-byrne");
      expect(result.content).toEqual({ message: "Good Result" });
      expect(result.status).toStrictEqual(200);
      expect(axios.get.mock.calls.length).toBe(1);
      expect(axios.get.mock.calls[0]).toEqual([
        "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=niall-byrne&api_key=secretkey&format=json",
      ]);
    });
  });

  describe("Check getTopAlbums api failure unexpected", () => {
    it("getTopAlbums calls fetch as expected", async () => {
      axios.get.mockReset();
      axios.get.mockImplementation(() => {
        throw "Simulated API Failure.";
      });
      const result = await getTopAlbums("niall-byrne");
      const unknownError = { data: { message: "Unknown Error!" } };
      expect(result.data).toStrictEqual(unknownError);
      expect(result.status).toStrictEqual(0);
      expect(axios.get.mock.calls.length).toBe(1);
      expect(axios.get.mock.calls[0]).toEqual([
        "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=niall-byrne&api_key=secretkey&format=json",
      ]);
    });
  });

  describe("Check getTopAlbums api failure forbidden", () => {
    it("getTopAlbums calls fetch as expected", async () => {
      axios.get.mockReset();
      axios.get.mockImplementation(() =>
        Promise.reject({ response: { data: {}, status: 403 } })
      );
      const result = await getTopAlbums("niall-byrne");
      expect(result.data).toStrictEqual({});
      expect(result.status).toStrictEqual(403);
    });
  });
});
