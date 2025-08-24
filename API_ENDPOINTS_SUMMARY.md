# 📡 FDS API Endpoints Summary

## Complete API Overview for FDS Bengali PDF Statement System

---

## 🔐 Authentication Flow

### Step 1: Admin Login
```
POST /api/auth/login
→ Returns Bearer token for authenticated requests
```

### Step 2: Use Token
```
All admin endpoints require: Authorization: Bearer <token>
```

---

## 📋 All API Endpoints

### 1. **Admin Authentication**
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Auth**: None
- **Purpose**: Admin user login
- **Request**: `{ username, password }`
- **Response**: `{ token, admin }`

### 2. **Get All Members**
- **Method**: `GET`
- **Endpoint**: `/api/admin/members`
- **Auth**: Bearer Token
- **Purpose**: Retrieve all members with contributions
- **Response**: `Member[]` with contributions

### 3. **Create Member**
- **Method**: `POST`
- **Endpoint**: `/api/admin/members`
- **Auth**: Bearer Token
- **Purpose**: Create new member (auto-generates account number)
- **Request**: `{ name, phone?, email?, address? }`
- **Response**: `Member` object

### 4. **Add Contribution**
- **Method**: `POST`
- **Endpoint**: `/api/admin/contributions`
- **Auth**: Bearer Token
- **Purpose**: Add monthly contribution for member
- **Request**: `{ memberId, month, year, amount, description? }`
- **Response**: `Contribution` object

### 5. **Get Member by Account**
- **Method**: `GET`
- **Endpoint**: `/api/member/[accountNumber]`
- **Auth**: None
- **Purpose**: Member portal access by account number
- **Response**: `Member` with contributions

### 6. **Health Check**
- **Method**: `GET`
- **Endpoint**: `/api/health`
- **Auth**: None
- **Purpose**: Basic health check
- **Response**: `{ message: "Good!" }`

---

## 📊 Request/Response Examples

### ✅ Success Responses

#### Admin Login (200)
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

#### Get Members (200)
```json
[
  {
    "id": "cuid_member_001",
    "accountNumber": "FR6BHG",
    "name": "সুলেমান শেখ",
    "phone": "01712345678",
    "email": "memberfr6bhg@example.com",
    "address": "বাংলাদেশ",
    "contributions": [
      {
        "id": "cuid_contrib_001",
        "memberId": "cuid_member_001",
        "month": "01",
        "year": 2024,
        "amount": 1000,
        "description": "জানুয়ারি মাসের চাঁদা"
      }
    ]
  }
]
```

#### Create Member (200)
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

#### Add Contribution (200)
```json
{
  "id": "cuid_contrib_002",
  "memberId": "cuid_member_001",
  "month": "01",
  "year": 2024,
  "amount": 1000,
  "paymentDate": "2024-08-23T07:27:48.617Z",
  "description": "জানুয়ারি মাসের চাঁদা"
}
```

#### Get Member by Account (200)
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

#### Health Check (200)
```json
{
  "message": "Good!"
}
```

### ❌ Error Responses

#### Authentication Error (401)
```json
{
  "error": "Unauthorized"
}
```

#### Validation Error (400)
```json
{
  "error": "Username and password are required"
}
```

#### Not Found Error (404)
```json
{
  "error": "Member not found"
}
```

#### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

---

## 🔧 HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Authentication required/failed |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## 🧪 Testing Commands

### curl Examples

```bash
# 1. Admin Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Get Members (replace TOKEN)
curl -X GET http://localhost:3000/api/admin/members \
  -H "Authorization: Bearer TOKEN"

# 3. Create Member (replace TOKEN)
curl -X POST http://localhost:3000/api/admin/members \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"মোহাম্মদ আলী","phone":"01712345678","email":"email@example.com","address":"ঢাকা, বাংলাদেশ"}'

# 4. Add Contribution (replace TOKEN)
curl -X POST http://localhost:3000/api/admin/contributions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"memberId":"cuid_member_001","month":"01","year":2024,"amount":1000,"description":"জানুয়ারি মাসের চাঁদা"}'

# 5. Get Member by Account
curl -X GET http://localhost:3000/api/member/FR6BHG

# 6. Health Check
curl -X GET http://localhost:3000/api/health
```

### JavaScript Examples

```javascript
// Admin Login
const login = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  return await response.json();
};

// Get Members
const getMembers = async (token) => {
  const response = await fetch('/api/admin/members', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Create Member
const createMember = async (token, memberData) => {
  const response = await fetch('/api/admin/members', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(memberData)
  });
  return await response.json();
};

// Add Contribution
const addContribution = async (token, contributionData) => {
  const response = await fetch('/api/admin/contributions', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contributionData)
  });
  return await response.json();
};

// Get Member by Account
const getMember = async (accountNumber) => {
  const response = await fetch(`/api/member/${accountNumber}`);
  return await response.json();
};

// Health Check
const healthCheck = async () => {
  const response = await fetch('/api/health');
  return await response.json();
};
```

---

## 📊 Data Models

### Admin
```typescript
interface Admin {
  id: string;
  username: string;
  password: string; // bcrypt hashed
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### Member
```typescript
interface Member {
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

- **Authentication**: Bearer token for admin endpoints
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Required field validation
- **Unique Constraints**: No duplicate usernames/account numbers
- **Foreign Key Constraints**: Database integrity
- **Error Handling**: No sensitive data exposure
- **Rate Limiting**: Basic protection (can be enhanced)

---

## 🎯 API Usage Flow

### Admin Flow
1. **Login** → Get token
2. **Get Members** → View all members
3. **Create Member** → Add new member
4. **Add Contribution** → Add monthly payment
5. **Generate PDF** → Create statements

### Member Flow
1. **Enter Account** → Direct access
2. **View Statement** → See contributions
3. **Download PDF** → Get statement

---

## 📚 Summary

**6 Total Endpoints:**
- **2 Public**: `/api/auth/login`, `/api/health`, `/api/member/[accountNumber]`
- **3 Admin**: `/api/admin/members`, `/api/admin/contributions`
- **1 Health**: `/api/health`

**Key Features:**
- ✅ RESTful design
- ✅ JSON format
- ✅ Proper authentication
- ✅ Error handling
- ✅ Bengali support
- ✅ PDF generation capability
- ✅ Production ready

The API is comprehensive, secure, and ready for integration with any frontend application or for use with API testing tools.