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
    responseHandler: async (response) => {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json(); // Parse JSON if it's JSON
      } else {
        const text = await response.text(); // Otherwise, parse as text
        throw { status: "NON_JSON_RESPONSE", data: text }; // Custom error
      }
    },
  }),
  refetchOnFocus: true,
  tagTypes: ["Booking"],
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
      query: ({ password, current_password }) => ({
        url: `/api/change-password`,
        method: "POST",
        body: { password, current_password },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => {
        return response || { message: "Password changed successfully!" };
      },
    }),

    users: builder.query({
      query: () => `/api/users`,
    }),
    participants: builder.query({
      query: () => `/api/participants`,
    }),

    facilities: builder.query({
      query: () => `/api/categories`,
    }),
    facilityid: builder.query({
      query: (facilityByRoomId) => {
        return `/api/facilities/${facilityByRoomId}`;
      },
    }),
    facilitynames: builder.query({
      query: (facilityName) => `/api/facilityByCat/${facilityName}`,
      invalidatesTags: ["Booking"],
    }),

    getBookedSlots: builder.query({
      query: ({ id }) => `/api/bookingListByFacility/${id}`,
      invalidatesTags: ["Booking"],
    }),
    createBooking: builder.mutation({
      query: (bookingDetails) => ({
        url: `/api/bookRequest`,
        method: "POST",
        body: bookingDetails,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Booking"],
    }),
    getHolidays: builder.query({
      query: () => `/api/holidays`,
    }),
    bookedListByDate: builder.query({
      query: ({ facilityByRoomId, bookedListByDate }) => {
        return `/api/bookingList/${facilityByRoomId}/${bookedListByDate}`;
      },
      providesTags: ["Booking"],
    }),
    fleetBookedListByDate: builder.query({
      query: ({ date }) => {
        return `api/fleetbookingListByDate/${date}`;
      },
      providesTags: ["Booking"],
    }),
    bookedListByUser: builder.query({
      query: ({ userId }) => {
        return `/api/bookingListByUser/${userId}`;
      },
      providesTags: ["Booking"],
    }),
    userbyId: builder.query({
      query: (id) => {
        return `/api/users/${id}`;
      },
    }),
    deleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/api/bookRequest/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
    updateBooking: builder.mutation({
      query: ({ bookingId, data }) => ({
        url: `/api/bookRequest/${bookingId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),
    approvedBooking: builder.mutation({
      query: ({ bookingId, status }) => ({
        url: `/api/bookingStatus/${bookingId}`,
        method: "POST",
        params: { status },
      }),
      invalidatesTags: ["Booking"],
    }),
    bookingDetails: builder.query({
      query: (bookingId) => {
        return `/api/bookRequest/${bookingId}`;
      },
      invalidatesTags: ["Booking"],
    }),
    locations: builder.query({
      query: () => `/api/locations`,
      invalidatesTags: ["Booking"],
    }),
    MapLocations: builder.query({
      query: ({ date }) => {
        return `api/getMapViewBookingListByDate/${date}`;
      },
      providesTags: ["Booking"],
    }),
  }),
});
export const {
  useLoginMutation,
  useUsersQuery,
  useParticipantsQuery,
  useUserbyIdQuery,
  useFacilitiesQuery,
  useFacilitynamesQuery,
  useFacilityidQuery,
  useChangePasswordMutation,
  useGetBookedSlotsQuery,
  useCreateBookingMutation,
  useGetHolidaysQuery,
  useBookedListByDateQuery,
  useFleetBookedListByDateQuery,
  useBookedListByUserQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
  useApprovedBookingMutation,
  useBookingDetailsQuery,
  useLocationsQuery,
  useMapLocationsQuery,
} = apiSlice;
