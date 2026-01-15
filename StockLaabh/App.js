import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    View,
    BackHandler,
    Platform,
    StatusBar,
    Linking,
    Text,
    Image
} from 'react-native';
import { WebView } from 'react-native-webview';

const TARGET_URL = 'https://stocklaabh.bmpa.org/';

const App = () => {
    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [loading, setLoading] = useState(true);

    // Handle hardware back button
    useEffect(() => {
        const onBackPress = () => {
            if (canGoBack && webViewRef.current) {
                webViewRef.current.goBack();
                return true; // Handle event
            }
            return false; // Exit app
        };

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
        }

        return () => {
            if (Platform.OS === 'android') {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            }
        };
    }, [canGoBack]);


    // Handle Loading State
    const handleLoadStart = () => setLoading(true);
    const handleLoadEnd = () => setLoading(false);

    // Handle Navigation State
    const handleNavigationStateChange = (navState) => {
        setCanGoBack(navState.canGoBack);
        // Force hide loader if the page claims it isn't loading anymore
        if (!navState.loading) {
            setLoading(false);
        }
    };

    // Improved Download/External Link Support
    const onShouldStartLoadWithRequest = (request) => {
        const { url } = request;

        // Open common external schemes in system apps
        if (
            url.startsWith('tel:') ||
            url.startsWith('mailto:') ||
            url.startsWith('whatsapp:')
        ) {
            Linking.openURL(url);
            return false;
        }

        // Handle Downloads (basic detection by extension)
        // For more robust handling, native download manager integration is recommended
        // Handle Downloads (basic detection by extension)
        // Checks for common file extensions, ignoring query parameters (e.g. file.pdf?token=...)
        const downloadRegex = /\.(pdf|zip|xlsx|csv|doc|docx|png|jpg|jpeg)($|\?)/i;
        if (downloadRegex.test(url)) {
            Linking.openURL(url);
            return false; // Let the system handle the download via external app
        }

        // Allow normal navigation within the WebView
        return true;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="default" backgroundColor="#000" />

            <WebView
                ref={webViewRef}
                source={{ uri: TARGET_URL }}
                style={styles.webview}

                // Configuration
                javaScriptEnabled={true}
                domStorageEnabled={true}
                sharedCookiesEnabled={true} // Handle cookies
                thirdPartyCookiesEnabled={true}

                // Navigation & Events
                onNavigationStateChange={handleNavigationStateChange}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}

                // File Upload Support
                allowFileAccess={true}
                allowFileAccessFromFileURLs={true}
                allowUniversalAccessFromFileURLs={true}

                // User Interface
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loaderContainer}>
                        <Image
                            source={require('./assets/logo.png')}
                            style={{ width: 100, height: 100, marginBottom: 20, resizeMode: 'contain' }}
                        />
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.loadingText}>Loading StockLaabh...</Text>
                    </View>
                )}
            />

            {/* Floating Loader (Overlay) - Optional extra visual if needed */}
            {loading && (
                <View style={styles.loaderOverlay}>
                    <Image
                        source={require('./assets/logo.png')}
                        style={{ width: 80, height: 80, marginBottom: 20, resizeMode: 'contain' }}
                    />
                    <ActivityIndicator size="large" color="#1E90FF" />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
    },
    loaderContainer: {
        position: 'absolute', // Center within WebView
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loaderOverlay: {
        position: 'absolute', // Overlay on top of everything
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent
        zIndex: 100,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#000',
        fontWeight: '600'
    }
});

export default App;
