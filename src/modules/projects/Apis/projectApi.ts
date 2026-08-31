import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQuery } from "../../../baseQuery/baseQuery";
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  ProjectsResponse,
} from "../types/projectTypes";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: BaseQuery,
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => ({
        url: "/api/projects",
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation<CreateProjectResponse, CreateProjectRequest>({
      query: (body) => ({
        url: "/api/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const { useGetProjectsQuery, useCreateProjectMutation } = projectApi;
