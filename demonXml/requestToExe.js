const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function requestToExe(ipKassa, portKassa, file) {
  const { name } = file;

  const res = await execAsync(`cd xml && start /B ../../xmlinterface/XML.exe ${ ipKassa }:${ portKassa } ${ name }`, {
    windowsHide: true
  });
  if (!res || res.stderr) {
    console.log(`error => ${ res.stderr }`);
    return false;
  }

  return true;
}

module.exports = requestToExe;