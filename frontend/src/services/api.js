const API_BASE_URL = "http://localhost:5000/api";

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Books API
export const booksAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/books${queryString ? `?${queryString}` : ""}`);
  },
  getById: (id) => apiCall(`/books/${id}`),
  create: (bookData) =>
    apiCall("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    }),
  update: (id, bookData) =>
    apiCall(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    }),
  delete: (id) =>
    apiCall(`/books/${id}`, {
      method: "DELETE",
    }),
  getCategories: () => apiCall("/books/categories"),
};

// Members API
export const membersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/members${queryString ? `?${queryString}` : ""}`);
  },
  getById: (id) => apiCall(`/members/${id}`),
  create: (memberData) =>
    apiCall("/members", {
      method: "POST",
      body: JSON.stringify(memberData),
    }),
  update: (id, memberData) =>
    apiCall(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(memberData),
    }),
  delete: (id) =>
    apiCall(`/members/${id}`, {
      method: "DELETE",
    }),
};

// Issues API
export const issuesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/issues${queryString ? `?${queryString}` : ""}`);
  },
  getById: (id) => apiCall(`/issues/${id}`),
  issueBook: (issueData) =>
    apiCall("/issues", {
      method: "POST",
      body: JSON.stringify(issueData),
    }),
  returnBook: (id) =>
    apiCall(`/issues/${id}/return`, {
      method: "PUT",
    }),
  update: (id, issueData) =>
    apiCall(`/issues/${id}`, {
      method: "PUT",
      body: JSON.stringify(issueData),
    }),
  delete: (id) =>
    apiCall(`/issues/${id}`, {
      method: "DELETE",
    }),
  getDashboardStats: () => apiCall("/issues/stats/dashboard"),
};