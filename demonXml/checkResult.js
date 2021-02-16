const axios = require("axios");
const { to } = require("await-to-js");
const { unlink } = require("fs");
const { promisify } = require("util");
const httpError = require("http-errors");

const unlinkAsync = promisify(unlink);

async function checkResult(file, path) {
  const token = process.env.TOKEN;
  const { name, content } = file;
  const { CommandResult } = content.RK7QueryResult;

  if (!CommandResult.Order || CommandResult.ErrorText) return;

  const {
    paid,
    finished,
    orderSum,
    guid,
    persistentComment,
    discountSum
  } = CommandResult.Order._attributes;

  const sum_order = orderSum / 100;
  const commentSplitted = persistentComment.split(" ");
  const code_client = +commentSplitted[commentSplitted.length - 1];
  const guidCorrect = guid.replace(/{|}/g, "");
  const Discounts = CommandResult.Order.Session.Discount;
  if (!Discounts) {
    await removeReq(path, name);
    await removeRes(path, name);
    return;
  }

  let Discount;
  let code, amount;

  console.log("Session =>", CommandResult.Order.Session);
  console.log("Discount =>", Discounts);

  if (Discounts) {
    Discount = Discounts.length 
      ? Discounts[Discounts.length - 1]._attributes
      : Discounts._attributes

    code = Discount.code;
    if (!code) {
      await removeRes(path, name);
      return
    }

    amount = -discountSum / 100;
  } //else amount = -discountSum / 100

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

  await removeReq(path, name);
  await removeRes(path, name);

  console.log(`success => ${ guidCorrect }`);
}

async function removeReq(path, name) {
  await unlinkAsync(`${ path }/${ name.replace("Res", "") }`);
}

async function removeRes(path, name) {
  await unlinkAsync(`${ path }/${ name }`);
}

module.exports = checkResult;