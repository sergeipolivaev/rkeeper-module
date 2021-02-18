const axios = require("axios");
const { to } = require("await-to-js");
const httpError = require("http-errors");

async function getClient(payload) {
  const token = process.env.TOKEN;
  const { codeClient: code_client } = payload;

  const body = { company_number: `${ code_client }` };
  const config = {
    headers: {
      Authorization: token
    } 
  };
  const [err, res] = await to(axios.post("https://api.ldqr.ru/api/rkeeper/getClient", body, config));
  if (err) throw httpError(404, "Client not found");

  if (res && res.data) {
    const { first_name, last_name, middle_name, bonus } = res.data.data;
    const fio = `${ first_name ? first_name : "" } ${ last_name ? last_name : "" } ${ middle_name ? middle_name : "" }`;

    return {
      fio: fio,
      countBonus: bonus
    };
  } else throw httpError(404, "Client not found");
}

module.exports = {
  getClient
};
