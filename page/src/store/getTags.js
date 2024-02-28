import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instanceBase from "../axios/instanceBase";

export const getTags = createAsyncThunk("tags/getTags", async () => {
    const response = await instanceBase.get("/get/tags");
    return response.data;
});

const tagsSlice = createSlice({
    name: "tags",
    initialState: {
        tags: [],
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTags.fulfilled, (state, action) => {
                state.tags = action.payload.map((tag) => ({
                    value: tag.tag_value,
                    count: tag.id,
                }));
            })
            .addCase(getTags.rejected, (state) => {
                state.tags = [];
            });
    },
});

export default tagsSlice.reducer;
