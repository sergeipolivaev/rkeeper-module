const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function sync() {
  const options = { windowsHide: true };
  const res = await execAsync(`git pull`, options);
  if (!res || res.stderr) {
    console.log(`error => ${ res.stderr }`);
    return false;
  }

  if (!res.stdout.includes("Already up to date")) {
    console.log();
    console.log("Update app");
    console.log();
    await execAsync("pm2 start ecosystem.config.js", options);
    await execAsync("pm2 save", options);
    return true;
  }

  return false;
}

module.exports = sync;