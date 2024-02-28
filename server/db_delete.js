const pool = require("./pool.js");
const deleteReview = async (id) => {
    const res = await pool.query(
        `DELETE FROM reviews WHERE id = $1
        RETURNING image_name`,
        [id]
    );
    return res.rows[0].image_name;
};
const deleteLike = async ({ userId, reviewId }) => {
    await pool.query(
        `DELETE FROM likes WHERE user_id = $1 AND review_id = $2;`,
        [userId, reviewId]
    );
};
const deleteComment = async ({ commentId, reviewId }) => {
    await pool.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
    const result = await pool.query(
        `SELECT comments.body, comments.date_create, comments.id, comments.user_id, users.name 
        FROM comments 
        JOIN users ON comments.user_id = users.id
        WHERE review_id = $1;`,
        [reviewId]
    );
    return result.rows;
};
module.exports = { deleteReview, deleteLike, deleteComment };
