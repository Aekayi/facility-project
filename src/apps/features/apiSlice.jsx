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
    changePassword: builder.mutation({
      query: ({ id, newPassword, confirmPassword }) => ({
        url: `/api/change-password/${id}`,
        method: "PUT",
        body: { password: newPassword, confirmPassword },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    facilities: builder.query({
      query: () => `/api/categories`,
    }),
    facilityid: builder.query({
      query: (id) => `/api/facilities/${id}`,
    }),
    meetingrooms: builder.query({
      query: () => `/api/facilityByCat/Meeting Room`,
    }),
    fleet: builder.query({
      query: () => `/api/facilityByCat/Fleet`,
    }),
  }),
});
export const {
  useLoginMutation,
  useFacilitiesQuery,
  useMeetingroomsQuery,
  useFacilityidQuery,
  useFleetQuery,
  useChangePasswordMutation,
} = apiSlice;
