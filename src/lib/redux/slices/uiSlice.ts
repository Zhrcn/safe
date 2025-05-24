import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

interface UIState {
    sidebarOpen: boolean;
    notifications: Notification[];
    loading: {
        [key: string]: boolean;
    };
    theme: 'light' | 'dark';
}

const initialState: UIState = {
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
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
            const id = Date.now().toString();
            state.notifications.push({ ...action.payload, id });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        setLoading: (
            state,
            action: PayloadAction<{ key: string; value: boolean }>
        ) => {
            const { key, value } = action.payload;
            state.loading[key] = value;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
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