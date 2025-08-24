# 📱 Flatter App API Integration Guide

## 🌟 Overview

This guide provides comprehensive API documentation for integrating the FDS (Friends Development Society) Bengali PDF Statement System with a Flutter app. All endpoints are RESTful and return JSON responses.

## 📋 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | Admin login | ❌ No |
| `GET` | `/api/admin/members` | Get all members | ✅ Bearer Token |
| `POST` | `/api/admin/members` | Create member | ✅ Bearer Token |
| `POST` | `/api/admin/contributions` | Add contribution | ✅ Bearer Token |
| `GET` | `/api/member/[accountNumber]` | Get member by account | ❌ No |
| `GET` | `/api/health` | Health check | ❌ No |

---

## 🔐 Authentication Flow

### Step 1: Admin Login
```dart
class AuthService {
  static Future<LoginResponse> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('https://your-domain.com/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      return LoginResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }
}

class LoginResponse {
  final String token;
  final Admin admin;

  LoginResponse({required this.token, required this.admin});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      token: json['token'],
      admin: Admin.fromJson(json['admin']),
    );
  }
}

class Admin {
  final String id;
  final String username;
  final String name;

  Admin({required this.id, required this.username, required this.name});

  factory Admin.fromJson(Map<String, dynamic> json) {
    return Admin(
      id: json['id'],
      username: json['username'],
      name: json['name'],
    );
  }
}
```

### Step 2: Use Bearer Token
```dart
class ApiService {
  static final String _baseUrl = 'https://your-domain.com/api';
  static String? _token;

  static void setToken(String token) {
    _token = token;
  }

  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) {
      'Authorization': 'Bearer $_token',
    },
  };
}
```

---

## 📊 API Integration Examples

### 1. Admin Login

**Request**:
```dart
Future<void> loginAdmin() async {
  try {
    final response = await AuthService.login('admin', 'admin123');
    ApiService.setToken(response.token);
    
    // Store token securely
    await SecureStorage.storeToken(response.token);
    
    print('Login successful: ${response.admin.name}');
  } catch (e) {
    print('Login failed: $e');
  }
}
```

**Response**:
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

### 2. Get All Members

**Request**:
```dart
class MemberService {
  static Future<List<Member>> getAllMembers() async {
    final response = await http.get(
      Uri.parse('${ApiService._baseUrl}/admin/members'),
      headers: ApiService._headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Member.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load members: ${response.body}');
    }
  }
}

class Member {
  final String id;
  final String accountNumber;
  final String name;
  final String? phone;
  final String? email;
  final String? address;
  final List<Contribution> contributions;

  Member({
    required this.id,
    required this.accountNumber,
    required this.name,
    this.phone,
    this.email,
    this.address,
    required this.contributions,
  });

  factory Member.fromJson(Map<String, dynamic> json) {
    return Member(
      id: json['id'],
      accountNumber: json['accountNumber'],
      name: json['name'],
      phone: json['phone'],
      email: json['email'],
      address: json['address'],
      contributions: (json['contributions'] as List)
          .map((c) => Contribution.fromJson(c))
          .toList(),
    );
  }
}
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
    "contributions": [
      {
        "id": "cuid_contrib_001",
        "memberId": "cuid_member_001",
        "month": "01",
        "year": 2024,
        "amount": 1000,
        "paymentDate": "2024-08-23T07:27:48.617Z",
        "description": "জানুয়ারি মাসের চাঁদা"
      }
    ]
  }
]
```

### 3. Create New Member

**Request**:
```dart
class MemberService {
  static Future<Member> createMember({
    required String name,
    String? phone,
    String? email,
    String? address,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiService._baseUrl}/admin/members'),
      headers: ApiService._headers,
      body: jsonEncode({
        'name': name,
        'phone': phone,
        'email': email,
        'address': address,
      }),
    );

    if (response.statusCode == 200) {
      return Member.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to create member: ${response.body}');
    }
  }
}
```

**Usage**:
```dart
Future<void> createNewMember() async {
  try {
    final member = await MemberService.createMember(
      name: 'মোহাম্মদ আলী',
      phone: '01712345678',
      email: 'mohammad.ali@email.com',
      address: 'ঢাকা, বাংলাদেশ',
    );
    
    print('Member created: ${member.name} (${member.accountNumber})');
  } catch (e) {
    print('Failed to create member: $e');
  }
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

### 4. Add Contribution

**Request**:
```dart
class ContributionService {
  static Future<Contribution> addContribution({
    required String memberId,
    required String month,
    required int year,
    required double amount,
    String? description,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiService._baseUrl}/admin/contributions'),
      headers: ApiService._headers,
      body: jsonEncode({
        'memberId': memberId,
        'month': month,
        'year': year,
        'amount': amount,
        'description': description,
      }),
    );

