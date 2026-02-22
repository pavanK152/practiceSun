const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;

dotenv.config();
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDb connected successfully"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`server started and running at  ${PORT}`);
});
