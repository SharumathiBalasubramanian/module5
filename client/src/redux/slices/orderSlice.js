import { createSlice } from "@reduxjs/toolkit";
import {
  placeOrder,
  fetchMyOrders,
  cancelOrder,
} from "../thunks/orderThunks";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =====================================
    // PLACE ORDER
    // =====================================
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;

        // Add newly created order
        if (action.payload) {
          state.orders.unshift(action.payload);
        }
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to place order";
      });

    // =====================================
    // FETCH MY ORDERS
    // =====================================
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;

        console.log(
          "ORDERS RECEIVED IN REDUX:",
          action.payload
        );

        // Backend returns an array
        state.orders = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load orders";
      });

    // =====================================
    // CANCEL ORDER
    // =====================================
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;

        const updatedOrder = action.payload;

        if (updatedOrder?._id) {
          const index = state.orders.findIndex(
            (order) => order._id === updatedOrder._id
          );

          if (index !== -1) {
            state.orders[index] = updatedOrder;
          }
        }
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to cancel order";
      });
  },
});

export const { clearOrders } = orderSlice.actions;

export default orderSlice.reducer;