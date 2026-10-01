import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "veloce_cart";

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const persist = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const initialState = {
  items: loadCart(), // { productId, name, price, image, quantity, stock }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity = 1, stock = 99 } = action.payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, existing.stock || stock);
      } else {
        state.items.push({ ...action.payload, quantity });
      }
      persist(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock || 99));
      }
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;