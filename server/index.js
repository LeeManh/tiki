const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDatabase = require("./db/db.js");
const cloudinary = require("cloudinary").v2;
const productRoute = require("./routes/productRoute.js");
const userRoute = require("./routes/userRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const paymentRoute = require("./routes/paymentRoute.js");
const cartRoute = require("./routes/cartRoutes.js");
const favouriteRoute = require("./routes/favouriteRoutes.js");
const error = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "server/.env",
  });
}

app.use(cors({ credentials: true, origin: true })); //cors
app.use(bodyParser.json({ limit: "50mb" })); //req json
app.use(cookieParser()); //req cookies
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
); // extended: true -> any ,extended -> string || array
app.use(fileUpload());

//connect db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", favouriteRoute);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

app.use(error);

//create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
