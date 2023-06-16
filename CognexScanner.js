import React, {useEffect, useState} from 'react';
import {
  NativeEventEmitter,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import {useRecoilValue} from 'recoil';
import {CMBReader, cmb} from 'cmbsdk-react-native';
import {globaAppState} from './RecoilState';

export default CognexScanner = ({onBarCodeScanned, onClose}) => {
  const {changeToActive} = useRecoilValue(globaAppState);
  const [scannerState, setScannerState] = useState({
    isScanning: false,
    connected: false,
    results: [],
  });

  // set up the lister for the QR being readed
  useEffect(() => {

    const cmbEventEmitter = new NativeEventEmitter(cmb);
    const resultListner = cmbEventEmitter.addListener(
      CMBReader.EVENT.ReadResultReceived,
      results => {
        const data = results?.readResults[0]?.readString;
        data ? onBarCodeScanned(data) : onClose();
      },
    );
    const connectionListner = cmbEventEmitter.addListener(
      CMBReader.EVENT.ConnectionStateChanged,
      connectionState => {
        connectionStateChanged(connectionState);
      },
    );
    return () => {
      resultListner.remove();
      connectionListner.remove();
    };
  }, [onBarCodeScanned, onClose, changeToActive]);

  // set up the camera as the reader device
  useEffect(() => {
    createReaderDevice();
    return () => {
      cmb.stopScanning();
    };
  }, [onBarCodeScanned, onClose, changeToActive]);

  function createReaderDevice() {
    if (scannerState.connected == CMBReader.CONNECTION_STATE.Connected) {
      cmb.disconnect();
    }

    cmb.setCameraMode(CMBReader.CAMERA_MODE.NoAimer);
    if (Platform.OS === 'ios') {
      cmb.setPreviewContainerBelowStatusBar(true);
      cmb.setPreviewContainerPositionAndSize([0,0,100,100]);
    } else {
      cmb.setPreviewContainerFullScreen().then(result => {
        console.log('ok setPreviewContainerFullScreen:', result);
      }).catch(problem => {
        console.log('fail setPreviewContainerFullScreen:', problem);
      });
    }

    cmb.loadScanner(CMBReader.DEVICE_TYPE.Camera).then(response => {
      connectToReaderDevice();
    });
  }

  // Before the self.readerDevice can be configured or used, a connection needs to be established
  function connectToReaderDevice() {
    cmb
      .getAvailability()
      .then(response => {
        if (response == CMBReader.AVAILABILITY.Available) {
          cmb
            .connect()
            .then(connectMethodResult => {})
            .catch(failure => {
              console.log(
                'CMB - connectReader failed: ' + JSON.stringify(failure),
              );
            });
        }
      })
      .catch(rejecter => {
        console.log(
          'CMB - getAvailability failed: ' + JSON.stringify(rejecter),
        );
      });
  }

  // This is called when a connection with the Camera has been changed.
  // The self.readerDevice is usable only in the "CMBReader.CONNECTION_STATE.Connected" state
  function connectionStateChanged(connectionState) {
    setScannerState(prev => ({
      ...prev,
      connected: connectionState == CMBReader.CONNECTION_STATE.Connected,
    }));

    if (connectionState == CMBReader.CONNECTION_STATE.Connected) {
      configureReaderDevice();
    }
  }

  function configureReaderDevice() {
    //----------------------------------------------
    // Explicitly enable the QR symbols to be scanned
    cmb.setSymbology(CMBReader.SYMBOLOGY.QR, true, CMBReader.SYMBOLOGY_NAME.QR);

    //---------------------------------------------------------------------------
    // We are going to explicitly turn off image results (although this is the
    // default). The reason is that enabling image results with an MX-1xxx
    // scanner is not recommended unless your application needs the scanned
    // image--otherwise scanning performance can be impacted.
    //---------------------------------------------------------------------------
    cmb
      .enableImage(false)
      .then(resolve => {})
      .catch(failure => {
        console.log('CMB - enableImage failed: ' + JSON.stringify(failure));
      });

    cmb
      .enableImageGraphics(false)
      .then(resolve => {})
      .catch(failure => {
        console.log(
          'CMB - enableImageGraphics failed: ' + JSON.stringify(failure),
        );
      });

    // Do not interrupt scan if application rotates
    cmb.setStopScannerOnRotate(false);
    // For Phone/tablet set the SDK's decoding effort to level 3
    cmb.sendCommand('SET DECODER.EFFORT 3', 'DECODER.EFFORT');
    setTimeout(() => {
      cmb.startScanning().then((resolver) => {
        setScannerState(prev => ({
          ...prev,
          isScanning: true,
        }));
      }).catch((rejecter) => {
        setScannerState(prev => ({
          ...prev,
          isScanning: false,
        }));
      });
      
    }, 20);
  }

  return (
    <View
      style={styles.container}>
      <ActivityIndicator size="large" color="#b6b9bd" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});