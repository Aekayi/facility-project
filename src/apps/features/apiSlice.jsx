import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://mrbookingv2.innovixdigital.com",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    // changePassword: builder.mutation({
    //   query: ({ id, newPassword }) => ({
    //     url: `users/${id}`,
    //     method: "PUT",
    //     body: { password: newPassword },
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }),
    // }),
    facilities: builder.query({
      query: () => `/api/categories`,
    }),
  }),
});
export const { useLoginMutation, useFacilitiesQuery } = apiSlice;
