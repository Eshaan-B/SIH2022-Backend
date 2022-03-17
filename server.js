const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/trackers", require("./routes/trackerRoutes"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
