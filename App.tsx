import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TamaguiProvider, TamaguiCustomConfig} from '@tamagui/core';

import {store} from './src/store/store';
import {navigationRef} from 'app/navigationRef';
import RootNavigator from './src/navigation/RootNavigator';
import {setCurrentRouteName} from './src/store/coreReducer';
import appConfig from './tamagui.config';

const rootStyles = {flex: 1};

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={rootStyles}>
      <StatusBar translucent barStyle="light-content" />
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={e => {
              const currentRouteName = e?.routes[e.index]?.name;
              store.dispatch(setCurrentRouteName(currentRouteName));
            }}>
            <TamaguiProvider config={appConfig as TamaguiCustomConfig}>
              <RootNavigator />
            </TamaguiProvider>
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
