import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const getToken = () => localStorage.getItem("authToken");

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    changePassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: { password: newPassword },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});
export const { useLoginMutation, useChangePasswordMutation } = apiSlice;
