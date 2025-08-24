import Contribution from './Contribution';

class Member {
  constructor(data = {}) {
    this.id = data.id || '';
    this.accountNumber = data.accountNumber || '';
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.address = data.address || '';
    this.joinDate = data.joinDate || new Date().toISOString();
    this.isActive = data.isActive !== false;
    this.contributions = (data.contributions || []).map(c => new Contribution(c));
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static fromJson(json) {
    return new Member({
      id: json.id || '',
      accountNumber: json.accountNumber || '',
      name: json.name || '',
      phone: json.phone || '',
      email: json.email || '',
      address: json.address || '',
      joinDate: json.joinDate || new Date().toISOString(),
      isActive: json.isActive !== false,
      contributions: (json.contributions || []).map(c => Contribution.fromJson(c)),
      createdAt: json.createdAt || new Date().toISOString(),
      updatedAt: json.updatedAt || new Date().toISOString(),
    });
  }

  toJson() {
    return {
      id: this.id,
      accountNumber: this.accountNumber,
      name: this.name,
      phone: this.phone,
      email: this.email,
      address: this.address,
      joinDate: this.joinDate,
      isActive: this.isActive,
      contributions: this.contributions.map(c => c.toJson()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getInitials() {
    return this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  getDisplayName() {
    return this.name || this.accountNumber;
  }

  getTotalContributions() {
    return this.contributions.reduce((total, contribution) => total + contribution.amount, 0);
  }

  getContributionsCount() {
    return this.contributions.length;
  }

  getContributionsByYear(year) {
    return this.contributions.filter(c => c.year === year);
  }

  getContributionsByMonth(year, month) {
    return this.contributions.filter(c => c.year === year && c.month === month);
  }

  getAvailableYears() {
    const years = this.contributions.map(c => c.year);
    return [...new Set(years)].sort((a, b) => b - a);
  }

  getLatestContribution() {
    if (this.contributions.length === 0) return null;
    return this.contributions.reduce((latest, contribution) => {
      return new Date(contribution.paymentDate) > new Date(latest.paymentDate) 
        ? contribution 
        : latest;
    });
  }

  getYearlyStatistics(year) {
    const yearContributions = this.getContributionsByYear(year);
    const total = yearContributions.reduce((sum, c) => sum + c.amount, 0);
    const count = yearContributions.length;
    const average = count > 0 ? total / count : 0;

    return {
      year,
      totalAmount: total,
      totalCount: count,
      averageAmount: average,
      contributions: yearContributions,
    };
  }

  getMonthlyStatistics(year) {
    const monthlyStats = {};
    
    for (let month = 1; month <= 12; month++) {
      const monthKey = month.toString().padStart(2, '0');
      const monthContributions = this.getContributionsByMonth(year, monthKey);
      const total = monthContributions.reduce((sum, c) => sum + c.amount, 0);
      
      monthlyStats[monthKey] = {
        month: monthKey,
        totalAmount: total,
        count: monthContributions.length,
        contributions: monthContributions,
      };
    }
    
    return monthlyStats;
  }

  hasContributionForMonth(year, month) {
    return this.contributions.some(c => c.year === year && c.month === month);
  }

  getContributionStatus() {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    const hasCurrentMonthContribution = this.hasContributionForMonth(currentYear, currentMonth);
    const latestContribution = this.getLatestContribution();
    
    return {
      isActive: this.isActive,
      hasCurrentMonthContribution,
      latestContributionDate: latestContribution ? latestContribution.paymentDate : null,
      totalContributions: this.getTotalContributions(),
      contributionCount: this.getContributionsCount(),
    };
  }

  isValid() {
    return this.id && this.accountNumber && this.name;
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Member name is required');
    }

    if (!this.accountNumber || this.accountNumber.trim().length === 0) {
      errors.push('Account number is required');
    }

    if (this.phone && !this.validatePhone(this.phone)) {
      errors.push('Invalid phone number format');
    }

    if (this.email && !this.validateEmail(this.email)) {
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

  clone() {
    return new Member(this.toJson());
  }

  update(data) {
    const updatedMember = this.clone();
    Object.assign(updatedMember, data);
    return updatedMember;
  }

  addContribution(contributionData) {
    const contribution = new Contribution(contributionData);
    this.contributions.push(contribution);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  removeContribution(contributionId) {
    this.contributions = this.contributions.filter(c => c.id !== contributionId);
    this.updatedAt = new Date().toISOString();
    return this;
  }
}

export default Member;