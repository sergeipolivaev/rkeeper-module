const { xml2js } = require("xml-js");
const { readFile, readdir } = require("fs");
const { promisify } = require("util");

const requestToExe = require("./requestToExe");
const checkResult = require("./checkResult");

const readFileAsync = promisify(readFile);
const readDirAsync = promisify(readdir);

async function demon(path = "./", ipKassa, portKassa) {
  let filesInDir = await readDirAsync(path);
  const filesXml = filesInDir.filter(filename => /^(?!.*Res).*.xml/g.test(filename));

  for (const fileXml of filesXml) {
    const file = await readFileAsync(`${ path }/${ fileXml }`, "utf8");
    const fileObject = {
      name: fileXml,
      content: xml2js(file, { compact: true })
    };

    await requestToExe(ipKassa, portKassa, fileObject);
  }

  filesInDir = await readDirAsync(path);
  const filesXmlRes = filesInDir.filter(filename => /Res.*.xml/g.test(filename));

  for (const fileXmlRes of filesXmlRes) {
    const file = await readFileAsync(`${ path }/${ fileXmlRes }`, "utf8");
    const fileObject = {
      name: fileXmlRes,
      content: xml2js(file, { compact: true })
    };
    
    await checkResult(fileObject, path);
  }

  setTimeout(demon.bind(this, path, ipKassa, portKassa), 10000);
}

function start(path, ipKassa, portKassa) {
  setTimeout(demon.bind(this, path, ipKassa, portKassa), 10000);
}

module.exports = { 
  start 
};
