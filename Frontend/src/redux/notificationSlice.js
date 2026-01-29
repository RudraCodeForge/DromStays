import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUnreadCount } from "../services/Notifications.service";

export const loadUnreadCount = createAsyncThunk(
    "notifications/loadUnreadCount",
    async () => {
        return await fetchUnreadCount();
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        unreadCount: 0,
    },
    reducers: {
        clearUnread(state) {
            state.unreadCount = 0;
        },
        decrementUnread(state) {
            if (state.unreadCount > 0) state.unreadCount -= 1;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadUnreadCount.fulfilled, (state, action) => {
            state.unreadCount = action.payload;
        });
    },
});

export const { clearUnread, decrementUnread } =
    notificationSlice.actions;

export default notificationSlice.reducer;
