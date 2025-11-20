import { ApiResponse, LoginCredentials, Candidate, CandidatesResponse, CandidateResponse, Education, WorkExperience } from '../types';

const API_BASE_URL = 'http://localhost:3010/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers
  });
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data;
};

export const api = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string }>> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await handleResponse<{ token: string }>(response);
    
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }

    return data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
      method: 'POST'
    });

    removeAuthToken();
    return handleResponse<void>(response);
  },

  getCandidates: async (page: number = 1, limit: number = 10): Promise<ApiResponse<CandidatesResponse>> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/candidates?page=${page}&limit=${limit}`);
    return handleResponse<CandidatesResponse>(response);
  },

  getCandidate: async (id: number): Promise<ApiResponse<CandidateResponse>> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/candidates/${id}`);
    return handleResponse<CandidateResponse>(response);
  },

  createCandidate: async (candidateData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education?: Education[];
    workExperience?: WorkExperience[];
  }): Promise<ApiResponse<CandidateResponse>> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      body: JSON.stringify(candidateData)
    });
    return handleResponse<CandidateResponse>(response);
  },

  updateCandidate: async (id: number, candidateData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education?: Education[];
    workExperience?: WorkExperience[];
  }>): Promise<ApiResponse<CandidateResponse>> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(candidateData)
    });
    return handleResponse<CandidateResponse>(response);
  },

  deleteCandidate: async (id: number): Promise<ApiResponse<void>> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/candidates/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  },

  uploadCV: async (candidateId: number, file: File): Promise<ApiResponse<{ cvFileName: string; cvFilePath: string; cvMimeType: string }>> => {
    const formData = new FormData();
    formData.append('cv', file);

    const token = getAuthToken();
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/cv`, {
      method: 'POST',
      headers,
      body: formData
    });

    return handleResponse<{ cvFileName: string; cvFilePath: string; cvMimeType: string }>(response);
  },

  downloadCV: async (candidateId: number): Promise<Blob> => {
    const token = getAuthToken();
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/cv`, {
      headers
    });

    if (!response.ok) {
      throw new Error('Error al descargar el CV');
    }

    return response.blob();
  }
};

