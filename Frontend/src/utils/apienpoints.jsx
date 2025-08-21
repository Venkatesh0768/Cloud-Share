const BASE_URL = "http://localhost:8080/api/v1.0";

export const API_ENDPOINTS = {
  FETCH_FILES: `${BASE_URL}/files/my`,
  TOGGLE_FILES: (id) => `${BASE_URL}/files/${id}/toggle-public`,
  DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
  DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
};
