const axios = require("axios");
const { to } = require("await-to-js");
const { unlink } = require("fs");
const { promisify } = require("util");
const httpError = require("http-errors");

const unlinkAsync = promisify(unlink);

async function checkResult(file, path) {
  const token = process.env.TOKEN;
  const { name, content } = file;
  if (!content.RK7QueryResult.CommandResult.Order) return;

  const {
    paid,
    finished,
    orderSum,
    guid,
    persistentComment,
    discountSum
  } = content.RK7QueryResult.CommandResult.Order._attributes;
  const sum_order = orderSum / 100;
  const commentSplitted = persistentComment.split(" ");
  const code_client = +commentSplitted[commentSplitted.length - 1];
  const guidCorrect = guid.replace(/{|}/g, "");
  const Discounts = content.RK7QueryResult.CommandResult.Order.Session.Discount;
  let Discount;
  let code, amount;

  if (Discounts) {
    Discount = Discounts.length 
      ? Discounts[Discounts.length - 1]._attributes
      : Discounts._attributes

    code = Discount.code;
    amount = -Discount.amount / 100;
  } else amount = -discountSum / 100

  if (!+paid || !+finished) return false;

  const body = { 
    company_number: code_client,
    sum_order,
    payed_bonus: amount
  };
  const config = {
    headers: {
      Authorization: token
    } 
  };
  const [err, res] = await to(axios.post("https://dev.ldqr.ru/api/rkeeper/createTransaction", body, config));
  if (err) throw httpError(500, "");

  await unlinkAsync(`${ path }/${ name }`);
  await unlinkAsync(`${ path }/${ name.replace("Res", "") }`);

  console.log(`success => ${ guidCorrect }`);
}

module.exports = checkResult;