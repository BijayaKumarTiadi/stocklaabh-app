# Project Restoration Guide

It seems the `android` and `ios` folders were "lost" (deleted). To restore the project, you must reset the `StockLaabh` folder.

## Step 1: Clean Up
1.  Close VS Code or any process using the folder.
2.  **Delete** the `StockLaabh` folder inside `SL_APP`.
    *   Path: `E:\Upwork\RST - BMPA - MobileApp\SL_APP\StockLaabh`

## Step 2: Re-Initialize
Open a terminal in `SL_APP` and run:

```bash
cd "E:\Upwork\RST - BMPA - MobileApp\SL_APP"
npx @react-native-community/cli init StockLaabh --version 0.76.6
```
(If asked to install `react-native`, say **y**).

## Step 3: Install Dependencies
```bash
cd StockLaabh
npm install react-native-webview
```

## Step 4: Let me know!
Once you have run the above commands, type **"I have re-initialized"** in the chat.
I will then:
1.  Restore your `App.js` (with the Logo and WebView).
2.  Restore the App Icon.
3.  Configure Android (Permissions, ProGuard, Signing).
4.  Configure iOS.

Please do this now so we can get back to building!
