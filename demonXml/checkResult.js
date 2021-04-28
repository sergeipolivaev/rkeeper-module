const axios = require("axios");
const { to } = require("await-to-js");
const { unlink } = require("fs");
const { promisify } = require("util");
const httpError = require("http-errors");

const unlinkAsync = promisify(unlink);

async function checkResult(file, path, discountId, discountIdPay) {
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

  const commentSplitted = persistentComment.split(" ");
  const code_client = +commentSplitted[commentSplitted.length - 1];
  const guidCorrect = guid.replace(/{|}/g, "");
  const Session = CommandResult.Order.Session;
  let Discount = [];
  let amount = -discountSum / 100;

  if (!Session) {
    await removeRes(path, name);
    await removeReq(path, name);
    return;
  }

  if (Array.isArray(Session)) {
    Session.forEach(item => {
      if (Array.isArray(item.Discount)) {
        Discount = Discount.concat(item.Discount);
      } else {
        Discount.push(item.Discount);
      }
    });
  } else {
    if (Array.isArray(Session.Discount)) {
      Discount = Discount.concat(Session.Discount);
    } else {
      Discount.push(Session.Discount);
    }
  }

  if (!Discount.length) {
    await removeRes(path, name);
    await removeReq(path, name);
    return;
  }

  Discount = Discount.filter(item => 
    item && 
    !+item._attributes.deleted && 
    (item._attributes.code == discountId || 
      item._attributes.code == discountIdPay)
  )

  if (!Discount || !Discount.length) {
    await removeRes(path, name);
    await removeReq(path, name);
    return;
  }

  Discount = Discount.map(item => item._attributes);
  Discount = Discount[Discount.length - 1];

  const code = Discount.code;
  if (!code) {
    await removeRes(path, name);
    return
  }

  if (!+paid || !+finished) return false;

  const body = { 
    company_number: code_client,
    sum_order: orderSum / 100 + amount,
    payed_bonus: amount
  };
  const config = {
    headers: {
      Authorization: token
    } 
  };
  const [err, res] = await to(axios.post("https://api.ldqr.ru/api/rkeeper/createTransaction", body, config));
  if (err) throw httpError(500, "");
  console.log(`Transaction to Backend`, err, res ? res.data : {});

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
