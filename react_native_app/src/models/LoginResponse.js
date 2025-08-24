import Admin from './Admin';

class LoginResponse {
  constructor(data = {}) {
    this.token = data.token || '';
    this.admin = new Admin(data.admin || {});
    this.expiresIn = data.expiresIn || 3600;
    this.tokenType = data.tokenType || 'Bearer';
    this.issuedAt = data.issuedAt || new Date().toISOString();
  }

  static fromJson(json) {
    return new LoginResponse({
      token: json.token || '',
      admin: json.admin || {},
      expiresIn: json.expiresIn || 3600,
      tokenType: json.tokenType || 'Bearer',
      issuedAt: json.issuedAt || new Date().toISOString(),
    });
  }

  toJson() {
    return {
      token: this.token,
      admin: this.admin.toJson(),
      expiresIn: this.expiresIn,
      tokenType: this.tokenType,
      issuedAt: this.issuedAt,
    };
  }

  getAuthorizationHeader() {
    return `${this.tokenType} ${this.token}`;
  }

  isExpired() {
    if (!this.issuedAt) return true;
    
    const issuedDate = new Date(this.issuedAt);
    const expirationDate = new Date(issuedDate.getTime() + (this.expiresIn * 1000));
    return new Date() > expirationDate;
  }

  getTimeUntilExpiration() {
    if (!this.issuedAt) return 0;
    
    const issuedDate = new Date(this.issuedAt);
    const expirationDate = new Date(issuedDate.getTime() + (this.expiresIn * 1000));
    const now = new Date();
    
    return Math.max(0, expirationDate.getTime() - now.getTime());
  }

  getExpirationDate() {
    if (!this.issuedAt) return null;
    
    const issuedDate = new Date(this.issuedAt);
    return new Date(issuedDate.getTime() + (this.expiresIn * 1000));
  }

  isValid() {
    return this.token && this.token.length > 0 && !this.isExpired();
  }

  clone() {
    return new LoginResponse(this.toJson());
  }

  refresh(newToken) {
    return new LoginResponse({
      ...this.toJson(),
      token: newToken,
      issuedAt: new Date().toISOString(),
    });
  }

  toJSON() {
    return this.toJson();
  }

  toString() {
    return `LoginResponse(token: ${this.token ? '***' : 'null'}, admin: ${this.admin.name})`;
  }
}

export default LoginResponse;