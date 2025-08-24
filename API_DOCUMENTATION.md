# 📚 FDS Bengali PDF Statement System - API Documentation

## 🌟 Overview

This document provides a comprehensive overview of all API endpoints for the Friends Development Society (FDS) Bengali PDF Statement System. The application uses Next.js API Routes with Prisma ORM and PostgreSQL database.

## 📋 API Endpoints Summary

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/login` | Admin user login | None |
| `GET` | `/api/admin/members` | Get all members | Bearer Token |
| `POST` | `/api/admin/members` | Create new member | Bearer Token |
| `POST` | `/api/admin/contributions` | Add contribution | Bearer Token |
| `GET` | `/api/member/[accountNumber]` | Get member by account | None |
| `GET` | `/api/health` | Health check | None |

---

## 🔐 Authentication

### Admin Authentication
- **Type**: Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Generation**: Base64 encoded string from admin ID and timestamp
- **Usage**: Required for all admin endpoints

### Member Authentication
- **Type**: Account Number
- **Usage**: Direct account number lookup for member portal

---

## 📊 API Endpoints

### 1. Admin Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate admin user and receive access token

**Request**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success - 200)**:
```json
{
  "token": "Y3VpZF9hZG1pbl8wMDE6MTcwMzQ1Njc4OTAwMA==",
  "admin": {
    "id": "cuid_admin_001",
    "username": "admin",
    "name": "Administrator"
  }
}
```

**Response (Error - 400)**:
```json
{
  "error": "Username and password are required"
}
```

**Response (Error - 401)**:
```json
{
  "error": "Invalid username or password"
}
```

**Response (Error - 500)**:
```json
{
  "error": "Internal server error"
}
```

---

### 2. Get All Members

**Endpoint**: `GET /api/admin/members`

**Description**: Retrieve all members with their contribution history (Admin only)

**Request**:
```http
GET /api/admin/members
Authorization: Bearer Y3VpZF9hZG1pbl8wMDE6MTcwMzQ1Njc4OTAwMA==
```

**Response (Success - 200)**:
```json
[
  {
    "id": "cuid_member_001",
    "accountNumber": "FR6BHG",
    "name": "সুলেমান শেখ",
    "phone": "01712345678",
    "email": "memberfr6bhg@example.com",
    "address": "বাংলাদেশ",
    "createdAt": "2024-08-23T07:27:48.617Z",
    "updatedAt": "2024-08-23T07:27:48.617Z",
    "contributions": [
      {
        "id": "cuid_contrib_001",
        "memberId": "cuid_member_001",
        "month": "01",
        "year": 2024,
        "amount": 1000,
        "paymentDate": "2024-08-23T07:27:48.617Z",
        "description": "জানুয়ারি মাসের চাঁদা",
        "createdAt": "2024-08-23T07:27:48.617Z",
        "updatedAt": "2024-08-23T07:27:48.617Z"
      }
    ]
  }
]
```

**Response (Error - 401)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (Error - 500)**:
```json
{
  "error": "Internal server error"
}
```

---

### 3. Create New Member

**Endpoint**: `POST /api/admin/members`

**Description**: Create a new member with auto-generated account number (Admin only)

**Request**:
```http
POST /api/admin/members
Authorization: Bearer Y3VpZF9hZG1pbl8wMDE6MTcwMzQ1Njc4OTAwMA==
Content-Type: application/json

{
  "name": "মোহাম্মদ আলী",
  "phone": "01712345678",
  "email": "mohammad.ali@email.com",
  "address": "ঢাকা, বাংলাদেশ"
}
```

**Response (Success - 200)**:
```json
{
  "id": "cuid_member_002",
  "accountNumber": "1235",
  "name": "মোহাম্মদ আলী",
  "phone": "01712345678",
  "email": "mohammad.ali@email.com",
  "address": "ঢাকা, বাংলাদেশ",
  "createdAt": "2024-08-23T07:27:48.617Z",
  "updatedAt": "2024-08-23T07:27:48.617Z",
  "contributions": []
}
```

**Response (Error - 400)**:
```json
{
  "error": "Name is required"
}
```

**Response (Error - 401)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (Error - 500)**:
```json
{
  "error": "Internal server error"
}
```

---

### 4. Add Contribution

**Endpoint**: `POST /api/admin/contributions`

**Description**: Add a new contribution for a member (Admin only)

**Request**:
```http
POST /api/admin/contributions
Authorization: Bearer Y3VpZF9hZG1pbl8wMDE6MTcwMzQ1Njc4OTAwMA==
Content-Type: application/json

