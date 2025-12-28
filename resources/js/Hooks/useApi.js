import { useState, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { handleApiError, handleApiSuccess } from '@/Helpers/CONSTANT.js';

/**
 * Custom hook for making API calls with consistent error handling
 * @returns {Object} - API utilities
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make a GET request
   */
  const get = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (err) {
      setError(err);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Make a POST request
   */
  const post = useCallback(async (url, data = {}, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, data, config);
      handleApiSuccess(response);
      return response.data;
    } catch (err) {
      setError(err);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Make a PUT request
   */
  const put = useCallback(async (url, data = {}, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(url, data, config);
      handleApiSuccess(response);
      return response.data;
    } catch (err) {
      setError(err);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Make a DELETE request
   */
  const del = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(url, config);
      handleApiSuccess(response);
      return response.data;
    } catch (err) {
      setError(err);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload file(s) with progress tracking
   */
  const upload = useCallback(async (url, formData, onProgress = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      });
      handleApiSuccess(response);
      return response.data;
    } catch (err) {
      setError(err);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
    upload,
    clearError,
  };
}

/**
 * Hook for making a single API call with automatic execution
 * @param {Function} apiCall - The API call function
 * @param {Array} deps - Dependencies for re-fetching
 */
export function useApiCall(apiCall, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

export default useApi;