    if (response.statusCode == 200) {
      return Contribution.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to add contribution: ${response.body}');
    }
  }
}

class Contribution {
  final String id;
  final String memberId;
  final String month;
  final int year;
  final double amount;
  final String paymentDate;
  final String? description;

  Contribution({
    required this.id,
    required this.memberId,
    required this.month,
    required this.year,
    required this.amount,
    required this.paymentDate,
    this.description,
  });

  factory Contribution.fromJson(Map<String, dynamic> json) {
    return Contribution(
      id: json['id'],
      memberId: json['memberId'],
      month: json['month'],
      year: json['year'],
      amount: json['amount'].toDouble(),
      paymentDate: json['paymentDate'],
      description: json['description'],
    );
  }
}
```

**Usage**:
```dart
Future<void> addContribution() async {
  try {
    final contribution = await ContributionService.addContribution(
      memberId: 'cuid_member_001',
      month: '01',
      year: 2024,
      amount: 1000,
      description: 'জানুয়ারি মাসের চাঁদা',
    );
    
    print('Contribution added: ${contribution.amount} for ${contribution.month}');
  } catch (e) {
    print('Failed to add contribution: $e');
  }
}
```

**Response**:
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

### 5. Get Member by Account Number

**Request**:
```dart
class MemberService {
  static Future<Member> getMemberByAccount(String accountNumber) async {
    final response = await http.get(
      Uri.parse('${ApiService._baseUrl}/member/$accountNumber'),
    );

    if (response.statusCode == 200) {
      return Member.fromJson(jsonDecode(response.body));
    } else if (response.statusCode == 404) {
      throw Exception('Member not found');
    } else {
      throw Exception('Failed to load member: ${response.body}');
    }
  }
}
```

**Usage**:
```dart
Future<void> getMemberInfo() async {
  try {
    final member = await MemberService.getMemberByAccount('FR6BHG');
    print('Member found: ${member.name}');
    print('Total contributions: ${member.contributions.length}');
  } catch (e) {
    print('Failed to get member: $e');
  }
}
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
  "contributions": [
    {
      "id": "cuid_contrib_001",
      "memberId": "cuid_member_001",
      "month": "01",
      "year": 2024,
      "amount": 1000,
      "paymentDate": "2024-08-23T07:27:48.617Z",
      "description": "জানুয়ারি মাসের চাঁদা"
    }
  ]
}
```

### 6. Health Check

**Request**:
```dart
class HealthService {
  static Future<bool> checkHealth() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiService._baseUrl}/health'),
      );
      
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
```

**Response**:
```json
{
  "message": "Good!"
}
```

---

## 🛠️ Flutter App Structure

### Main Service Classes

```dart
// lib/services/api_service.dart
class ApiService {
  static const String _baseUrl = 'https://your-domain.com/api';
  static String? _token;

  static void setToken(String token) => _token = token;
  
  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };
}

// lib/services/auth_service.dart
class AuthService {
  static Future<LoginResponse> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('${ApiService._baseUrl}/auth/login'),
      headers: ApiService._headers,
      body: jsonEncode({'username': username, 'password': password}),
    );
    
    if (response.statusCode == 200) {
      return LoginResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(_getErrorMessage(response));
    }
  }
  
  static String _getErrorMessage(http.Response response) {
    final error = jsonDecode(response.body)['error'];
    return error ?? 'Unknown error occurred';
  }
}

// lib/services/member_service.dart
class MemberService {
  static Future<List<Member>> getAllMembers() async {
    final response = await http.get(
      Uri.parse('${ApiService._baseUrl}/admin/members'),
      headers: ApiService._headers,
    );
    
    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Member.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load members');
    }
  }
  
  static Future<Member> getMemberByAccount(String accountNumber) async {
    final response = await http.get(
      Uri.parse('${ApiService._baseUrl}/member/$accountNumber'),
    );
    
    if (response.statusCode == 200) {
      return Member.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Member not found');
    }
  }
  
  static Future<Member> createMember(Map<String, dynamic> memberData) async {
    final response = await http.post(
      Uri.parse('${ApiService._baseUrl}/admin/members'),
      headers: ApiService._headers,
      body: jsonEncode(memberData),
    );
    
    if (response.statusCode == 200) {
      return Member.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to create member');
    }
  }
}

