const { createXmlRequest } = require("./detail");

async function spend(payload) {
  const { 
    codeClient: code_client, 
    guidOrder: guid_order,
    type
  } = payload;

  if (type === "PAY") await createXmlRequest(guid_order);

  return true;
}

module.exports = {
  spend
};