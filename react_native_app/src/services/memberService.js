import apiService from './apiService';

class MemberService {
  async getAllMembers(params = {}) {
    try {
      const response = await apiService.get('/admin/members', params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMemberById(id) {
    try {
      const response = await apiService.get(`/admin/members/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMemberByAccount(accountNumber) {
    try {
      const response = await apiService.get(`/member/${accountNumber}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMember(memberData) {
    try {
      const response = await apiService.post('/admin/members', memberData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMember(id, memberData) {
    try {
      const response = await apiService.put(`/admin/members/${id}`, memberData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMember(id) {
    try {
      const response = await apiService.delete(`/admin/members/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchMembers(query) {
    try {
      const response = await apiService.get('/admin/members/search', { q: query });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMemberStatistics(id) {
    try {
      const response = await apiService.get(`/admin/members/${id}/statistics`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMemberContributions(id, params = {}) {
    try {
      const response = await apiService.get(`/admin/members/${id}/contributions`, params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateMemberStatement(id, params = {}) {
    try {
      const response = await apiService.get(`/admin/members/${id}/statement`, params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportMembers(format = 'csv', params = {}) {
    try {
      const response = await apiService.get(`/admin/members/export/${format}`, params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async validateMemberData(memberData) {
    const errors = [];

    if (!memberData.name || memberData.name.trim().length === 0) {
      errors.push('Member name is required');
    }

    if (memberData.phone && !this.validatePhone(memberData.phone)) {
      errors.push('Invalid phone number format');
    }

    if (memberData.email && !this.validateEmail(memberData.email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }

  validatePhone(phone) {
    // Simple phone validation for Bangladesh numbers
    const phoneRegex = /^(?:\+880|01)[3-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid member data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('Insufficient permissions');
        case 404:
          return new Error('Member not found');
        case 409:
          return new Error('Member already exists');
        case 422:
          return new Error('Validation failed');
        case 500:
          return new Error('Server error');
        default:
          return new Error(data.message || 'Operation failed');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error('An unexpected error occurred');
    }
  }

  // Utility methods
  formatMemberName(name) {
    return name.trim().replace(/\s+/g, ' ');
  }

  formatAccountNumber(accountNumber) {
    return accountNumber.toUpperCase().trim();
  }

  getMemberInitials(name) {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  calculateMemberAge(birthDate) {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}

export const memberService = new MemberService();
export default memberService;