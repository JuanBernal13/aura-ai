import { apiRequest } from "./auth.service";

export const jobService = {
  getPositions: async () => {
    return apiRequest("/jobs/");
  },

  getPosition: async (id: string) => {
    return apiRequest(`/jobs/${id}`);
  },

  createPosition: async (data: any) => {
    return apiRequest("/jobs/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  getRanking: async (id: string) => {
    return apiRequest(`/jobs/${id}/rank`);
  }
};
