const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Get Mongo config
const db = require("./config/keys").mongoURI;
const user = require("./routes/api/user");
const spotify_auth = require("./routes/auth/spotify");

// Init express router
const app = express();

// Body parser middleware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cookie parsers to validate spotify redirect.
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route.
app.get("/", (req, res) => res.send("Hello?!"));

// Set express to use the routes
app.use("/api/user", user);
app.use("/auth/spotify", spotify_auth);

const port = process.env.PORT || 5000;

// Set express to listen on port
app.listen(port, () => console.log(`Sever running on port ${port}`));
