const BASE_URL = "http://localhost:8080/api/v1.0";

export const API_ENDPOINTS = {
  FETCH_FILES: `${BASE_URL}/files/my`,
  FETCH_FILES_ID:(id) => `${BASE_URL}/files/public/${id}`,
  GET_CREDITS: `${BASE_URL}/users/credits`,
  UPLOAD_FILE: `${BASE_URL}/files/upload`,
  TOGGLE_FILES: (id) => `${BASE_URL}/files/${id}/toggle-public`,
  DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
  DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
  SHARE_FILE: (id) => `http://localhost:5173/files/${id}`,
};
