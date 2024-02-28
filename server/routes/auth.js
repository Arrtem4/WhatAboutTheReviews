const router = require("express").Router();
const db = require("../db_get");
const passport = require("passport");
require("dotenv").config();
router.get("/login/success", async (req, res) => {
    if (req.user) {
        const result = await db.getUser(req.user.id);
        res.status(200).json({
            id: req.user.id,
            name: result,
            role: req.user.role,
        });
    } else {
        res.send("guest");
    }
});
router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.send("Logout success.");
    });
});
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: process.env.CLIENT_MAIN_PAGE,
        session: true,
    }),
    function (req, res) {
        res.redirect(process.env.CLIENT_MAIN_PAGE);
    }
);
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));
router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: process.env.CLIENT_MAIN_PAGE,
        session: true,
    }),
    function (req, res) {
        res.redirect(process.env.CLIENT_MAIN_PAGE);
    }
);
module.exports = router;
