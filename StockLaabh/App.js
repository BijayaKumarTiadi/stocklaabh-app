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
    Image,
    Modal,
    TouchableOpacity,
    Alert
} from 'react-native';
import { WebView } from 'react-native-webview';

const TARGET_URL = 'https://stocklaabh.bmpa.org/';
const DOWNLOAD_URL = 'https://stocklaabh.bmpa.org/download/app';
const VERSION_CHECK_URL = 'https://stocklaabh.bmpa.org/mobile-version.json';
const CURRENT_APP_VERSION = 1.1; // Increment this integer for future releases (1, 2, 3...)

const App = () => {
    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        checkForUpdate();
        // ... existing back handler code ...
        const onBackPress = () => {
            if (canGoBack && webViewRef.current) {
                webViewRef.current.goBack();
                return true;
            }
            return false;
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

    const checkForUpdate = async () => {
        try {
            // The JSON file on server should look like: { "version": 2 }
            const response = await fetch(VERSION_CHECK_URL, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const data = await response.json();

            if (data.version > CURRENT_APP_VERSION) {
                setShowUpdateModal(true);
            }
        } catch (error) {
            console.log("Update check failed (silent failure):", error);
        }
    };

    const handleUpdatePress = () => {
        Linking.openURL(DOWNLOAD_URL);
    };

    // Handle Loading State
    const handleLoadStart = () => setLoading(true);
    const handleLoadEnd = () => setLoading(false);

    // Handle Navigation State
    const handleNavigationStateChange = (navState) => {
        setCanGoBack(navState.canGoBack);
        if (!navState.loading) {
            setLoading(false);
        }
    };

    // Improved Download/External Link Support
    const onShouldStartLoadWithRequest = (request) => {
        const { url } = request;

        if (
            url.startsWith('tel:') ||
            url.startsWith('mailto:') ||
            url.startsWith('whatsapp:')
        ) {
            Linking.openURL(url);
            return false;
        }

        const downloadRegex = /\.(pdf|zip|xlsx|csv|doc|docx|png|jpg|jpeg)($|\?)/i;
        if (downloadRegex.test(url)) {
            Linking.openURL(url);
            return false;
        }

        return true;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="default" backgroundColor="#000" />

            <WebView
                ref={webViewRef}
                source={{ uri: TARGET_URL }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                sharedCookiesEnabled={true}
                thirdPartyCookiesEnabled={true}
                onNavigationStateChange={handleNavigationStateChange}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                allowFileAccess={true}
                allowFileAccessFromFileURLs={true}
                allowUniversalAccessFromFileURLs={true}
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

            {loading && (
                <View style={styles.loaderOverlay}>
                    <Image
                        source={require('./assets/logo.png')}
                        style={{ width: 80, height: 80, marginBottom: 20, resizeMode: 'contain' }}
                    />
                    <ActivityIndicator size="large" color="#1E90FF" />
                </View>
            )}

            {/* Update Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showUpdateModal}
                onRequestClose={() => setShowUpdateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('./assets/logo.png')}
                                style={{ width: 60, height: 60, resizeMode: 'contain' }}
                            />
                        </View>
                        <Text style={styles.modalTitle}>Update Available!</Text>
                        <Text style={styles.modalText}>
                            A new version of StockLaabh is available with improved features.
                        </Text>

                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleUpdatePress}
                        >
                            <Text style={styles.updateButtonText}>Update Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowUpdateModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 100,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#000',
        fontWeight: '600'
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 10, // Shadow for Android
        shadowColor: '#000', // Shadow for server
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    iconContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 10,
    },
    cancelButtonText: {
        color: '#999',
        fontSize: 16,
    }
});

export default App;
