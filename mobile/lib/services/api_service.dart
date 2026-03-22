import 'dart:convert';
import 'package:flutter/foundation.dart' show kDebugMode;
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';
import '../models/complaint.dart';
import '../config.dart';

class ApiService {
  static String get baseUrl => AppConfig.apiBaseUrl;

  static String getImageUrl(String? path) {
    if (path == null) return '';
    if (path.startsWith('http')) return path;
    return '$baseUrl$path';
  }

  Future<List<Complaint>> fetchComplaints() async {
    final response = await http.get(Uri.parse('$baseUrl/complaints/'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Complaint.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load complaints: ${response.statusCode}');
    }
  }

  /// Helper to create a [http.MultipartFile] from an [XFile].
  /// Works on all platforms (web, mobile, desktop).
  Future<http.MultipartFile> _multipartFileFromXFile(
    XFile xFile,
    String fieldName,
  ) async {
    final bytes = await xFile.readAsBytes();
    final filename = xFile.name;

    // Determine MIME type from extension
    String ext = '';
    if (filename.contains('.')) {
      ext = filename.split('.').last.toLowerCase();
    }
    // Default to 'jpeg' if extension is missing/unknown
    final mimeSubtype = (ext.isNotEmpty) ? ext : 'jpeg';

    if (kDebugMode) {
      print(
          'Uploading file: $filename (${bytes.length} bytes, image/$mimeSubtype)');
    }

    return http.MultipartFile.fromBytes(
      fieldName,
      bytes,
      filename: filename,
      contentType: MediaType('image', mimeSubtype),
    );
  }

  Future<void> createComplaint({
    required String title,
    required String description,
    XFile? image,
  }) async {
    var request =
        http.MultipartRequest('POST', Uri.parse('$baseUrl/complaints/'));
    request.fields['title'] = title;
    request.fields['description'] = description;

    if (image != null) {
      final multipartFile = await _multipartFileFromXFile(image, 'image');
      request.files.add(multipartFile);
    }

    var response = await request.send();

    if (response.statusCode != 200) {
      final body = await response.stream.bytesToString();
      throw Exception(
          'Failed to create complaint: ${response.statusCode} - $body');
    }
  }

  Future<void> updateStatus({
    required int complaintId,
    required String newStatus,
    String? comment,
    XFile? proofImage,
  }) async {
    var request = http.MultipartRequest(
      'PATCH',
      Uri.parse('$baseUrl/complaints/$complaintId/status'),
    );

    request.fields['new_status'] = newStatus;
    if (comment != null) request.fields['admin_comment'] = comment;

    if (proofImage != null) {
      final multipartFile =
          await _multipartFileFromXFile(proofImage, 'proof_image');
      request.files.add(multipartFile);
    }

    var response = await request.send();

    if (response.statusCode != 200) {
      final body = await response.stream.bytesToString();
      throw Exception(
          'Failed to update status: ${response.statusCode} - $body');
    }
  }
}
