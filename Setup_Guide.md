# StockLaabh - React Native WebView Wrapper

## 1. Project Setup
Run the following commands in your terminal to initialize the project and install dependencies.
Note: Ensure you have Node.js, JDK 17, and Android Studio installed.

```bash
# Initialize the React Native project
npx @react-native-community/cli init StockLaabh --version 0.76.6

# Navigate to the project directory
cd StockLaabh

# Install required dependencies
npm install react-native-webview
```

## 2. Configuration Steps

### A. App Implementation
Replace the generated `App.tsx` (or `App.js`) in your project with the `App.js` file provided in this folder.

### B. Android Manifest Configuration
Open `android/app/src/main/AndroidManifest.xml` and make the following changes:

1.  **Permissions**: Add these lines inside the `<manifest>` tag, above `<application>`:
    ```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.ACCESS_DOWNLOAD_MANAGER" />
    ```

2.  **Lock Orientation**: Find the `<activity>` tag (usually `.MainActivity`) and add/update `android:screenOrientation`:
    ```xml
    <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|uiMode|screenSize|smallestScreenSize"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true"
        android:screenOrientation="portrait"> <!-- Add this line -->
    ```

### C. App Icon & Name
1.  **App Name**: Open `android/app/src/main/res/values/strings.xml` and change:
    ```xml
    <string name="app_name">StockLaabh</string>
    ```
2.  **Icon**: Place the generated `stocklaabh_app_icon.png` in the `android/app/src/main/res/mipmap-xxhdpi/` folder (rename it to `ic_launcher.png` and `ic_launcher_round.png` if you want a quick fix, or use Android Studio's **Image Asset Studio** by right-clicking `res` folder > New > Image Asset for proper scaling).

### D. Splash Screen
To customize the launch screen:
1.  Edit `android/app/src/main/res/drawable/rn_edit_text_material.xml` (or `launch_background.xml` if present).
2.  Or simplified: Replace `android:windowBackground` handling in styles, or just rely on the lightweight JS loading screen included in `App.js`.
    For a native splash, open `android/app/src/main/res/drawable/launch_background.xml` and add your logo:
    ```xml
    <layer-list xmlns:android="http://schemas.android.com/apk/res/android">
        <item android:drawable="@color/white" /> <!-- Background Color -->
        <item>
            <bitmap
                android:gravity="center"
                android:src="@mipmap/ic_launcher" /> <!-- Your Logo -->
        </item>
    </layer-list>
    ```

## 3. Build & Run
```bash
# Start Metro Bundler
npm start

# In a new terminal, build and run on Android text
npm run android
```

## 4. Generate APK (Release)
1.  **Generate Keystore (if not exists)**:
    ```bash
    keytool -genkeypair -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
    ```
    Place this file in `android/app/`.
2.  **Configure basic gradle**: (For testing, you can build a debug APK without signing).
    To build a debug APK:
    ```bash
    cd android
    ./gradlew assembleDebug
    ```
    Output: `android/app/build/outputs/apk/debug/app-debug.apk`

    To build a release APK (requires signing config in `build.gradle`):
    ```bash
    cd android
    ./gradlew assembleRelease
    ```
