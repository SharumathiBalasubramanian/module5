import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, fetchProductById, fetchCategories, fetchRecommendations } from "../thunks/productThunks";

const initialState = {
  items: [],
  total: 0,
  pages: 1,
  page: 1,
  categories: [],
  filters: { keyword: "", category: "", minPrice: "", maxPrice: "", sort: "newest" },
  selectedProduct: null,
  recommendations: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.recommendations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Catalog
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.total = action.payload.total || action.payload.products?.length || 0;
        state.pages = action.payload.pages || 1;
        state.page = action.payload.page || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Single Product Lookup
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Categories & Recommendations
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload || [];
      });
  },
});

export const { setFilters, resetFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;