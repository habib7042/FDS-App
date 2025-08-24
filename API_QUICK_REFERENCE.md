# 🚀 FDS API Quick Reference

## 📋 All API Endpoints

### 🔐 Authentication
- **POST** `/api/auth/login` - Admin login
- **GET** `/api/health` - Health check

### 👥 Admin Endpoints (Require Bearer Token)
- **GET** `/api/admin/members` - Get all members
- **POST** `/api/admin/members` - Create new member
- **POST** `/api/admin/contributions` - Add contribution

### 👤 Member Endpoints (Public)
- **GET** `/api/member/[accountNumber]` - Get member by account

---

## 🔑 Authentication

### Admin Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "token": "BASE64_TOKEN",
  "admin": {
    "id": "cuid_admin_001",
    "username": "admin",
    "name": "Administrator"
  }
}
```

### Using Bearer Token
```http
Authorization: Bearer BASE64_TOKEN
```

---

## 📊 API Requests & Responses

### 1. Get All Members
```http
GET /api/admin/members
Authorization: Bearer BASE64_TOKEN
```

**Response**:
```json
[
  {
    "id": "cuid_member_001",
    "accountNumber": "FR6BHG",
    "name": "সুলেমান শেখ",
    "phone": "01712345678",
    "email": "memberfr6bhg@example.com",
    "address": "বাংলাদেশ",
    "contributions": [...]
  }
]
```

### 2. Create New Member
```http
POST /api/admin/members
Authorization: Bearer BASE64_TOKEN
Content-Type: application/json

{
  "name": "মোহাম্মদ আলী",
  "phone": "01712345678",
  "email": "mohammad.ali@email.com",
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
  "email": "mohammad.ali@email.com",
  "address": "ঢাকা, বাংলাদেশ",
  "contributions": []
}
```

### 3. Add Contribution
```http
POST /api/admin/contributions
Authorization: Bearer BASE64_TOKEN
Content-Type: application/json

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

### 4. Get Member by Account
```http
GET /api/member/FR6BHG
```

**Response**:
```json
{
  "id": "cuid_member_001",
  "accountNumber": "FR6BHG",
  "name": "সুলেমান শেখ",
  "phone": "01712345678",
  "email": "memberfr6bhg@example.com",
  "address": "বাংলাদেশ",
  "contributions": [...]
}
```

### 5. Health Check
```http
GET /api/health
```

**Response**:
```json
{
  "message": "Good!"
}
```

---

## ❌ Error Responses

### Authentication Errors
```json
{
  "error": "Unauthorized"
}
```

### Validation Errors
```json
{
  "error": "Username and password are required"
}
```

### Not Found Errors
```json
{
  "error": "Member not found"
}
```

### Server Errors
```json
{
  "error": "Internal server error"
}
```

---

## 🧪 Testing with curl

### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Members
```bash
curl -X GET http://localhost:3000/api/admin/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Member by Account
```bash
curl -X GET http://localhost:3000/api/member/FR6BHG
```

### Health Check
```bash
curl -X GET http://localhost:3000/api/health
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
  accountNumber: string; // 4-digit or 6-char alphanumeric
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

## 🎯 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔒 Security

- **Authentication**: Bearer token for admin endpoints
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Required field validation
- **Unique Constraints**: No duplicate usernames/account numbers
- **Foreign Key Constraints**: Proper database relationships

---

**🚀 Your FDS API is ready for integration and testing!**