const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
