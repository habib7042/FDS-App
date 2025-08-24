class Admin {
  constructor(data = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.role = data.role || 'admin';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static fromJson(json) {
    return new Admin({
      id: json.id || '',
      username: json.username || '',
      name: json.name || '',
      email: json.email || '',
      role: json.role || 'admin',
      createdAt: json.createdAt || new Date().toISOString(),
      updatedAt: json.updatedAt || new Date().toISOString(),
    });
  }

  toJson() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      email: this.email,
      role: this.role,
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
    return this.name || this.username;
  }

  isValid() {
    return this.id && this.username && this.name;
  }

  clone() {
    return new Admin(this.toJson());
  }
}

export default Admin;