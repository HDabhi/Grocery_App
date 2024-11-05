import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices, PhotoFile, CameraPermissionStatus, useCameraDevice } from 'react-native-vision-camera';

interface CameraScreenProps {
  onCapture: (photo: PhotoFile) => void;  // Callback function prop
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onCapture }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState<boolean>(false);
  const cameraRef = useRef<Camera | null>(null);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined')

 
  const device = useCameraDevice('back') // Use back camera

  useEffect(() => {
    requestCameraPermission()
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission()
    if (permission === 'denied') {
      Alert.alert(
        'Camera Permission Denied',
        'Please enable camera permissions in your device settings.',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel', style: 'cancel' },
        ]
      )
    }
    setCameraPermissionStatus(permission)
  }, [])

  const takePhoto = async (): Promise<void> => {
    if (cameraRef.current && isCameraInitialized) {
      try {
        const photo: PhotoFile = await cameraRef.current.takePhoto({
          flash: 'off', // Options: 'off', 'on', 'auto'
        });

        // Call the onCapture callback with the captured photo
        onCapture(photo);
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {device != null && cameraPermissionStatus === 'granted' ? (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          device={device}
          isActive={true}
          photo={true}
          onInitialized={() => setIsCameraInitialized(true)}
        />
      ) : (
        <Text>No Camera Permission</Text>
      )}

      <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
        <Text style={styles.captureText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  captureText: {
    fontSize: 18,
    color: '#000',
  },
});

