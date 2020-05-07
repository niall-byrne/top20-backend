const axios = require("axios");

const buildUrl = (username, key, method) => {
  const apiRoot = `https://ws.audioscrobbler.com/2.0/`;
  let queryString = [];
  const options = {
    method,
    user: username,
    api_key: key,
    format: "json",
  };
  Object.entries(options).forEach(([key, value]) => {
    return queryString.push(`${key}=${value}`);
  });
  const url = `${apiRoot}?${queryString.join("&")}`;
  return url;
};

const getTopAlbums = async (username) => {
  try {
    const url1 = buildUrl(
      username,
      process.env.LASTFM_KEY,
      "user.gettopalbums"
    );
    const url2 = buildUrl(username, process.env.LASTFM_KEY, "user.getInfo");
    const response = await axios.get(url1);
    const response2 = await axios.get(url2);

    // Append the image to the response
    const image = response2.data.user.image[1]["#text"];
    response.data.image = image;

    return { content: response.data, status: response.status };
  } catch (err) {
    if (err.response) {
      return err.response;
    }
    return {
      data: { data: { message: "Unknown Error!" } },
      status: 0,
    };
  }
};

exports.buildUrl = buildUrl;
exports.getTopAlbums = getTopAlbums;
