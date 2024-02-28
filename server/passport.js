require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const pool = require("./pool.js");
passport.serializeUser((user, done) => {
    return done(null, user);
});
passport.deserializeUser((user, done) => {
    return done(null, user);
});
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        function (_, _, profile, cb) {
            pool.query(
                "SELECT * FROM users WHERE google = $1",
                [profile.id],
                function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    if (result.rows.length > 0) {
                        return cb(null, result.rows[0]);
                    } else {
                        pool.query(
                            "INSERT INTO users(google, name) VALUES($1, $2) RETURNING *",
                            [profile.id, profile.displayName],
                            function (err, result) {
                                if (err) {
                                    return cb(err, null);
                                }
                                return cb(null, result.rows[0]);
                            }
                        );
                    }
                }
            );
        }
    )
);
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/api/auth/github/callback",
        },
        function (_, _, profile, cb) {
            pool.query(
                "SELECT * FROM users WHERE github = $1",
                [profile.id],
                function (err, result) {
                    if (err) {
                        return cb(err, null);
                    }
                    if (result.rows.length > 0) {
                        return cb(null, result.rows[0]);
                    } else {
                        pool.query(
                            "INSERT INTO users(github, name) VALUES($1, $2) RETURNING *",
                            [profile.id, profile.displayName],
                            function (err, result) {
                                if (err) {
                                    return cb(err, null);
                                }
                                return cb(null, result.rows[0]);
                            }
                        );
                    }
                }
            );
        }
    )
);
