import { configureStore } from "@reduxjs/toolkit";
import getTags from "./getTags";
import user from "./user";

export default configureStore({
    reducer: {
        tags: getTags,
        user: user,
    },
});
