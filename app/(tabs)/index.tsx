import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
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
          console.log("I am inside power on");
          bleManager.startDeviceScan(null, null, (error, device) => {
            console.log("scanning started....");
            if (error) {
              console.error('Error scanning:', error);
              return;
            }
            if (device) {
              console.log(device.name);
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
    console.log('Found device:', device.name); // Log the device name
    setDevices((prevDevices) => [...prevDevices, device]);
  };
  

  const toggleScan = () => {
    setDevices([]);
    setScanning((prevScanning) => !prevScanning);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={scanning ? 'Stop Scan' : 'Start Scan'} onPress={toggleScan} />
      {devices.map((device, index) => (
        <Text key={index}>{device.name}</Text>
      ))}
    </View>
    
  );
}
