import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sidebarOpen: true,
    notifications: [],
    loading: {},
    theme: 'light',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        addNotification: (state, action) => {
            const id = Date.now().toString();
            state.notifications.push({ ...action.payload, id });
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        setLoading: (state, action) => {
            const { key, value } = action.payload;
            state.loading[key] = value;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    addNotification,
    removeNotification,
    setLoading,
    setTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 