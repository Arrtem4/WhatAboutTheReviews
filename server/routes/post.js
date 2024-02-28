const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const db = require("../db_post");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});
const parser = multer({ storage: storage });
router.post("/review", parser.single("image"), async (req, res) => {
    if (req.user) {
        try {
            let data = {
                ...req.body,
                img: req.file ? req.file.path : req.body.img,
                tags: JSON.parse(req.body.tags),
            };
            const response = await db.uploadReview(data);
            res.status(200).send(response);
        } catch (error) {
            console.log(error);
            res.status(500).send(`some error:${error}`);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
router.post("/changeName", async (req, res) => {
    if (req.user) {
        try {
            await db.changeName(req.body);
            res.status(200).send(req.body.name);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
router.post("/like", async (req, res) => {
    if (req.user) {
        try {
            await db.like(req.body);
            res.status(200).send(req.body.name);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
router.post("/comment", async (req, res) => {
    if (req.user) {
        try {
            const result = await db.postComment(req.body);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    } else {
        res.status(500).send("status: guest");
    }
});
module.exports = router;
