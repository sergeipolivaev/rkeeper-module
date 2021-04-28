module.exports = {
  apps : [{
    name: "rkeeper-module",
    script: "./app.js",
    watch: false,
    instances: 1,
    exec_mode: "cluster",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true
  }]
};
