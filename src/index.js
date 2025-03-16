import React, { useState } from "react";
import {BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";
import ReactDOM from "react-dom";
import _ from "lodash"

import "./styles.css";



function App() {
  const [result, setResult] = useState(null);

  /**
     * Checks if the Google Barcode Scanner module is installed.
     *
     * This function uses the Capacitor Barcode Scanner plugin to check if the Google Barcode Scanner module is available.
     *
     * @async
     * @function isGoogleBarcodeScannerModuleInstalled
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the Google Barcode Scanner module is available.
     * @throws Will log an error message if the check fails.
     */
const isGoogleBarcodeScannerModuleInstalled = async () =>{
  try {
      const status = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      return status.available;
  } catch (e) {
      console.info("Error checking google barcode scanner module installation status", e);
      return false;
  }
}

/**
* Installs the Google Barcode Scanner module.
*
* This function uses the Capacitor Barcode Scanner plugin to install the Google Barcode Scanner module.
* It also listens for the installation progress and logs the progress state and percentage.
*
* @async
* @function installGoogleBarcodeScannerModule
* @returns {Promise<void>} A promise that resolves when the installation is complete.
* @throws Will log an error message if the installation fails.
*/
const installGoogleBarcodeScannerModule = async () => {
  try {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
      BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (info) => {
          console.info('googleBarcodeScannerModuleInstallProgress', info.state, info.progress);
      });
  } catch (e) {
      console.info("Error installing google barcode scanner module", e);
  }
}

const handleScanClick = async () => {
  try {
      const ScanResult = await scan()
      setResult(ScanResult);
      if (!ScanResult) {
          throw new Error('No barcode found');
      }
  } catch (error) {
      console.error('Error during barcode scan', error);
  }
}

/**
* Scans a barcode using the Google Barcode Scanner module.
*
* This function checks if the Google Barcode Scanner module is installed.
* If installed, it scans the barcode and returns the result.
* If not installed, it installs the module.
*
* @async
* @function scan
* @returns {Promise<string|undefined>} The scanned barcode result or undefined if an error occurs.
* @throws Will log an error message if the scan or installation fails.
*/
const scan = async () => {
  try {
      // Check if the Google Barcode Scanner module is installed
      if (await isGoogleBarcodeScannerModuleInstalled()) {
          // Scan the barcode and return the result
          const { barcodes } = await BarcodeScanner.scan();
          const result = _.chain(barcodes).first().get('displayValue').value()
          return result;
      } else {
          // Install the Google Barcode Scanner module if not available
          await installGoogleBarcodeScannerModule();
      }
  } catch (error) {
      console.error('Error during barcode scan', error);
  }
}

  

  return (
    <div className="App">
      <p>{result}</p>
      <button onClick={handleScanClick}>scan</button>
      
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
