const Pool = require("pg").Pool;
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const pool = new Pool({
    connectionString: `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`,
    ssl: {
        rejectUnauthorized: false,
    },
});
module.exports = pool;
