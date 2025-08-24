import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppConfig {
  static const String _baseUrlKey = 'base_url';
  static const String _themeModeKey = 'theme_mode';
  static const String _languageKey = 'language';
  
  static String baseUrl = 'http://localhost:3000/api';
  static ThemeMode themeMode = ThemeMode.light;
  static String language = 'en';
  
  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    
    baseUrl = prefs.getString(_baseUrlKey) ?? 'http://localhost:3000/api';
    
    final themeIndex = prefs.getInt(_themeModeKey) ?? 0;
    themeMode = ThemeMode.values[themeIndex];
    
    language = prefs.getString(_languageKey) ?? 'en';
  }
  
  static Future<void> setBaseUrl(String url) async {
    baseUrl = url;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_baseUrlKey, url);
  }
  
  static Future<void> setThemeMode(ThemeMode mode) async {
    themeMode = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_themeModeKey, mode.index);
  }
  
  static Future<void> setLanguage(String lang) async {
    language = lang;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_languageKey, lang);
  }
}