// lib/services/contribution_service.dart
class ContributionService {
  static Future<Contribution> addContribution(Map<String, dynamic> contributionData) async {
    final response = await http.post(
      Uri.parse('${ApiService._baseUrl}/admin/contributions'),
      headers: ApiService._headers,
      body: jsonEncode(contributionData),
    );
    
    if (response.statusCode == 200) {
      return Contribution.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to add contribution');
    }
  }
}
```

### Error Handling

```dart
class ApiErrorHandler {
  static void handleException(dynamic exception) {
    if (exception is http.ClientException) {
      // Network error
      showError('Network error. Please check your connection.');
    } else if (exception is FormatException) {
      // JSON parsing error
      showError('Invalid response format.');
    } else {
      // API error
      showError(exception.toString());
    }
  }
  
  static void showError(String message) {
    // Show error dialog or snackbar
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }
}
```

### Usage Example in Flutter Widget

```dart
class AdminDashboard extends StatefulWidget {
  @override
  _AdminDashboardState createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  List<Member> _members = [];
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadMembers();
  }

  Future<void> _loadMembers() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final members = await MemberService.getAllMembers();
      setState(() {
        _members = members;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _createMember() async {
    try {
      final member = await MemberService.createMember({
        'name': 'নতুন সদস্য',
        'phone': '01712345678',
        'email': 'newmember@example.com',
        'address': 'বাংলাদেশ',
      });
      
      setState(() {
        _members.add(member);
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Member created successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to create member')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Admin Dashboard')),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text(_errorMessage!))
              : ListView.builder(
                  itemCount: _members.length,
                  itemBuilder: (context, index) {
                    final member = _members[index];
                    return ListTile(
                      title: Text(member.name),
                      subtitle: Text('Account: ${member.accountNumber}'),
                      trailing: Text('${member.contributions.length} contributions'),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: _createMember,
        child: Icon(Icons.add),
      ),
    );
  }
}
```

---

## 🔒 Security Best Practices

### Token Storage
```dart
class SecureStorage {
  static const _tokenKey = 'auth_token';
  
  static Future<void> storeToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }
  
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }
  
  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }
}
```

### Request Interceptor
```dart
class AuthInterceptor {
  static Future<http.Response> sendRequest(
    Future<http.Response> Function() request,
  ) async {
    try {
      return await request();
    } catch (e) {
      if (e.toString().contains('401')) {
        // Token expired, redirect to login
        await SecureStorage.clearToken();
        Navigator.pushReplacementNamed(context, '/login');
      }
      rethrow;
    }
  }
}
```

---

## 🧪 Testing

### Unit Tests
```dart
void main() {
  test('Login API Test', () async {
    // Mock HTTP client
    final client = MockHttpClient();
    
    when(client.post(
      any,
      headers: anyNamed('headers'),
      body: anyNamed('body'),
    )).thenAnswer((_) async => http.Response(
      '{"token":"test_token","admin":{"id":"1","username":"admin","name":"Admin"}}',
      200,
    ));

    final authService = AuthService(client);
    final result = await authService.login('admin', 'admin123');
    
    expect(result.token, 'test_token');
    expect(result.admin.username, 'admin');
  });
}
```

### Integration Tests
```dart
void main() {
  testWidgets('Member List Test', (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    
    // Login first
    await tester.tap(find.byKey(Key('login_button')));
    await tester.pumpAndSettle();
    
    // Navigate to member list
    await tester.tap(find.byKey(Key('member_list_button')));
    await tester.pumpAndSettle();
    
    // Verify members are displayed
    expect(find.byType(ListTile), findsWidgets);
  });
}
```

---

## 🚀 Deployment

### Environment Configuration
```dart
class Config {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://your-domain.com/api',
  );
  
  static const bool isDebug = bool.fromEnvironment(
    'DEBUG',
    defaultValue: false,
  );
}
```

### Build Commands
```bash
# Debug build
flutter build apk --debug

# Release build
flutter build apk --release

# iOS build
flutter build ios --release
```

---

## 📱 Flutter Package Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  json_annotation: ^4.8.1
  shared_preferences: ^2.2.0
  flutter_secure_storage: ^8.0.0
  provider: ^6.0.5
  intl: ^0.18.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.6
  json_serializable: ^6.7.1
  mocktail: ^0.3.0
```

---

**🎉 Your Flutter app is now ready to integrate with the FDS API!**

This comprehensive guide provides all the necessary code examples and best practices for building a Flutter app that integrates seamlessly with your FDS Bengali PDF Statement System API.