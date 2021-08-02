import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./Slices/userSlice";
import newSubmissionSlice from './Slices/newSubmissionSlice'
export const store = configureStore({
    reducer: {
        newSubmission: newSubmissionSlice,
        user: userSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
