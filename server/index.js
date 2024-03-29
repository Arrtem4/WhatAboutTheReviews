const express = require("express");
const session = require("express-session");
const cors = require("cors");
const axios = require("axios");
const passport = require("passport");
require("dotenv").config();
require("./passport");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const getRoute = require("./routes/get");
const deleteRoute = require("./routes/delete");
const path = require("path");
const booksData = require("./data/books.json");
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: process.env.CORS_CREDENTIALS,
    })
);
app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.COOKIE_SESSION_KEY,
        resave: process.env.COOKIE_SESSION_RESAVE,
        saveUninitialized: process.env.COOKIE_SESSION_SAVE_UNINITIALIZED,
        cookie: {
            sameSite: process.env.COOKIE_SESSION_SAME_SITE,
            secure: true,
            maxAge: 1000 * 60 * 60 * 12,
        },
    })
);
app.use(express.static(path.join(__dirname, "static")));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/get", getRoute);
app.use("/api/delete", deleteRoute);
app.get("/api/previewImage", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "preview.jpg"));
});
app.get("/api/random-book", (req, res) => {
    const randomIndex = Math.floor(Math.random() * booksData.length);
    const randomBook = booksData[randomIndex];
    res.json(randomBook);
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});
setInterval(async () => {
    try {
        await axios.get(
            "https://whatwiththereviews.onrender.com/api/get/healthCheck"
        );
    } catch (error) {
        console.error(error);
    }
}, 1000 * 60 * 14);
app.listen(3001, () => {
    console.log(`App running`);
});
