import { baseApi } from './baseApi';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitReview: builder.mutation({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: ['Reviews'],
    }),
    getWorkerReviews: builder.query({
      query: (workerId) => `/reviews/worker/${workerId}`,
      providesTags: ['Reviews'],
    }),
    getFacilityReviews: builder.query({
      query: (facilityId) => `/reviews/facility/${facilityId}`,
      providesTags: ['Reviews'],
    }),
  }),
});

export const {
  useSubmitReviewMutation,
  useGetWorkerReviewsQuery,
  useGetFacilityReviewsQuery,
} = reviewsApi;
