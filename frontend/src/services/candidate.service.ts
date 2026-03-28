import { apiRequest } from "./auth.service";

export const candidateService = {
  getCandidatesByJob: async (jobId: string) => {
    return apiRequest(`/candidates/job/${jobId}`);
  },

  getCandidate: async (id: string) => {
    return apiRequest(`/candidates/${id}`);
  },

  createCandidate: async (jobId: string, email: string, file: File) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    return apiRequest(`/candidates/${jobId}`, {
      method: "POST",
      body: formData,
    });
  }
};
