import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import '../utils/app_config.dart';

class ApiService {
  static String? _token;

  static void setToken(String token) {
    _token = token;
  }

  static void clearToken() {
    _token = null;
  }

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  static Future<http.Response> get(String endpoint) async {
    final url = '${AppConfig.baseUrl}$endpoint';
    debugPrint('GET: $url');
    
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: _headers,
      ).timeout(const Duration(seconds: 30));
      
      debugPrint('Response: ${response.statusCode} - ${response.body}');
      return response;
    } catch (e) {
      debugPrint('GET Error: $e');
      rethrow;
    }
  }

  static Future<http.Response> post(String endpoint, {Map<String, dynamic>? body}) async {
    final url = '${AppConfig.baseUrl}$endpoint';
    debugPrint('POST: $url');
    debugPrint('Body: ${jsonEncode(body)}');
    
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: _headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(seconds: 30));
      
      debugPrint('Response: ${response.statusCode} - ${response.body}');
      return response;
    } catch (e) {
      debugPrint('POST Error: $e');
      rethrow;
    }
  }

  static Future<http.Response> put(String endpoint, {Map<String, dynamic>? body}) async {
    final url = '${AppConfig.baseUrl}$endpoint';
    debugPrint('PUT: $url');
    debugPrint('Body: ${jsonEncode(body)}');
    
    try {
      final response = await http.put(
        Uri.parse(url),
        headers: _headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(seconds: 30));
      
      debugPrint('Response: ${response.statusCode} - ${response.body}');
      return response;
    } catch (e) {
      debugPrint('PUT Error: $e');
      rethrow;
    }
  }

  static Future<http.Response> delete(String endpoint) async {
    final url = '${AppConfig.baseUrl}$endpoint';
    debugPrint('DELETE: $url');
    
    try {
      final response = await http.delete(
        Uri.parse(url),
        headers: _headers,
      ).timeout(const Duration(seconds: 30));
      
      debugPrint('Response: ${response.statusCode} - ${response.body}');
      return response;
    } catch (e) {
      debugPrint('DELETE Error: $e');
      rethrow;
    }
  }

  static bool isSuccess(int statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }

  static String getErrorMessage(http.Response response) {
    try {
      final body = jsonDecode(response.body);
      return body['error'] ?? body['message'] ?? 'Unknown error occurred';
    } catch (e) {
      return 'HTTP ${response.statusCode}: ${response.reasonPhrase}';
    }
  }
}