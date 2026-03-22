import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/home_screen.dart';
import 'screens/admin_dashboard.dart';
import 'theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CivicEaseApp());
}

class CivicEaseApp extends StatefulWidget {
  const CivicEaseApp({super.key});

  @override
  State<CivicEaseApp> createState() => _CivicEaseAppState();
}

class _CivicEaseAppState extends State<CivicEaseApp> {
  String _role = 'citizen';

  @override
  void initState() {
    super.initState();
    _loadRole();
  }

  void _loadRole() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _role = prefs.getString('civic_role') ?? 'citizen';
    });
  }

  void _toggleRole() async {
    final prefs = await SharedPreferences.getInstance();
    final newRole = _role == 'citizen' ? 'admin' : 'citizen';
    await prefs.setString('civic_role', newRole);
    setState(() {
      _role = newRole;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CivicEase',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: RoleWrapper(
        role: _role,
        onToggleRole: _toggleRole,
      ),
    );
  }
}

class RoleWrapper extends StatelessWidget {
  final String role;
  final VoidCallback onToggleRole;

  const RoleWrapper({
    super.key,
    required this.role,
    required this.onToggleRole,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('CivicEase'),
            Text(
              'Community Response',
              style: TextStyle(
                fontSize: 10,
                color: AppTheme.textGray,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ActionChip(
              avatar: Icon(
                role == 'admin' ? Icons.shield : Icons.person,
                size: 16,
                color: role == 'admin' ? Colors.white : AppTheme.primaryBlue,
              ),
              label: Text(
                role == 'admin' ? 'Admin' : 'Citizen',
                style: TextStyle(
                  color: role == 'admin' ? Colors.white : AppTheme.primaryBlue,
                  fontWeight: FontWeight.bold,
                ),
              ),
              backgroundColor: role == 'admin'
                  ? AppTheme.textDark
                  : AppTheme.backgroundLight,
              onPressed: onToggleRole,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
        ],
      ),
      body: role == 'admin' ? const AdminDashboard() : const HomeScreen(),
    );
  }
}
