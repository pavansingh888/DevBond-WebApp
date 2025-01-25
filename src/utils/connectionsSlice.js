import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    addConnections: (state, action) => action.payload,
    removeConnections: () => null,
  },
});

export const { addConnections, removeConnections,getConnectionDetails } = connectionsSlice.actions;
export default connectionsSlice.reducer;
