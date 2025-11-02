import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name: "story",
    initialState: {
        storyData: [],
    },
    reducers: {
        setStoryData: (state, action) => {
            state.storyData = action.payload
            console.log("Inside reducer - Story data:", action.payload);
        },
    }
})

export const { setStoryData } = storySlice.actions
export default storySlice.reducer