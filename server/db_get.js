const pool = require("./pool.js");
const getTags = async () => {
    const result = await pool.query(`SELECT id, tag_value FROM tags;`);
    return result.rows;
};
const getReviewLikesInfo = async (id) => {
    const result = await pool.query(
        `SELECT user_id FROM likes WHERE review_id = $1`,
        [id]
    );
    let res = result.rows.map((el) => el.user_id);
    return res;
};
const getUser = async (id) => {
    const result = await pool.query(`SELECT name FROM users WHERE id = $1`, [
        id,
    ]);
    return result.rows[0].name;
};
const getReviewFields = async (id) => {
    const result = await pool.query(
        `	SELECT 
        reviews.id,title,header,rating,image_name,category_id,body,date_create,
        (SELECT COUNT(*) FROM likes WHERE likes.author_id = reviews.user_id) AS author_likes,
        users.name,
        tags.tag_value,
        category.category_value
    FROM 
        reviews
    LEFT JOIN 
        users ON reviews.user_id = users.id
    LEFT JOIN 
        review_tags ON reviews.id = review_tags.review_id
    LEFT JOIN 
        tags ON review_tags.tag_id = tags.id
    LEFT JOIN 
        category ON reviews.category_id = category.id
    WHERE 
        reviews.id = $1`,
        [id]
    );
    let res = result.rows
        .reduce((acc, obj) => {
            let existingObj = acc.find((o) => o.id === obj.id);
            if (existingObj) {
                existingObj.tags.push(obj.tag_value);
            } else {
                acc.push({ ...obj, tags: [obj.tag_value] });
            }
            return acc;
        }, [])
        .map((el) => {
            let { tag_value, ...newEl } = el;
            return newEl;
        });
    return res;
};
const getUserReviews = async ({ id }) => {
    const result = await pool.query(
        `SELECT 
        reviews.id,title,header,rating,user_id,image_name,date_create,
        (SELECT COUNT(*) FROM likes WHERE likes.author_id = reviews.user_id) AS author_likes,
        users.name,
        tags.tag_value,
		category.category_value
    FROM 
        reviews
    LEFT JOIN 
        users ON reviews.user_id = users.id
    LEFT JOIN 
        review_tags ON reviews.id = review_tags.review_id
    LEFT JOIN 
        tags ON review_tags.tag_id = tags.id
	LEFT JOIN 
        category ON reviews.category_id = category.id
    WHERE 
        reviews.user_id = $1`,
        [id]
    );
    let res = result.rows
        .reduce((acc, obj) => {
            let existingObj = acc.find((o) => o.id === obj.id);
            if (existingObj) {
                existingObj.tags.push(obj.tag_value);
            } else {
                acc.push({ ...obj, tags: [obj.tag_value] });
            }
            return acc;
        }, [])
        .map((el) => {
            let { tag_value, ...newEl } = el;
            return newEl;
        });
    return res;
};
const getLastReviews = async () => {
    const result = await pool.query(
        `SELECT 
        reviews.id,title,header,rating,user_id,image_name,date_create,
		(SELECT COUNT(*) FROM likes WHERE likes.author_id = reviews.user_id) AS author_likes,
		users.name,
        tags.tag_value,
		category.category_value
    FROM 
        reviews
	LEFT JOIN 
        users ON reviews.user_id = users.id
    LEFT JOIN 
        review_tags ON reviews.id = review_tags.review_id
    LEFT JOIN 
        tags ON review_tags.tag_id = tags.id
	LEFT JOIN 
        category ON reviews.category_id = category.id
	ORDER BY id DESC
  	LIMIT 30`
    );
    let res = result.rows
        .reduce((acc, obj) => {
            let existingObj = acc.find((o) => o.id === obj.id);
            if (existingObj) {
                existingObj.tags.push(obj.tag_value);
            } else {
                acc.push({ ...obj, tags: [obj.tag_value] });
            }
            return acc;
        }, [])
        .map((el) => {
            let { tag_value, ...clearReview } = el;
            return clearReview;
        });
    return res.sort((a, b) => b.id - a.id).slice(0, 3);
};
const getMostRankedReviews = async () => {
    const result = await pool.query(
        `SELECT 
        reviews.id,title,header,rating,user_id,image_name,date_create,
		(SELECT COUNT(*) FROM likes WHERE likes.author_id = reviews.user_id) AS author_likes,
		users.name,
        tags.tag_value,
		category.category_value
    FROM 
        reviews
	LEFT JOIN 
        users ON reviews.user_id = users.id
    LEFT JOIN 
        review_tags ON reviews.id = review_tags.review_id
    LEFT JOIN 
        tags ON review_tags.tag_id = tags.id
	LEFT JOIN 
        category ON reviews.category_id = category.id
	ORDER BY rating DESC
  	LIMIT 30`
    );
    let res = result.rows
        .reduce((acc, obj) => {
            let existingObj = acc.find((o) => o.id === obj.id);
            if (existingObj) {
                existingObj.tags.push(obj.tag_value);
            } else {
                acc.push({ ...obj, tags: [obj.tag_value] });
            }
            return acc;
        }, [])
        .map((el) => {
            let { tag_value, ...clearReview } = el;
            return clearReview;
        });
    return res.sort((a, b) => b.rating - a.rating).slice(0, 3);
};

