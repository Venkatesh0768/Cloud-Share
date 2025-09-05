const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export const API_ENDPOINTS = {
  // existing
  FETCH_FILES: `${BASE_URL}/files/my`,
  FETCH_FILES_ID: (id) => `${BASE_URL}/files/public/${id}`,
  GET_CREDITS: `${BASE_URL}/users/credits`,
  GET_PROFILE: `${BASE_URL}/profiles/current`,
  UPLOAD_FILE: `${BASE_URL}/files/upload`,
  TOGGLE_FILES: (id) => `${BASE_URL}/files/${id}/toggle-public`,
  DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
  DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
  SHARE_FILE: (id) => `${FRONTEND_URL}/files/${id}`,
  CREATE_ORDER: `${BASE_URL}/payments/create-order`,
  VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
  FETCH_TRANSACTIONS: `${BASE_URL}/transactions/my`,

  // ADMIN
  ADMIN_USERS: `${BASE_URL}/admin/users`,
  ADMIN_USER: (clerkId) => `${BASE_URL}/admin/users/${clerkId}`,
  ADMIN_USER_ROLE: (clerkId) => `${BASE_URL}/admin/users/${clerkId}/role`,
  ADMIN_DELETE_USER: (clerkId) => `${BASE_URL}/admin/users/${clerkId}`,

  ADMIN_FILES: `${BASE_URL}/admin/files`,
  ADMIN_DELETE_FILE: (fileId) => `${BASE_URL}/admin/files/${fileId}`,
  ADMIN_TOGGLE_FILE: (fileId) => `${BASE_URL}/admin/files/${fileId}/toggle-public`,

  ADMIN_TRANSACTIONS: `${BASE_URL}/admin/transactions`,
  ADMIN_TRANSACTION: (id) => `${BASE_URL}/admin/transactions/${id}`,
  ADMIN_TRANSACTION_STATUS: (id) => `${BASE_URL}/admin/transactions/${id}/status`,
};