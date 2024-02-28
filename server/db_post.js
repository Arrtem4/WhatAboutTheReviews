const pool = require("./pool.js");
const uploadReview = async ({
    date,
    title,
    header,
    rating,
    category,
    review,
    img,
    tags,
    user,
    id,
}) => {
    await pool.query(`DELETE FROM reviews WHERE id = $1;`, [id]);
    const reviewId = await pool.query(
        `INSERT INTO reviews (date_create,title,header,rating,category_id,body,image_name,user_id)
        SELECT $1,$2,$3,$4,$5,$6,$7,$8
        RETURNING id`,
        [date, title, header, rating, category, review, img, user]
    );
    if (tags.length) {
        if (typeof tags === "string") {
            tags = [tags];
        }
        await pool.query(
            `DO $$
            DECLARE 
               tag_name text;
               tag_id integer;
               tags text[] := ARRAY[${tags
                   .map((item) => `'${item}'`)
                   .join(", ")}];
            BEGIN
               FOREACH tag_name IN ARRAY tags
               LOOP
                  SELECT id INTO tag_id FROM tags WHERE tag_value = tag_name;
                  
                  IF tag_id IS NULL THEN
                     INSERT INTO tags (tag_value) VALUES (tag_name);
                  END IF;
               END LOOP; 
            END $$;`
        );
        const tagsIdRow = await pool.query(
            `SELECT id FROM tags WHERE tag_value = ANY($1);`,
            [tags]
        );
        await pool.query(
            ` DO $$
            DECLARE 
               number integer;
               numbers integer[] := ARRAY[${tagsIdRow.rows
                   .map((el) => `${el.id}`)
                   .join(", ")}];
            BEGIN
               FOREACH number IN ARRAY numbers
               LOOP
                  INSERT INTO review_tags (tag_id, review_id) VALUES (number, ${
                      reviewId.rows[0].id
                  });
               END LOOP;
            END $$;`
        );
    }
};

const changeName = async ({ name, id }) => {
    await pool.query(
        `UPDATE users
        SET name = $1
        WHERE id = $2;`,
        [name, id]
    );
};
const like = async ({ userId, reviewId }) => {
    await pool.query(
        `INSERT INTO likes (user_id, review_id, author_id)
      VALUES ($1, $2, (
          SELECT user_id
          FROM reviews
          WHERE id = $2
      ));`,
        [userId, reviewId]
    );
};
const postComment = async ({ dateCreate, author, body, reviewId }) => {
    await pool.query(
        `INSERT INTO comments (user_id, body, date_create, review_id)
        VALUES ($1,$2,$3,$4);`,
        [author, body, dateCreate, reviewId]
    );
    const result = await pool.query(
        `SELECT comments.body, comments.date_create, comments.user_id,comments.id, users.name 
        FROM comments 
        JOIN users ON comments.user_id = users.id
        WHERE review_id = $1;`,
        [reviewId]
    );
    return result.rows;
};
module.exports = { uploadReview, changeName, like, postComment };
