/// Centralized app configuration.
/// The API base URL is injected at build time via --dart-define.
///
/// Build commands:
///   Dev (local):     flutter run
///   Production APK:  flutter build apk --dart-define=API_BASE_URL=https://your-backend.onrender.com
///   Production Web:  flutter build web --dart-define=API_BASE_URL=https://your-backend.onrender.com
class AppConfig {
  // Read from compile-time dart-define, fallback to localhost for dev
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8000',
  );
}
