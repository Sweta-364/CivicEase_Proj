class Complaint {
  final int id;
  final String title;
  final String description;
  final String? imageUrl;
  final String category;
  final String status;
  final DateTime createdAt;
  final int userId;

  Complaint({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.category,
    required this.status,
    required this.createdAt,
    required this.userId,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['image_url'],
      category: json['category'],
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
      userId: json['user_id'],
    );
  }
}
