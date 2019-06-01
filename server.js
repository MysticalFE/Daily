const express = require("express");
const ip = require("ip");

const app = express();
const IP = ip.address();
const port = 9001;

app.use(express.static(__dirname));
app.listen(port, () => {
  console.info("server start", `${IP}:${port}`);
});
