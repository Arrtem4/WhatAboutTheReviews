const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const db = require("../db_delete");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
router.delete("/review", async (req, res) => {
    if (req.user) {
        try {
            const result = await db.deleteReview(req.query.id);
            if (result) {
                await cloudinary.uploader.destroy(
                    `${result.substring(
                        result.lastIndexOf("/") + 1,
                        result.lastIndexOf(".")
                    )}`
                );
            }
            res.status(200).send("success");
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
router.delete("/imageFromCloud", async (req, res) => {
    if (req.user && req.query.name) {
        try {
            await cloudinary.uploader.destroy(`${req.query.name}`);
            res.status(200);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("delete image error");
    }
});
router.delete("/like", async (req, res) => {
    if (req.user) {
        try {
            await db.deleteLike(req.body);
            res.status(200);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
router.delete("/comment", async (req, res) => {
    if (req.user) {
        try {
            const data = await db.deleteComment(req.query);
            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
module.exports = router;
