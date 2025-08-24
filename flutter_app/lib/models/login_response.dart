import 'admin.dart';

class LoginResponse {
  final String token;
  final Admin admin;

  LoginResponse({
    required this.token,
    required this.admin,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      token: json['token'] ?? '',
      admin: Admin.fromJson(json['admin'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'admin': admin.toJson(),
    };
  }
}