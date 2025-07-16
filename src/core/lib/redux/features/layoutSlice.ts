import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  isDrawerOpen: boolean;
};

const initialState: InitialState = {
  isDrawerOpen: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    handleToggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
});

export const { handleToggleDrawer } = layoutSlice.actions;
export default layoutSlice.reducer;
