import 'contribution.dart';

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
      id: json['id'] ?? '',
      accountNumber: json['accountNumber'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'],
      email: json['email'],
      address: json['address'],
      contributions: (json['contributions'] as List?)
              ?.map((c) => Contribution.fromJson(c))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'accountNumber': accountNumber,
      'name': name,
      'phone': phone,
      'email': email,
      'address': address,
      'contributions': contributions.map((c) => c.toJson()).toList(),
    };
  }

  double getTotalContributions() {
    return contributions.fold(0, (sum, contribution) => sum + contribution.amount);
  }

  int getTotalContributionsCount() {
    return contributions.length;
  }

  List<Contribution> getContributionsByYear(int year) {
    return contributions.where((c) => c.year == year).toList();
  }

  List<int> getAvailableYears() {
    return contributions.map((c) => c.year).toSet().toList()..sort();
  }
}