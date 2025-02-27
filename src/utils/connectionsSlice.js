import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    addConnections: (state, action) => action.payload,
    removeConnections: () => null,
    removeConnection: (state, action) => {
      return state.filter((connection) => connection._id !== action.payload)
    }
  },
});

export const { addConnections, removeConnections,removeConnection } = connectionsSlice.actions;
export default connectionsSlice.reducer;
