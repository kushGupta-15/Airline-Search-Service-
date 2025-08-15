const express = require("express");
const { PORT } = require("./config/serverConfig.js");
// const { CityRepository } = rfequire("./repository/index.js");
// const { City } = require("./models/index.js")
const ApiRoutes = require('./routes/index.js');
const db = require("./models/index.js");
// const sequelize = require("sequelize");

const setupAndStartServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use('/api', ApiRoutes);

  app.listen(PORT, async () => {
    console.log(`Server is running at port ${PORT}`);
    // await City.create({
    //   name: "New Delhi"
    // })

    // const repo = new CityRepository();
    // repo.deleteCity(1); 
    
    // if(process.env.SYNC_DB) {
    //   db.sequelize.sync({alter: true});
    // }
  });
};

setupAndStartServer();