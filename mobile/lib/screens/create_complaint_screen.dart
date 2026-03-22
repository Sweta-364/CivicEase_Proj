import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import '../theme.dart';

class CreateComplaintScreen extends StatefulWidget {
  const CreateComplaintScreen({super.key});

  @override
  State<CreateComplaintScreen> createState() => _CreateComplaintScreenState();
}

class _CreateComplaintScreenState extends State<CreateComplaintScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  XFile? _image;
  Uint8List? _imageBytes; // For displaying preview on web
  bool _isLoading = false;
  final ApiService _apiService = ApiService();

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      final bytes = await image.readAsBytes();
      setState(() {
        _image = image;
        _imageBytes = bytes;
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _image == null) {
      if (_image == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please upload an evidence photo')),
        );
      }
      return;
    }

    setState(() => _isLoading = true);

    try {
      await _apiService.createComplaint(
        title: _titleController.text,
        description: _descriptionController.text,
        image: _image,
      );
      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to submit: $e')),
      );
    }
  }

  Widget _buildImagePreview() {
    if (_imageBytes != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Image.memory(_imageBytes!, fit: BoxFit.cover),
      );
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.camera_alt, size: 48, color: Colors.grey[400]),
        const SizedBox(height: 8),
        const Text(
          'Tap to upload photo',
          style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Report an Issue'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Help us improve your community by reporting problems.',
                style: TextStyle(color: AppTheme.textGray),
              ),
              const SizedBox(height: 32),
              const Text(
                'Evidence Photo *',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Colors.grey[300]!,
                      width: 2,
                      style: BorderStyle.solid,
                    ),
                  ),
                  child: _buildImagePreview(),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Issue Title *',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  hintText: 'e.g., Broken streetlight',
                ),
                validator: (v) => v!.isEmpty ? 'Title is required' : null,
              ),
              const SizedBox(height: 24),
              const Text(
                'Detailed Description *',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _descriptionController,
                maxLines: 5,
                decoration: const InputDecoration(
                  hintText: 'Provide specific details...',
                ),
                validator: (v) => v!.isEmpty ? 'Description is required' : null,
              ),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Submit Report'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
