const express = require("express");
const { PORT } = require("./config/serverConfig.js");

const setupAndStartServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
};

setupAndStartServer();