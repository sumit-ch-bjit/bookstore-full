import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    userRole: null,
}


const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        addCurrentUser(state, action) {
            console.log(action.payload)
            state.currentUser = action.payload.user
            state.userRole = action.payload.role
        },
        removeCurrentUser(state) {
            state.currentUser = null
            state.userRole = null
        }
    }
})

export const { addCurrentUser, removeCurrentUser } = userSlice.actions

export default userSlice.reducer