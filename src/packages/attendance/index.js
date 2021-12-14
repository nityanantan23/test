const axios = require("axios");
const gql = require("graphql-tag");
const baseUrl = "https://attendix.apu.edu.my/graphql";
const apiKey = "da2-dv5bqitepbd2pmbmwt7keykfg4";

const QUERY_ATTEND = `
  mutation updateAttendance($otp: String!) {
    updateAttendance(otp: $otp) {
      id
      attendance
      classcode
      date
      startTime
      endTime
      classType
      __typename
    }
  }
`;

const attend = ({ serviceId, otp }) => {
  console.log(otp);


    return axios
    .post(baseUrl,{
      query: QUERY_ATTEND,
      variables: {
        otp: otp,
    }},
      {
        headers: {
          ticket: serviceId,
          "x-api-key": apiKey,
          "x-requested-with": "my.edu.apiit.apspace",
          "x-amz-user-agent": "aws-amplify/1.0.1",
          "content-type": "application/json",
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => err);
  };

 

module.exports = { attend };
