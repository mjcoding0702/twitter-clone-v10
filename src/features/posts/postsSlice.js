import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL =
  "https://3630a97b-4f1b-4c30-a6ab-4f683efbdb17-00-1yla15zq0tgjt.kirk.replit.dev";

//Async thunk for fetching a user's posts
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchPostsByUser",
  async (userId) => {
    const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
    return response.json();
  }
);

//Async thunk to save post
export const savePost = createAsyncThunk(
  "posts/savePost",
  async (postContent) => {
    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id;

    const data = {
      title: "Post Title",
      content: postContent,
      user_id: userId,
    };

    const response = await axios.post(`${BASE_URL}/posts`, data);
    return response.data;
  }
);

//Slice
const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
        //action.payload = {id: 20, title: "Post Title", content: "Hello", user_id: 4}
        //state.posts = [{id: 19, title: "Post Titlee", content: "Hellooo", user_id: 4}]
        //state.posts = [{id: 20, title: "Post Title", content: "Hello", user_id: 4}, {id: 19, title: "Post Titlee", content: "Hellooo", user_id: 4}]
      });
  },
});

export default postsSlice.reducer;
