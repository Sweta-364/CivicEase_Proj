# CivicEase Mobile App (Flutter)

This is the mobile version of the CivicEase platform, built with Flutter. It shares the same backend as the web application.

## Features
- **Role Toggle**: Easily switch between Citizen and Admin roles.
- **Citizen Experience**:
  - View a list of your reported complaints.
  - Report new issues with photo evidence.
  - Track status updates (Pending, Working, Solved).
- **Admin experience**:
  - View all reported tickets.
  - Update ticket status (Working, Invalid, Solved).
  - Upload proof of resolution.

## Setup Instructions

1.  **Prerequisites**:
    - Flutter SDK installed.
    - Android Studio / VS Code with Flutter extension.
    - The backend server must be running at `http://localhost:8000`.

2.  **Installation**:
    ```bash
    cd mobile
    flutter pub get
    ```

3.  **Backend Connectivity**:
    - The app is configured to use `http://10.0.2.2:8000` for Android Emulators.
    - If running on a physical device, update `baseUrl` in `lib/services/api_service.dart` to your computer's local IP address (e.g., `http://192.168.1.5:8000`).

4.  **Running the App**:
    ```bash
    flutter run
    ```

## Technology Stack
- **Framework**: Flutter (Dart)
- **State Management**: StatefulWidget (Simple & Effective)
- **API Communication**: `http` package
- **Image Handling**: `image_picker`
- **Networking**: `multipart/form-data` for file uploads
