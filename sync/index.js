const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function sync() {
  const options = { windowsHide: true };
  const res = await execAsync(`git pull`, options);
  if ((!res || res.stderr) && !res.stderr.includes("production -> origin/production")) {
    console.log(`error => ${ res.stderr }`);
    return false;
  }

  if (!res.stdout.includes("Already up to date") && 
      res.stderr.includes("production -> origin/production")
    ) {
    console.log();
    console.log("Update app");
    console.log();
    await execAsync("start /B reload.bat", options);
    return true;
  }

  return false;
}

module.exports = sync;