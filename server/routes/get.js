const router = require("express").Router();
const db = require("../db_get");
router.get("/healthCheck", async (req, res) => {
    try {
        console.log("Refresh");
        res.status(200).send("ok");
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/tags", async (req, res) => {
    try {
        const data = await db.getTags();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/reviewFieldsForEdit", async (req, res) => {
    if (req.user) {
        try {
            const data = await db.getReviewFields(req.query.id);
            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
router.get("/reviewFields", async (req, res) => {
    try {
        const data = await db.getReviewFields(req.query.id);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/userReviews", async (req, res) => {
    if (req.user) {
        try {
            const data = await db.getUserReviews(req.user);
            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
router.get("/lastReviews", async (req, res) => {
    try {
        const data = await db.getLastReviews();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/mostRankedReviews", async (req, res) => {
    try {
        const data = await db.getMostRankedReviews();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/mostLikedReviews", async (req, res) => {
    try {
        const data = await db.getMostLikedReviews();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/reviewLikesInfo", async (req, res) => {
    try {
        const data = await db.getReviewLikesInfo(req.query.id);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/comments", async (req, res) => {
    try {
        const data = await db.getComments(req.query.id);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/searchByTag", async (req, res) => {
    try {
        const result = await db.searchByTag(req.query.tagId);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/searchByString", async (req, res) => {
    try {
        const result = await db.searchByString(req.query.body);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
router.get("/searchAutocomplete", async (req, res) => {
    try {
        const result = await db.searchForAutocomplete(req.query.searchString);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
    }
});
module.exports = router;
