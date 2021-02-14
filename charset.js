const iconv = require("iconv-lite");

const win = iconv.encode("фывф123вds", "cp866");
console.log("фывф123вds");
console.log(win.toString());