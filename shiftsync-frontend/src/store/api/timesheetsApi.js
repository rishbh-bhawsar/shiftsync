import { baseApi } from './baseApi';

export const timesheetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkerTimesheets: builder.query({
      query: (workerId) => `/timesheets/worker/${workerId}`,
      providesTags: ['Timesheets'],
    }),
    getTimesheetById: builder.query({
      query: (id) => `/timesheets/${id}`,
      providesTags: ['Timesheets'],
    }),
    generateTimesheet: builder.mutation({
      query: (workerId) => ({
        url: `/timesheets/generate/${workerId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Timesheets'],
    }),
    approveTimesheet: builder.mutation({
      query: (id) => ({ url: `/timesheets/${id}/approve`, method: 'PUT' }),
      invalidatesTags: ['Timesheets'],
    }),
    disputeTimesheet: builder.mutation({
      query: (id) => ({ url: `/timesheets/${id}/dispute`, method: 'PUT' }),
      invalidatesTags: ['Timesheets'],
    }),
  }),
});

export const {
  useGetWorkerTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useGenerateTimesheetMutation,
  useApproveTimesheetMutation,
  useDisputeTimesheetMutation,
} = timesheetsApi;
