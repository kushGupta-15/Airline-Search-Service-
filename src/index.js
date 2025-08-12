const express = require("express");
const { PORT } = require("./config/serverConfig.js");
// const { CityRepository } = rfequire("./repository/index.js");
// const { City } = require("./models/index.js")


const setupAndStartServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.listen(PORT, async () => {
    console.log(`Server is running at port ${PORT}`);
    // await City.create({
    //   name: "New Delhi"
    // })

    // const repo = new CityRepository();
    // repo.deleteCity(1);
    
  });
};

setupAndStartServer();