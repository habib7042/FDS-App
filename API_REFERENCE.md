# 🔧 FDS API Reference

## Quick API Reference Guide

### Authentication
- **Admin**: Bearer Token (from `/api/auth/login`)
- **Member**: Account Number (direct lookup)

---

## 📋 All API Endpoints

### 1. Admin Authentication
```
POST /api/auth/login
```
**Request**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Response**:
```json
{
  "token": "base64_token",
  "admin": {
    "id": "cuid_admin_001",
    "username": "admin",
    "name": "Administrator"
  }
}
```

---

### 2. Get All Members (Admin)
```
GET /api/admin/members
Authorization: Bearer <token>
```
**Response**:
```json
[
  {
    "id": "cuid_member_001",
    "accountNumber": "FR6BHG",
    "name": "সুলেমান শেখ",
    "phone": "01712345678",
    "email": "member@example.com",
    "address": "বাংলাদেশ",
    "contributions": [...]
  }
]
```

---

### 3. Create Member (Admin)
```
POST /api/admin/members
Authorization: Bearer <token>
Content-Type: application/json
```
**Request**:
```json
{
  "name": "মোহাম্মদ আলী",
  "phone": "01712345678",
  "email": "email@example.com",
  "address": "ঢাকা, বাংলাদেশ"
}
```
**Response**:
```json
{
  "id": "cuid_member_002",
  "accountNumber": "1235",
  "name": "মোহাম্মদ আলী",
  "phone": "01712345678",
  "email": "email@example.com",
  "address": "ঢাকা, বাংলাদেশ",
  "contributions": []
}
```

---

### 4. Add Contribution (Admin)
```
POST /api/admin/contributions
Authorization: Bearer <token>
Content-Type: application/json
```
**Request**:
```json
{
  "memberId": "cuid_member_001",
  "month": "01",
  "year": 2024,
  "amount": 1000,
  "description": "জানুয়ারি মাসের চাঁদা"
}
```
**Response**:
```json
{
  "id": "cuid_contrib_001",
  "memberId": "cuid_member_001",
  "month": "01",
  "year": 2024,
  "amount": 1000,
  "paymentDate": "2024-08-23T07:27:48.617Z",
  "description": "জানুয়ারি মাসের চাঁদা"
}
```

---

### 5. Get Member by Account (Public)
```
GET /api/member/{accountNumber}
```
**Example**: `GET /api/member/FR6BHG`
**Response**:
```json
{
  "id": "cuid_member_001",
  "accountNumber": "FR6BHG",
  "name": "সুলেমান শেখ",
  "phone": "01712345678",
  "email": "member@example.com",
  "address": "বাংলাদেশ",
  "contributions": [...]
}
```

---

### 6. Health Check (Public)
```
GET /api/health
```
**Response**:
```json
{
  "message": "Good!"
}
```

---

## 🚨 Error Responses

### Authentication Errors (401)
```json
{
  "error": "Unauthorized"
}
```

### Validation Errors (400)
```json
{
  "error": "Username and password are required"
}
```

### Not Found Errors (404)
```json
{
  "error": "Member not found"
}
```

### Server Errors (500)
```json
{
  "error": "Internal server error"
}
```

---

## 🧪 Testing Commands

### Using curl

```bash
# Admin Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get Members (replace TOKEN)
curl -X GET http://localhost:3000/api/admin/members \
  -H "Authorization: Bearer TOKEN"

# Get Member by Account
curl -X GET http://localhost:3000/api/member/FR6BHG

# Health Check
curl -X GET http://localhost:3000/api/health
```

### Using JavaScript

```javascript
// Admin Login
const login = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const data = await response.json();
  return data.token;
};

// Get Members
const getMembers = async (token) => {
  const response = await fetch('/api/admin/members', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Get Member by Account
const getMember = async (accountNumber) => {
  const response = await fetch(`/api/member/${accountNumber}`);
  return await response.json();
};
```

---

## 📊 Data Models

### Admin
```typescript
{
  id: string;
  username: string;
  password: string; // Hashed
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### Member
```typescript
{
  id: string;
  accountNumber: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  contributions: Contribution[];
}
```

### Contribution
```typescript
{
  id: string;
  memberId: string;
  month: string; // MM format
  year: number;
  amount: number;
  paymentDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔒 Security

- **Admin Auth**: Bearer token required
- **Member Access**: Account number based
- **Password Hashing**: bcrypt
- **Input Validation**: All inputs validated
- **Error Handling**: No sensitive data exposure