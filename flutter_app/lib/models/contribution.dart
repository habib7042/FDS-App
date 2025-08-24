class Contribution {
  final String id;
  final String memberId;
  final String month;
  final int year;
  final double amount;
  final DateTime paymentDate;
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
      id: json['id'] ?? '',
      memberId: json['memberId'] ?? '',
      month: json['month'] ?? '',
      year: json['year'] ?? 0,
      amount: (json['amount'] ?? 0).toDouble(),
      paymentDate: DateTime.parse(json['paymentDate'] ?? DateTime.now().toIso8601String()),
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'memberId': memberId,
      'month': month,
      'year': year,
      'amount': amount,
      'paymentDate': paymentDate.toIso8601String(),
      'description': description,
    };
  }

  String getMonthName() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const bengaliMonthNames = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    
    final monthIndex = int.tryParse(month) ?? 1;
    if (monthIndex >= 1 && monthIndex <= 12) {
      return bengaliMonthNames[monthIndex - 1];
    }
    return month;
  }
}