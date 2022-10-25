const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`connect mongoodb success`);
    })
    .catch((error) => console.log({ error }));
};

module.exports = connectDatabase;
