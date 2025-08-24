class Contribution {
  constructor(data = {}) {
    this.id = data.id || '';
    this.memberId = data.memberId || '';
    this.month = data.month || '';
    this.year = data.year || new Date().getFullYear();
    this.amount = data.amount || 0;
    this.paymentDate = data.paymentDate || new Date().toISOString();
    this.description = data.description || '';
    this.status = data.status || 'completed';
    this.paymentMethod = data.paymentMethod || 'cash';
    this.receiptNumber = data.receiptNumber || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static fromJson(json) {
    return new Contribution({
      id: json.id || '',
      memberId: json.memberId || '',
      month: json.month || '',
      year: json.year || new Date().getFullYear(),
      amount: json.amount || 0,
      paymentDate: json.paymentDate || new Date().toISOString(),
      description: json.description || '',
      status: json.status || 'completed',
      paymentMethod: json.paymentMethod || 'cash',
      receiptNumber: json.receiptNumber || '',
      createdAt: json.createdAt || new Date().toISOString(),
      updatedAt: json.updatedAt || new Date().toISOString(),
    });
  }

  toJson() {
    return {
      id: this.id,
      memberId: this.memberId,
      month: this.month,
      year: this.year,
      amount: this.amount,
      paymentDate: this.paymentDate,
      description: this.description,
      status: this.status,
      paymentMethod: this.paymentMethod,
      receiptNumber: this.receiptNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getMonthName(language = 'en') {
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

    const monthIndex = parseInt(this.month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return months[language]?.[monthIndex] || months.en[monthIndex];
    }
    return this.month;
  }

  getFormattedAmount(currency = 'BDT') {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.amount);
  }

  getFormattedDate() {
    const date = new Date(this.paymentDate);
    return date.toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getPeriod() {
    return `${this.getMonthName()} ${this.year}`;
  }

  getPaymentMethodLabel() {
    const methods = {
      cash: 'Cash',
      bank: 'Bank Transfer',
      mobile: 'Mobile Banking',
      check: 'Check',
      other: 'Other',
    };
    return methods[this.paymentMethod] || this.paymentMethod;
  }

  getStatusLabel() {
    const statuses = {
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    };
    return statuses[this.status] || this.status;
  }

  isCurrentMonth() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    
    return this.year === currentYear && this.month === currentMonth;
  }

  isCurrentYear() {
    const currentYear = new Date().getFullYear();
    return this.year === currentYear;
  }

  getDaysSincePayment() {
    const paymentDate = new Date(this.paymentDate);
    const now = new Date();
    const diffTime = Math.abs(now - paymentDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isValid() {
    return this.id && this.memberId && this.month && this.year && this.amount > 0;
  }

  validate() {
    const errors = [];

    if (!this.memberId) {
      errors.push('Member ID is required');
    }

    if (!this.month || this.month.length !== 2) {
      errors.push('Month must be a 2-digit number (01-12)');
    }

    if (!this.year || this.year < 2000 || this.year > 2100) {
      errors.push('Year must be between 2000 and 2100');
    }

    if (!this.amount || this.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    return errors;
  }

  clone() {
    return new Contribution(this.toJson());
  }

  update(data) {
    const updatedContribution = this.clone();
    Object.assign(updatedContribution, data);
    return updatedContribution;
  }

  generateReceiptNumber() {
    if (!this.receiptNumber) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      this.receiptNumber = `RCPT${timestamp}${random}`;
    }
    return this.receiptNumber;
  }

  toExportFormat() {
    return {
      'Receipt Number': this.receiptNumber || 'N/A',
      'Month': this.getMonthName(),
      'Year': this.year,
      'Amount': this.getFormattedAmount(),
      'Payment Date': this.getFormattedDate(),
      'Payment Method': this.getPaymentMethodLabel(),
      'Status': this.getStatusLabel(),
      'Description': this.description || 'N/A',
    };
  }

  toJSON() {
    return this.toJson();
  }

  toString() {
    return `${this.getPeriod()} - ${this.getFormattedAmount()}`;
  }
}

export default Contribution;