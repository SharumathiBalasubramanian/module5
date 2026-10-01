import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const placeOrder = createAsyncThunk(
  "orders/place",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/orders",
        orderPayload
      );

      return data.order || data;
    } catch (err) {
      console.error(
        "PLACE ORDER ERROR:",
        err.response?.data || err.message
      );

      return rejectWithValue(
        err.response?.data?.message ||
          "Order placement failed"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/orders/my-orders"
      );

      return data.orders || data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to load orders"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/orders/${orderId}/cancel`
      );

      return data.order || data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  }
);