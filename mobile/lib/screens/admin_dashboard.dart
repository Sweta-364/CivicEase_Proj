import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/complaint.dart';
import '../services/api_service.dart';
import '../theme.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  final ApiService _apiService = ApiService();
  List<Complaint> _complaints = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final complaints = await _apiService.fetchComplaints();
      if (!mounted) return;
      setState(() {
        _complaints = complaints.reversed.toList();
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    // In mobile, we might use a list and then navigate to details
    // since we don't have enough horizontal space for a split view.
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _complaints.length,
      itemBuilder: (context, index) {
        final c = _complaints[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.withOpacity(0.1)),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            title: Row(
              children: [
                _buildStatusBadge(c.status),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    c.title,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text(
                c.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AdminDetailScreen(
                    complaint: c,
                    onUpdate: _loadData,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'Pending':
        color = Colors.amber;
        break;
      case 'Working':
        color = AppTheme.primaryBlue;
        break;
      case 'Solved':
        color = const Color(0xFF10B981);
        break;
      case 'Invalid':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }
}

class AdminDetailScreen extends StatefulWidget {
  final Complaint complaint;
  final VoidCallback onUpdate;

  const AdminDetailScreen({
    super.key,
    required this.complaint,
    required this.onUpdate,
  });

  @override
  State<AdminDetailScreen> createState() => _AdminDetailScreenState();
}

class _AdminDetailScreenState extends State<AdminDetailScreen> {
  final _commentController = TextEditingController();
  XFile? _proofImage;
  Uint8List? _proofImageBytes; // For displaying preview on web
  bool _isProcessing = false;
  final ApiService _apiService = ApiService();

  Future<void> _pickProof() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      final bytes = await image.readAsBytes();
      setState(() {
        _proofImage = image;
        _proofImageBytes = bytes;
      });
    }
  }

  Future<void> _updateStatus(String status) async {
    if (status == 'Solved' && _proofImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Proof image is required for Solved status')),
      );
      return;
    }

    setState(() => _isProcessing = true);
    try {
      await _apiService.updateStatus(
        complaintId: widget.complaint.id,
        newStatus: status,
        comment: _commentController.text,
        proofImage: _proofImage,
      );
      widget.onUpdate();
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      setState(() => _isProcessing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Complaint Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('ID #${widget.complaint.id}',
                style: const TextStyle(
                    fontWeight: FontWeight.bold, color: Colors.grey)),
            const SizedBox(height: 8),
            Text(widget.complaint.title,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            const Text('DESCRIPTION',
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: Colors.grey)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.withOpacity(0.1)),
              ),
              child: Text(widget.complaint.description),
            ),
            if (widget.complaint.imageUrl != null) ...[
              const SizedBox(height: 24),
              const Text('EVIDENCE PHOTO',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: Colors.grey)),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                    ApiService.getImageUrl(widget.complaint.imageUrl),
                    fit: BoxFit.cover),
              ),
            ],
            const SizedBox(height: 32),
            const Divider(),
            const SizedBox(height: 16),
            const Text('TAKE ACTION',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 16),
            TextField(
              controller: _commentController,
              decoration: const InputDecoration(hintText: 'Admin comment...'),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed:
                        _isProcessing ? null : () => _updateStatus('Working'),
                    child: const Text('Mark Working'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed:
                        _isProcessing ? null : () => _updateStatus('Invalid'),
                    style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: const BorderSide(color: Colors.red)),
                    child: const Text('Mark Invalid'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text('Upload Proof (Required for Solved)',
                style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: _pickProof,
              child: Container(
                height: 100,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.withOpacity(0.3)),
                ),
                child: _proofImageBytes != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child:
                            Image.memory(_proofImageBytes!, fit: BoxFit.cover),
                      )
                    : const Icon(Icons.add_a_photo, color: Colors.grey),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _isProcessing ? null : () => _updateStatus('Solved'),
              style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981)),
              child: _isProcessing
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Mark as Solved'),
            ),
          ],
        ),
      ),
    );
  }
}
