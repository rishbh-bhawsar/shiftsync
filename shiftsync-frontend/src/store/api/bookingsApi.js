import { baseApi } from './baseApi';

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkerBookings: builder.query({
      query: (workerId) => `/bookings/worker/${workerId}`,
      providesTags: ['Bookings'],
    }),
    getFacilityBookings: builder.query({
      query: (facilityId) => `/bookings/facility/${facilityId}`,
      providesTags: ['Bookings'],
    }),
    confirmBooking: builder.mutation({
      query: (id) => ({ url: `/bookings/${id}/confirm`, method: 'PUT' }),
      invalidatesTags: ['Bookings'],
    }),
    rejectBooking: builder.mutation({
      query: (id) => ({ url: `/bookings/${id}/reject`, method: 'PUT' }),
      invalidatesTags: ['Bookings', 'Shifts'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: 'PUT' }),
      invalidatesTags: ['Bookings', 'Shifts'],
    }),
    checkIn: builder.mutation({
      query: (id) => ({ url: `/bookings/${id}/checkin`, method: 'PUT' }),
      invalidatesTags: ['Bookings'],
    }),
    checkOut: builder.mutation({
      query: (id) => ({ url: `/bookings/${id}/checkout`, method: 'PUT' }),
      invalidatesTags: ['Bookings', 'Timesheets'],
    }),
  }),
});

export const {
  useGetWorkerBookingsQuery,
  useGetFacilityBookingsQuery,
  useConfirmBookingMutation,
  useRejectBookingMutation,
  useCancelBookingMutation,
  useCheckInMutation,
  useCheckOutMutation,
} = bookingsApi;
