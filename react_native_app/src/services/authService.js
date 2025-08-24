import apiService from './apiService';

class AuthService {
  async login(username, password) {
    try {
      const response = await apiService.post('/auth/login', {
        username,
        password,
      });

      // Set token for future requests
      apiService.setToken(response.token);

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      // Clear token
      apiService.clearToken();
      
      // You could also call a logout endpoint if available
      // await apiService.post('/auth/logout');
      
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh');
      apiService.setToken(response.token);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', {
        email,
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProfile() {
    try {
      const response = await apiService.get('/auth/profile');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid request');
        case 401:
          return new Error('Invalid username or password');
        case 403:
          return new Error('Access denied');
        case 404:
          return new Error('User not found');
        case 429:
          return new Error('Too many login attempts');
        case 500:
          return new Error('Server error');
        default:
          return new Error(data.message || 'Login failed');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error('An unexpected error occurred');
    }
  }

  // Utility method to validate credentials
  validateCredentials(username, password) {
    const errors = [];

    if (!username || username.trim().length === 0) {
      errors.push('Username is required');
    }

    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return !!apiService.token;
  }

  // Utility method to get stored token
  async getStoredToken() {
    try {
      // This would typically use secure storage
      // For now, we'll just check the current token
      return apiService.token;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;