"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://stage-api.qrkey.in/api/entity",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("jwt");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // ✅ use expected header or param
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProductList: builder.mutation<
      { data: any[] },
      { entityId: string; isBar: boolean }
    >({
      query: ({ entityId, isBar }) => ({
        url: `product/list`,
        method: "POST",
        body: { entityId, isBar },
      }),
    }),
  }),
});

export const { useGetProductListMutation } = productApi;