const getMostLikedReviews = async () => {
    const result = await pool.query(
        `SELECT 
        reviews.id,title,header,rating,user_id,image_name,date_create,
        (SELECT COUNT(*) FROM likes WHERE likes.review_id = reviews.id) AS likes_count,
		(SELECT COUNT(*) FROM likes WHERE likes.author_id = reviews.user_id) AS author_likes,
		users.name,
        tags.tag_value,
		category.category_value
    FROM 
        reviews
	LEFT JOIN 
        users ON reviews.user_id = users.id
    LEFT JOIN 
        review_tags ON reviews.id = review_tags.review_id
    LEFT JOIN 
        tags ON review_tags.tag_id = tags.id
	LEFT JOIN 
        category ON reviews.category_id = category.id
	ORDER BY likes_count DESC
  	LIMIT 30`
    );
    let res = result.rows
        .reduce((acc, obj) => {
            let existingObj = acc.find((o) => o.id === obj.id);
            if (existingObj) {
                existingObj.tags.push(obj.tag_value);
            } else {
                acc.push({ ...obj, tags: [obj.tag_value] });
            }
            return acc;
        }, [])
        .map((el) => {
            let { tag_value, ...clearReview } = el;
            return clearReview;
        });
    return res.sort((a, b) => b.likes_count - a.likes_count).slice(0, 3);
};
const getComments = async (id) => {
    const result = await pool.query(
        `SELECT comments.body, comments.date_create, comments.id, comments.user_id, users.name 
        FROM comments 
        JOIN users ON comments.user_id = users.id
        WHERE review_id = $1;`,
        [id]
    );
    return result.rows;
};
const searchForAutocomplete = async (searchString) => {
    const resultFromTitle = await pool.query(
        `SELECT title FROM reviews WHERE title ILIKE '%%' || $1 || '%%'`,
        [searchString]
    );
    const resultFromTags = await pool.query(
        `SELECT tag_value FROM tags WHERE tag_value ILIKE '%%' || $1 || '%%'`,
        [searchString]
    );
    const res = resultFromTitle.rows
        .map((obj) => obj.title)
        .concat(resultFromTags.rows.map((obj) => obj.tag_value))
        .sort();
    return res;
};
const searchByTag = async (tagId) => {
    const reviews_id = await pool.query(
        `SELECT review_id FROM review_tags WHERE tag_id = $1`,
        [tagId]
    );
    const clearReviews_id = reviews_id.rows.map((el) => {
        return el.review_id;
    });
    const result = await pool.query(
        `SELECT 
        reviews.id,title,header,rating,user_id,image_name,date_create,
		(SELECT COUNT(*) FROM likes WHERE likes.author_id = reviews.user_id) AS author_likes,
		users.name,
        tags.tag_value,
		category.category_value
    FROM 
        reviews
	LEFT JOIN 
        users ON reviews.user_id = users.id
    LEFT JOIN 
        review_tags ON reviews.id = review_tags.review_id
    LEFT JOIN 
        tags ON review_tags.tag_id = tags.id
	LEFT JOIN 
        category ON reviews.category_id = category.id
	WHERE reviews.id = ANY($1);`,
        [clearReviews_id]
    );
    let res = result.rows
        .reduce((acc, obj) => {
            let existingObj = acc.find((o) => o.id === obj.id);
            if (existingObj) {
                existingObj.tags.push(obj.tag_value);
            } else {
                acc.push({ ...obj, tags: [obj.tag_value] });
            }
            return acc;
        }, [])
        .map((el) => {
            let { tag_value, ...clearReview } = el;
            return clearReview;
        })
        .sort((a, b) => b.title - a.title);
    return res;
};
const searchByString = async (body) => {
    const reviewsIdByString = await pool.query(
        `SELECT id FROM reviews WHERE title ILIKE '%%' || $1 || '%%'`,
        [body]
    );
    const tagIdByBody = await pool.query(
        `SELECT id FROM tags WHERE tag_value ILIKE '%%' || $1 || '%%'`,
        [body]
    );
    const reviewsIdByTags = await pool.query(
        `SELECT review_id FROM review_tags WHERE tag_id = ANY($1)`,
        [tagIdByBody.rows.map((el) => el.id)]
    );
    const resuiltIdClear = reviewsIdByString.rows
        .map((el) => el.id)
        .concat(reviewsIdByTags.rows.map((el) => el.review_id))
        .filter((value, index, self) => self.indexOf(value) === index);
    const result = await pool.query(
        `SELECT 
            reviews.id,title,header,rating,user_id,image_name,date_create,
            (SELECT COUNT(*) FROM likes WHERE likes.author_id = reviews.user_id) AS author_likes,
            users.name,
            tags.tag_value,
            category.category_value
        FROM 
            reviews
        LEFT JOIN 
            users ON reviews.user_id = users.id
        LEFT JOIN 
            review_tags ON reviews.id = review_tags.review_id
        LEFT JOIN 
            tags ON review_tags.tag_id = tags.id
        LEFT JOIN 
            category ON reviews.category_id = category.id
        WHERE reviews.id = ANY($1);`,
        [resuiltIdClear]
    );
    let res = result.rows
        .reduce((acc, obj) => {
            let existingObj = acc.find((o) => o.id === obj.id);
            if (existingObj) {
                existingObj.tags.push(obj.tag_value);
            } else {
                acc.push({ ...obj, tags: [obj.tag_value] });
            }
            return acc;
        }, [])
        .map((el) => {
            let { tag_value, ...clearReview } = el;
            return clearReview;
        })
        .sort((a, b) => b.title - a.title);
    return res;
};
module.exports = {
    getUser,
    getTags,
    getUserReviews,
    getReviewFields,
    getMostRankedReviews,
    getLastReviews,
    getMostLikedReviews,
    getReviewLikesInfo,
    getComments,
    searchByTag,
    searchForAutocomplete,
    searchByString,
};
