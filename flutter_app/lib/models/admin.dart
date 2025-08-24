class Admin {
  final String id;
  final String username;
  final String name;

  Admin({
    required this.id,
    required this.username,
    required this.name,
  });

  factory Admin.fromJson(Map<String, dynamic> json) {
    return Admin(
      id: json['id'] ?? '',
      username: json['username'] ?? '',
      name: json['name'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'name': name,
    };
  }
}