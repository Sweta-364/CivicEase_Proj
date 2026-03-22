import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/complaint.dart';
import '../services/api_service.dart';
import '../theme.dart';

class ComplaintCard extends StatelessWidget {
  final Complaint complaint;

  const ComplaintCard({super.key, required this.complaint});

  Color _getStatusColor() {
    switch (complaint.status) {
      case 'Pending':
        return Colors.amber;
      case 'Working':
        return AppTheme.primaryBlue;
      case 'Solved':
        return const Color(0xFF10B981);
      case 'Invalid':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (complaint.imageUrl != null)
                SizedBox(
                  width: 120,
                  height: 120,
                  child: Image.network(
                    ApiService.getImageUrl(complaint.imageUrl),
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: Colors.grey[200],
                      child: const Icon(Icons.broken_image, color: Colors.grey),
                    ),
                  ),
                ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              complaint.category.toUpperCase(),
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getStatusColor().withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                  color: _getStatusColor().withOpacity(0.2)),
                            ),
                            child: Text(
                              complaint.status.toUpperCase(),
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: _getStatusColor(),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        complaint.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textDark,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        complaint.description,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.textGray,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              border:
                  Border(top: BorderSide(color: Colors.grey.withOpacity(0.1))),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.calendar_today,
                        size: 14, color: AppTheme.textGray),
                    const SizedBox(width: 6),
                    Text(
                      DateFormat('MMMM dd, yyyy').format(complaint.createdAt),
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.textGray,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                if (complaint.status == 'Solved')
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.check_circle,
                            size: 14, color: Color(0xFF10B981)),
                        SizedBox(width: 4),
                        Text(
                          'VERIFIED',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF047857),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
