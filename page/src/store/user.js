import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instanceBase from "../axios/instanceBase";

export const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
    const res = await instanceBase.get("/get/userReviews");
    return res.data.sort((a, b) => b.date_create - a.date_create);
});

export const editName = createAsyncThunk("user/editName", async (data) => {
    const res = await instanceBase.post("/post/changeName", data);
    return res.data;
});

const user = createSlice({
    name: "user",
    initialState: {
        user: {},
        userAuth: true,
        reviewsLoader: false,
        nameLoader: false,
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            state.userAuth = action.payload.userAuth;
        },
        sortReviews(state, action) {
            let value = action.payload;
            switch (value) {
                case 1:
                    state.user = {
                        ...state.user,
                        reviews: state.user.reviews.sort(
                            (a, b) => b.date_create - a.date_create
                        ),
                    };
                    break;
                case 2:
                    state.user = {
                        ...state.user,
                        reviews: state.user.reviews.sort(
                            (a, b) => a.date_create - b.date_create
                        ),
                    };
                    break;
                case 3:
                    state.user = {
                        ...state.user,
                        reviews: state.user.reviews.sort(
                            (a, b) => b.rating - a.rating
                        ),
                    };
                    break;
                case 4:
                    state.user = {
                        ...state.user,
                        reviews: state.user.reviews.sort(
                            (a, b) => a.rating - b.rating
                        ),
                    };
                    break;
                case 5:
                    state.user = {
                        ...state.user,
                        reviews: state.user.reviews.sort((a, b) =>
                            a.title > b.title ? 1 : -1
                        ),
                    };
                    break;
                case 6:
                    state.user = {
                        ...state.user,
                        reviews: state.user.reviews.sort((a, b) =>
                            a.title < b.title ? 1 : -1
                        ),
                    };
                    break;
            }
        },
        deleteReview(state, action) {
            state.user = {
                ...state.user,
                reviews: state.user.reviews.filter(
                    (el) => el.id !== action.payload
                ),
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfo.pending, (state) => {
                state.reviewsLoader = true;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.user = {
                    ...state.user,
                    likes: Number(
                        action.payload[0]?.author_likes
                            ? action.payload[0].author_likes
                            : 0
                    ),
                    reviews: action.payload,
                };
                state.reviewsLoader = false;
            })
            .addCase(getUserInfo.rejected, (state) => {
                state.reviewsLoader = false;
            })
            .addCase(editName.pending, (state) => {
                state.nameLoader = true;
            })
            .addCase(editName.fulfilled, (state, action) => {
                state.user = {
                    ...state.user,
                    name: action.payload,
                };
                state.nameLoader = false;
            })
            .addCase(editName.rejected, (state) => {
                state.nameLoader = false;
            });
    },
});

export const { setUser, sortReviews, deleteReview } = user.actions;
export default user.reducer;