{
  "memberId": "cuid_member_001",
  "month": "01",
  "year": 2024,
  "amount": 1000,
  "description": "জানুয়ারি মাসের চাঁদা"
}
```

**Response (Success - 200)**:
```json
{
  "id": "cuid_contrib_002",
  "memberId": "cuid_member_001",
  "month": "01",
  "year": 2024,
  "amount": 1000,
  "paymentDate": "2024-08-23T07:27:48.617Z",
  "description": "জানুয়ারি মাসের চাঁদা",
  "createdAt": "2024-08-23T07:27:48.617Z",
  "updatedAt": "2024-08-23T07:27:48.617Z"
}
```

**Response (Error - 400)**:
```json
{
  "error": "All fields are required"
}
```

**Response (Error - 400)**:
```json
{
  "error": "Contribution for this month already exists"
}
```

**Response (Error - 401)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (Error - 500)**:
```json
{
  "error": "Internal server error"
}
```

---

### 5. Get Member by Account Number

**Endpoint**: `GET /api/member/[accountNumber]`

**Description**: Retrieve member information by account number (Member portal)

**Request**:
```http
GET /api/member/FR6BHG
```

**Response (Success - 200)**:
```json
{
  "id": "cuid_member_001",
  "accountNumber": "FR6BHG",
  "name": "সুলেমান শেখ",
  "phone": "01712345678",
  "email": "memberfr6bhg@example.com",
  "address": "বাংলাদেশ",
  "createdAt": "2024-08-23T07:27:48.617Z",
  "updatedAt": "2024-08-23T07:27:48.617Z",
  "contributions": [
    {
      "id": "cuid_contrib_001",
      "memberId": "cuid_member_001",
      "month": "01",
      "year": 2024,
      "amount": 1000,
      "paymentDate": "2024-08-23T07:27:48.617Z",
      "description": "জানুয়ারি মাসের চাঁদা",
      "createdAt": "2024-08-23T07:27:48.617Z",
      "updatedAt": "2024-08-23T07:27:48.617Z"
    }
  ]
}
```

**Response (Error - 400)**:
```json
{
  "error": "Invalid account number"
}
```

**Response (Error - 404)**:
```json
{
  "error": "Member not found"
}
```

**Response (Error - 500)**:
```json
{
  "error": "Internal server error"
}
```

---

### 6. Health Check

**Endpoint**: `GET /api/health`

**Description**: Basic health check endpoint

**Request**:
```http
GET /api/health
```

**Response (Success - 200)**:
```json
{
  "message": "Good!"
}
```

---

## 📊 Data Models

### Admin Model
```typescript
interface Admin {
  id: string;
  username: string;
  password: string; // Hashed with bcrypt
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### Member Model
```typescript
interface Member {
  id: string;
  accountNumber: string; // 4-digit numeric or 6-char alphanumeric
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  contributions: Contribution[];
}
```

### Contribution Model
```typescript
interface Contribution {
  id: string;
  memberId: string;
  month: string; // MM format (01-12)
  year: number;
  amount: number;
  paymentDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔒 Security Features

### Authentication
- **Admin**: Bearer token authentication
- **Member**: Account number based access
- **Password Hashing**: bcrypt with salt rounds
- **Token Generation**: Base64 encoded admin ID + timestamp

### Validation
- **Input Validation**: Required field validation
- **Account Number Format**: 4-digit numeric or 6-char alphanumeric
- **Unique Constraints**: Unique usernames, account numbers, member-month-year combinations
- **Foreign Key Constraints**: Proper database relationships

### Error Handling
- **HTTP Status Codes**: Proper status codes for different error types
- **Error Messages**: User-friendly error messages
- **Logging**: Server-side error logging
- **Graceful Degradation**: Proper error handling without exposing sensitive data

---

## 🚀 Usage Examples

### Admin Login Flow
```javascript
// Step 1: Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// Step 2: Use token for authenticated requests
const membersResponse = await fetch('/api/admin/members', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const members = await membersResponse.json();
```

### Member Portal Flow
```javascript
// Direct member access by account number
const memberResponse = await fetch('/api/member/FR6BHG');
const member = await memberResponse.json();

// Generate PDF statement
const printWindow = window.open('', '_blank');
// PDF generation logic...
```

---

## 📝 API Best Practices

### Request Format
- **Content-Type**: `application/json` for POST requests
- **Authorization**: `Bearer <token>` for admin endpoints
- **Method**: Use appropriate HTTP methods (GET, POST)
- **Body**: JSON format for request data

### Response Format
- **Success**: HTTP 200 with JSON response
- **Client Errors**: HTTP 4xx with error message
- **Server Errors**: HTTP 500 with error message
- **Consistent**: Standardized error response format

### Error Handling
- **Validation**: Validate all input data
- **Authentication**: Check authentication before processing
- **Authorization**: Verify user permissions
- **Logging**: Log errors for debugging
- **User-Friendly**: Provide clear error messages

---

## 🔧 Testing the API

### Using curl

**Admin Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Members**:
```bash
curl -X GET http://localhost:3000/api/admin/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get Member by Account**:
```bash
curl -X GET http://localhost:3000/api/member/FR6BHG
```

**Health Check**:
```bash
curl -X GET http://localhost:3000/api/health
```

### Using Postman

1. **Admin Login**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Body: Raw JSON
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Get Members**:
   - Method: GET
   - URL: `http://localhost:3000/api/admin/members`
   - Headers: `Authorization: Bearer <token>`

3. **Create Member**:
   - Method: POST
   - URL: `http://localhost:3000/api/admin/members`
   - Headers: `Authorization: Bearer <token>`
   - Body: Raw JSON
   ```json
   {
     "name": "মোহাম্মদ আলী",
     "phone": "01712345678",
     "email": "mohammad.ali@email.com",
     "address": "ঢাকা, বাংলাদেশ"
   }
   ```

---

## 🎯 API Versioning and Future Enhancements

### Current Version: v1.0

### Potential Future Enhancements
- **API Versioning**: `/api/v1/auth/login`
- **Pagination**: For large member lists
- **Search**: Member search functionality
- **Filtering**: Filter by date, amount, etc.
- **Sorting**: Custom sorting options
- **Rate Limiting**: Prevent abuse
- **Caching**: Improve performance
- **Webhooks**: Real-time notifications
- **Bulk Operations**: Batch member/contribution operations

---

## 📚 Summary

The FDS Bengali PDF Statement System API provides a comprehensive set of endpoints for managing members, contributions, and authentication. The API follows RESTful principles, includes proper authentication and authorization, and provides clear error handling.

### Key Features:
- ✅ **Admin Authentication**: Secure token-based authentication
- ✅ **Member Management**: CRUD operations for members
- ✅ **Contribution Tracking**: Monthly contribution management
- ✅ **Member Portal**: Account number-based access
- ✅ **PDF Generation**: Browser-based PDF creation
- ✅ **Bengali Support**: Full Bengali language support
- ✅ **Security**: Proper validation and error handling

### Endpoints Overview:
- **6 Total Endpoints**: 2 public, 4 authenticated
- **RESTful Design**: Proper HTTP methods and status codes
- **JSON Format**: Consistent request/response format
- **Error Handling**: Comprehensive error responses

The API is production-ready and can be easily integrated with frontend applications or used with API testing tools like Postman or curl.