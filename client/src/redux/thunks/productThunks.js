import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { mockProducts } from "../../assets/mockProducts";

function filterMockProducts(params) {
  let filtered = [...mockProducts];

  if (params.category) {
    filtered = filtered.filter(
      (p) => p.category?.toLowerCase() === params.category.toLowerCase()
    );
  }
  if (params.keyword) {
    filtered = filtered.filter((p) =>
      p.name?.toLowerCase().includes(params.keyword.toLowerCase())
    );
  }
  if (params.minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(params.maxPrice));
  }

  if (params.sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params.sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (params.sort === "rating") {
    filtered.sort((a, b) => (b.ratings || b.rating || 0) - (a.ratings || a.rating || 0));
  } else if (params.sort === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return {
    products: filtered,
    total: filtered.length,
    pages: 1,
    page: 1,
  };
}

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products", { params });
      if (data && data.products && data.products.length > 0) return data;
      return filterMockProducts(params);
    } catch {
      return filterMockProducts(params);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      return data.product || data;
    } catch (err) {
      const mock = mockProducts.find((p) => p.id === id || p._id === id);
      if (mock) return mock;
      return rejectWithValue(err.response?.data?.message || "Product not found");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products/categories");
      if (data && data.categories && data.categories.length > 0) {
        return data.categories;
      }
      return Array.from(new Set(mockProducts.map((p) => p.category).filter(Boolean)));
    } catch {
      return Array.from(new Set(mockProducts.map((p) => p.category).filter(Boolean)));
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  "products/fetchRecommendations",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/analytics/recommendations/${productId}`);
      return data.recommendations || [];
    } catch {
      return mockProducts.filter((p) => (p._id || p.id) !== productId).slice(0, 6);
    }
  }
);