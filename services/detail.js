const { writeFile } = require("fs");
const { promisify } = require("util");
const { js2xml } = require("xml-js");

const writeFileAsync = promisify(writeFile);


async function detail(payload) {
  const {
    guidOrder: guid_order,
    type
  } = payload;

  if (type === "ADD") {
    await createXmlRequest(guid_order);
  }

  return true;
}

async function createXmlRequest(guid_order) {
  guid_order = guid_order.replace(/{|}/g, "");
  const startString = `<?xml version="1.0" encoding="utf-8"?>\n`;
  const content = startString + js2xml({
    RK7Query: {
      RK7Command: {
        _attributes: { CMD: "GetOrder" },
        Order: {
          _attributes: { guid: `{${ guid_order }}` }
        }
      }
    }
  }, { compact: true });

  await writeFileAsync(`./xml/${ guid_order }.xml`, content);
}

module.exports = {
  detail,
  createXmlRequest
};