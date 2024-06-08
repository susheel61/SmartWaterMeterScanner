import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function BluetoothScanner() {
  const [devices, setDevices] = useState<any[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const bleManager = new BleManager();

  useEffect(() => {
    if (scanning) {
      startScan();
    } else {
      stopScan();
    }
  }, [scanning]);

  const startScan = async () => {
    try {
      const subscription = bleManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
              console.error('Error scanning:', error);
              return;
            }
            if (device) {
              handleDeviceFound(device);
            }
          });
          subscription.remove();
        }
      }, true);
    } catch (error) {
      console.error('Error scanning:', error);
    }
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
  };

  const handleDeviceFound = (device: any) => {
    console.log(device); // Log the device name
    // Check if the device is already in the array
    if (!devices.some((d) => d.id === device.id)) {
      setDevices((prevDevices) => [...prevDevices, device]);
    }
  };
  
  const toggleScan = () => {
    setDevices([]);
    setScanning((prevScanning) => !prevScanning);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title={scanning ? 'Stop Scan' : 'Start Scan'} onPress={toggleScan} />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={devices}
          renderItem={({ item }) => <Text style={styles.deviceText}>{item.name}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Set background to black
  },
  buttonContainer: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
  },
  deviceText: {
    color: '#FFFFFF', // Set text color to white
  },
});
