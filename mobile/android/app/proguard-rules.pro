# Flutter-specific ProGuard rules
-keep class io.flutter.** { *; }
-keep class io.flutter.embedding.** { *; }

# Keep annotations
-keepattributes *Annotation*

# Keep http library classes
-keep class org.apache.http.** { *; }
-dontwarn org.apache.http.**

# Keep Gson / JSON serialization
-keepattributes Signature

# Suppress warnings for unused libraries
-dontwarn kotlin.**
-dontwarn kotlinx.**

# --- Fix R8 missing Play Store deferred component classes ---
# These are referenced by Flutter engine but not needed for direct APK distribution
-dontwarn com.google.android.play.core.**
-keep class com.google.android.play.core.splitcompat.** { *; }
-keep class com.google.android.play.core.splitinstall.** { *; }
-keep class com.google.android.play.core.tasks.** { *; }
