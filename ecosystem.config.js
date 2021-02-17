module.exports = {
  apps : [{
    name: "rkeeper-module",
    script: "./app.js",
    watch: false,
    instances  : 1,
    exec_mode: "cluster"
  }]
};
