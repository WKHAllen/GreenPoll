const express = require("express");
const enforce = require("express-sslify");
const path = require("path");

const debug = !!parseInt(process.env.DEBUG);
const port = parseInt(process.env.PORT) || 3000;

const app = express();

if (!debug) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(express.static(__dirname + "/dist/greenpoll"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/greenpoll/index.html"));
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
