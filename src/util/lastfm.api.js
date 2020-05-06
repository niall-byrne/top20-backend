const axios = require("axios");

const buildUrl = (username, key) => {
  const apiRoot = `https://ws.audioscrobbler.com/2.0/`;
  let queryString = [];
  const options = {
    method: "user.gettopalbums",
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
    const url = buildUrl(username, process.env.LASTFM_KEY);
    const response = await axios.get(url);
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
