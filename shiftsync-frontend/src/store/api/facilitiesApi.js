import { baseApi } from './baseApi';

export const facilitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFacilities: builder.query({
      query: () => '/facilities',
      providesTags: ['Facilities'],
    }),
    getFacilityById: builder.query({
      query: (id) => `/facilities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Facilities', id }],
    }),
    createFacility: builder.mutation({
      query: (body) => ({ url: '/facilities', method: 'POST', body }),
      invalidatesTags: ['Facilities'],
    }),
    updateFacility: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/facilities/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Facilities'],
    }),
    deleteFacility: builder.mutation({
      query: (id) => ({ url: `/facilities/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Facilities'],
    }),
    getFacilityAnalytics: builder.query({
      query: (id) => `/facilities/${id}/analytics`,
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetFacilitiesQuery,
  useGetFacilityByIdQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useGetFacilityAnalyticsQuery,
} = facilitiesApi;
