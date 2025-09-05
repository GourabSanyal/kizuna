import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { Alert, Platform } from 'react-native';

// development error logging
const logErrorToDev = (error: Error, isFatal?: boolean) => {
  if (__DEV__) {
    console.error(`${isFatal ? 'FATAL:' : ''} ${error.name} - ${error.message}`);
    console.error('Stack trace:', error.stack);
  }
};

// send to server - production error logging
const logErrorToProduction = (error: Error, isFatal?: boolean) => {
  // TODO: Implement production logging service
};

const showError = (error: Error, isFatal?: boolean) => {
  if (__DEV__) {
    Alert.alert(
      isFatal ? 'Fatal Error' : 'Error',
      `${error.name}: ${error.message}\n\nCheck your dev console for more details.`,
      [{ text: 'OK' }]
    );
  } else {
    Alert.alert(
      'Unexpected Error',
      'An error occurred. Please try again or contact support if the problem persists.',
      [{ text: 'OK' }]
    );
  }
};

export const initializeErrorHandling = () => {
  // handle js errors
  setJSExceptionHandler((error, isFatal) => {
    logErrorToDev(error, isFatal);
    if (!__DEV__) {
      logErrorToProduction(error, isFatal);
    }
    
    // this shows the error to the user
    showError(error, isFatal);
  }, true);

  // native errors
  setNativeExceptionHandler(
    (errorString) => {
      const error = new Error(errorString);
      
      if (__DEV__) {
        logErrorToDev(error, true);
      } else {
        logErrorToProduction(error, true);
      }
    },
    false, // Don't force app to quit on native error
    true // Should generate crash log
  );
};

export const logError = (error: Error, isFatal = false) => {
  logErrorToDev(error, isFatal);
  if (!__DEV__) {
    logErrorToProduction(error, isFatal);
  }
  showError(error, isFatal);
};

