import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import CognexScanner from './CognexScanner'

const { width, height } = Dimensions.get('window');

const SCREEN_WIDTH = width;

export default QrCodeScreen = ({ navigation }) => {
    const [showScanner, setShowScanner] = useState(true);
    //helper qrData for Showing on Page
    const [helperData, setHelperData] = useState({
        color: '',
        img: '',
        text: '',
        code: '',
    });

    useEffect(() => {
        navigation.addListener('blur', () => {
            setShowScanner(false);
          });
        const unsubscribe = navigation.addListener('focus', () => {
            setShowScanner(true);
          });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Icon.Button
                    name="arrow-back-outline"
                    size={30}
                    backgroundColor={TOOL_BAR}
                    onPress={() => onEndScan()}
                />
            ),
        });
    }, []);

    /** Callback for success on reading a QR */
    const onReadSuccess = (data) => {
        // first stop to show the scanner
        setShowScanner(false);
        if (data) {
            // the qr needs to be checked
            setHelperData({
                color: GREEN,
                img: 'checkmark-sharp',
                text: `QR text:  ${data}`,
                code: data,
            });
        }
    };

    const onNextScan = () => {
        setShowScanner(true);
        setHelperData({
            color: '',
            img: '',
            text: '',
            code: '',
        });
    };

    const onEndScan = () => {
        navigation.navigate('Home');
    };

    if (showScanner){
        return (<CognexScanner
            onBarCodeScanned={onReadSuccess}
            onClose={onEndScan}
        />);
    }

    if (helperData?.code) {
        return (
            <View style={styles.container}>
                <View style={styles.qrcont}>
                    <View style={[styles.scanbtn2]}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={[
                                    styles.content,
                                    { borderColor: helperData.color },
                                ]}>
                                <View style={styles.textst}>
                                    <Text style={{ textAlign: 'center', color: GRAY_TEXT }}>{helperData.text}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'center'}}>
                        </View>
                        <View style={styles.btnview}>
                            <TouchableOpacity
                                style={[
                                    styles.btnstyle,
                                    { backgroundColor: PURPLE, borderColor: PURPLE },
                                ]}
                                onPress={onEndScan}>
                                <Text
                                    style={{
                                        color: WHITE,
                                    }}>
                                    {'End scan'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnstyle} onPress={onNextScan}>
                                <Text
                                    style={{
                                        color: WHITE,
                                    }}>
                                    {'Next scan'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (<ActivityIndicator size="large" color="#b6b9bd" />);

};

const overlayColor = 'rgba(0,0,0,0.5)'; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.75; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = 'white';

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = '#22ff00';

const iconScanColor = 'white';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const BLUE = '#3296FF';
const GRAY_TEXT = '#898989';
const GRAY_ELEMNET = '#C4C4C4';
const DARK_BLUE = '#162650';
const TOOL_BAR = '#051C2C';
const ICON_FILL = '#5A5A5A';
const BUTTON_RPIMARY = '#3296FF';
const PURPLE = '#EF218C';
const RED = '#FF0000';
const GREY_ICON = '#051C2C';
const GREEN = 'green';
const YELLOW = '#FFA500';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    scanbtn: {
        flex: 0.35,
        borderWidth: 1,
        borderColor: GRAY_ELEMNET,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        padding: 10,
    },
    qrcodeimg: {
        width: '50%',
        height: 150,
        resizeMode: 'contain',
        flex: 1,
    },
    scanbtn2: {
        flex: 0.67,
        justifyContent: 'space-between',
    },
    content: {
        borderWidth: 1,
        borderColor: GREEN,
        borderRadius: 7,
        position: 'relative',
        minHeight: 100,
        marginTop: 40,
    },
    checkcont: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: GREEN,
        alignSelf: 'center',
        position: 'absolute',
        top: -25,
        backgroundColor: WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textst: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    boldText: {
        fontWeight: 'bold',
        color: BLACK,
      },
    btnstyle: {
        width: '46%',
        backgroundColor: BUTTON_RPIMARY,
        borderRadius: 10,
        borderColor: BUTTON_RPIMARY,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    qrcont: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    btnview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        position: 'relative',
        borderWidth: rectBorderWidth,
        borderColor: rectBorderColor,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    topOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        paddingBottom: SCREEN_WIDTH * 0.25,
    },

    leftAndRightOverlay: {
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
    },

    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: scanBarColor,
    },
});
