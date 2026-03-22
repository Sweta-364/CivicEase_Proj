import 'package:flutter_test/flutter_test.dart';
import 'package:civic_ease_mobile/main.dart';

void main() {
  testWidgets('App renders correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const CivicEaseApp());
    // Verify that the app title is shown
    expect(find.text('CivicEase'), findsWidgets);
  });
}
