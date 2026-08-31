import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQuery } from "../../../baseQuery/baseQuery";
import type { GithubRepositoriesResponse } from "../types/githubTypes";

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: BaseQuery,
  tagTypes: ["Repositories"],
  endpoints: (builder) => ({
    getGithubRepositories: builder.query<GithubRepositoriesResponse, void>({
      query: () => ({
        url: "/api/github/repositories",
        method: "GET",
      }),
      providesTags: ["Repositories"],
    }),
  }),
});

export const { useGetGithubRepositoriesQuery } = githubApi;
