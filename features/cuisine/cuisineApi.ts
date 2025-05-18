// cuisineApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cuisineApi = createApi({
  reducerPath: "cuisineApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://stage-api.qrkey.in/api/entity",
    prepareHeaders: (headers) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      console.log(" Using token in header:", token);
    } else {
      console.warn(" No token in localStorage");
    }
  } else {
    console.warn(" Cannot access localStorage during SSR");
  }

  headers.set("Content-Type", "application/json");
  return headers;
},
  }),
  endpoints: (builder) => ({
    getCuisineList: builder.mutation({
      query: ({ entityId, isBar }) => ({
        url: "cuisine/list",
        method: "POST",
        body: { entityId, isBar },
      }),
    }),
  }),
});

export const { useGetCuisineListMutation } = cuisineApi;
