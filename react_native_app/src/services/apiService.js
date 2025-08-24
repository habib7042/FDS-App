import axios from 'axios';
import { Platform } from 'react-native';
import NetInfo from '@react-native-netinfo/netinfo';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.timeout = 30000;
    this.token = null;
    
    this.setupInterceptors();
    this.setupNetworkListener();
  }

  setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        config.timeout = this.timeout;
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ Response ${response.status}:`, response.data);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.handleUnauthorized();
        }
        
        return Promise.reject(error);
      }
    );
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      console.log('🌐 Network Status:', state.isConnected ? 'Connected' : 'Disconnected');
    });
  }

  get axiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `FDS-ReactNative/${Platform.OS}`,
      },
    });
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  setBaseURL(url) {
    this.baseURL = url;
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post(endpoint, data = {}) {
    try {
      const response = await this.axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put(endpoint, data = {}) {
    try {
      const response = await this.axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async upload(endpoint, file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      const response = await this.axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progress) => {
          if (onProgress) {
            const progressPercent = Math.round(
              (progress.loaded * 100) / progress.total
            );
            onProgress(progressPercent);
          }
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async download(endpoint, fileName) {
    try {
      const response = await this.axiosInstance.get(endpoint, {
        responseType: 'blob',
      });

      // Create blob and download logic would go here
      // This would be platform-specific
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Bad Request:', data);
          break;
        case 401:
          console.error('Unauthorized:', data);
          break;
        case 403:
          console.error('Forbidden:', data);
          break;
        case 404:
          console.error('Not Found:', data);
          break;
        case 500:
          console.error('Internal Server Error:', data);
          break;
        default:
          console.error('HTTP Error:', status, data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
  }

  handleUnauthorized() {
    // Clear token and redirect to login
    this.clearToken();
    // This would typically trigger a logout action
    console.log('🔒 Unauthorized access - logging out');
  }

  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response.status === 'ok';
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;