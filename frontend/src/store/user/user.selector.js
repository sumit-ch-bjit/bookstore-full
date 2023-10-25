export const selectCurrentUser = (state) => state.user.currentUser;

export const selectCurrentUserId = state => {
    if (state.user.currentUser !== null) {
        return state.user.currentUser.user._id;
    }
}

export const selectCurrentUserRole = (state) => {
    if (state.user.currentUser !== null) {
        return state.user.currentUser.role
    }
}