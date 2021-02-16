const express = require("express");

const { getClient } = require("../services/getClient");
const { detail } = require("../services/detail");
const { spend } = require("../services/spend");
const iconv = require("iconv-lite");

const router = express.Router();

router.post("/getClient", (req, res, next) => {
  getClient(req.body)
    .then(data => {
      const result = JSON.stringify({ ...data });
      
      res.set({ "content-type": "application/json; charset=windows-1251" });
      res.write(iconv.encode(result, "windows1251"));
      res.end();
    })
    .catch(err => next(err));
});

router.post("/detail", (req, res, next) => {
  detail(req.body)
    .then(() => res.status(200).send("200"))
    .catch(err => next(err));
});

router.post("/spend", (req, res, next) => {
  spend(req.body)
    .then(() => res.status(200).send("200"))
    .catch(err => next(err));
});

module.exports = router;