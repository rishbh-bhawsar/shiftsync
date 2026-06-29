import { baseApi } from './baseApi';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformAnalytics: builder.query({
      query: () => '/analytics/platform',
      providesTags: ['Analytics'],
    }),
    getFacilityAnalytics: builder.query({
      query: (id) => `/analytics/facility/${id}`,
      providesTags: ['Analytics'],
    }),
    getWorkerAnalytics: builder.query({
      query: (id) => `/analytics/worker/${id}`,
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetPlatformAnalyticsQuery,
  useGetFacilityAnalyticsQuery,
  useGetWorkerAnalyticsQuery,
} = analyticsApi;
