import { baseApi } from './baseApi';

export const shiftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: (params) => ({ url: '/shifts', params }),
      providesTags: ['Shifts'],
    }),
    getShiftById: builder.query({
      query: (id) => `/shifts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shifts', id }],
    }),
    getNearbyShifts: builder.query({
      query: ({ lat, lng, radius = 20 }) =>
        `/shifts/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      providesTags: ['Shifts'],
    }),
    createShift: builder.mutation({
      query: (body) => ({ url: '/shifts', method: 'POST', body }),
      invalidatesTags: ['Shifts'],
    }),
    updateShift: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/shifts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Shifts', id }],
    }),
    deleteShift: builder.mutation({
      query: (id) => ({ url: `/shifts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Shifts'],
    }),
    claimShift: builder.mutation({
      query: (id) => ({ url: `/shifts/${id}/claim`, method: 'POST' }),
      invalidatesTags: ['Shifts', 'Bookings'],
    }),
    unclaimShift: builder.mutation({
      query: (id) => ({ url: `/shifts/${id}/unclaim`, method: 'POST' }),
      invalidatesTags: ['Shifts', 'Bookings'],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftByIdQuery,
  useGetNearbyShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useClaimShiftMutation,
  useUnclaimShiftMutation,
} = shiftsApi;
