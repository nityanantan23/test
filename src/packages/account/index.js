const axios = require("axios");
const qs = require("qs");

const baseUrl = "https://cas.apiit.edu.my/cas/v1/tickets";

const tgt = ({ username, password }) => {
  console.log(username);
  console.log(password);

  const body = `username=${username}&password=${password}`;
  return axios
    .post(baseUrl, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*"
      }
    })
    .then(res => res.data)
    .catch(err => err.response.data);
};

const st = tgt => {
  return axios
    .post(
      `${baseUrl}/${tgt}?service=https://api.apiit.edu.my/attendix`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json, text/plain, */*"
        }
      }
    )
    .then(res => res.data)
    .catch(err => err.response.data);
};

module.exports = { tgt, st };
