import apiService from './apiService';

class ContributionService {
  async getContributions(params = {}) {
    try {
      const response = await apiService.get('/admin/contributions', params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContributionById(id) {
    try {
      const response = await apiService.get(`/admin/contributions/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addContribution(contributionData) {
    try {
      const response = await apiService.post('/admin/contributions', contributionData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateContribution(id, contributionData) {
    try {
      const response = await apiService.put(`/admin/contributions/${id}`, contributionData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteContribution(id) {
    try {
      const response = await apiService.delete(`/admin/contributions/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContributionsByMember(memberId, params = {}) {
    try {
      const response = await apiService.get(`/admin/contributions/member/${memberId}`, params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContributionsByYear(year, params = {}) {
    try {
      const response = await apiService.get(`/admin/contributions/year/${year}`, params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContributionsByMonth(year, month, params = {}) {
    try {
      const response = await apiService.get(`/admin/contributions/month/${year}/${month}`, params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContributionStatistics(params = {}) {
    try {
      const response = await apiService.get('/admin/contributions/statistics', params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateReport(params = {}) {
    try {
      const response = await apiService.post('/admin/contributions/report', params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportContributions(format = 'csv', params = {}) {
    try {
      const response = await apiService.get(`/admin/contributions/export/${format}`, params);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkImportContributions(file) {
    try {
      const response = await apiService.upload('/admin/contributions/bulk-import', file);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async validateContributionData(contributionData) {
    const errors = [];

    if (!contributionData.memberId) {
      errors.push('Member ID is required');
    }

    if (!contributionData.month || contributionData.month.length !== 2) {
      errors.push('Month must be a 2-digit number (01-12)');
    }

    if (!contributionData.year || contributionData.year < 2000 || contributionData.year > 2100) {
      errors.push('Year must be between 2000 and 2100');
    }

    if (!contributionData.amount || contributionData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    return errors;
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid contribution data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('Insufficient permissions');
        case 404:
          return new Error('Contribution not found');
        case 409:
          return new Error('Contribution already exists for this period');
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
  formatMonth(month) {
    return month.toString().padStart(2, '0');
  }

  getMonthName(month, language = 'en') {
    const months = {
      en: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      bn: [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ]
    };

    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return months[language]?.[monthIndex] || months.en[monthIndex];
    }
    return month;
  }

  formatCurrency(amount, currency = 'BDT') {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  calculateTotalContributions(contributions) {
    return contributions.reduce((total, contribution) => total + contribution.amount, 0);
  }

  calculateAverageContribution(contributions) {
    if (contributions.length === 0) return 0;
    const total = this.calculateTotalContributions(contributions);
    return total / contributions.length;
  }

  getContributionsByMonth(contributions, year) {
    const monthlyContributions = {};
    
    for (let month = 1; month <= 12; month++) {
      const monthKey = this.formatMonth(month);
      monthlyContributions[monthKey] = contributions.filter(
        c => c.year === year && c.month === monthKey
      );
    }
    
    return monthlyContributions;
  }

  getYearlyContributions(contributions) {
    const yearlyContributions = {};
    
    contributions.forEach(contribution => {
      const year = contribution.year;
      if (!yearlyContributions[year]) {
        yearlyContributions[year] = [];
      }
      yearlyContributions[year].push(contribution);
    });
    
    return yearlyContributions;
  }

  generateContributionId() {
    return `CONTR_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

export const contributionService = new ContributionService();
export default contributionService;