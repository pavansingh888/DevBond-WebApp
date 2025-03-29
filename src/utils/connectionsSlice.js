import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    addConnections: (state, action) => action.payload,
    addNewConnection: (state,action) => {
     state.push(action.payload)
    },
    removeConnections: () => null,
    removeConnection: (state, action) => {
      return state.filter((connection) => connection._id !== action.payload)
    }
  },
});

export const { addConnections, removeConnections,removeConnection, addNewConnection } = connectionsSlice.actions;
export default connectionsSlice.reducer;
