import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.duckduckgo.com/',
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export const fetchSuggestions = async (query: string, signal: AbortSignal) => {
  try {
    const response = await axiosInstance.get('/', {
      params: {
        q: query,
        format: 'json',
        no_html: 1,
        skip_disambig: 1,
      },
      signal,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSearchResults = async (query: string) => {
  try {
    const response = await axiosInstance.get('/', {
      params: {
        q: query,
        format: 'json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
