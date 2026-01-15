# StockLaabh - iOS Build Instructons

**IMPORTANT:** Building an iOS App (`.ipa` or attempting to run it) **requires a Mac** with Xcode installed. You cannot build the iOS app directly on Windows.

I have already configured the **iOS source code** in this project with:
1.  **Permissions**: Camera and Photo Library access enabled (for file uploads).
2.  **Orientation**: Locked to Portrait mode.
3.  **App Name**: Set to "StockLaabh".

## How to Build (If you have a Mac)

1.  **Transfer the Project**: Move this entire `StockLaabh` folder to your Mac (via git, zip, or drive).
2.  **Install Dependencies**:
    Open Terminal on Mac and run:
    ```bash
    cd StockLaabh
    npm install
    cd ios
    pod install
    ```
    
3.  **Open in Xcode**:
    *   Open `StockLaabh/ios/StockLaabh.xcworkspace` in Xcode.
4.  **Set App Icon**:
    *   In Xcode, click on the **Assets** folder (blue folder icon).
    *   Select **AppIcon**.
    *   Drag and drop your `logo.png` (or generated sizes) into the slots.
5.  **Run/Build**:
    *   Select a Simulator and press **Play** to test.
    *   Go to **Product > Archive** to build the version for the App Store.

## Alternative (If you don't have a Mac)
If you only have Windows, you have two options:
1.  **Use a Cloud Mac**: Services like **MacinCloud** allow you to rent a Mac remotely.
2.  **Use Expo Application Services (EAS)**:
    *   This requires converting your app to use Expo (Managed Workflow), which handles the build in the cloud.
    *   *Note*: Since we used `react-native init` (Bare Workflow), this migration takes some effort.

For now, your project code acts as a "Universal" React Native app. The logic in `App.js` will work 100% on iOS as soon as it is built on a Mac.
