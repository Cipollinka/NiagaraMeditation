import React, {useCallback, useEffect, useRef} from 'react';
import {PanResponder, StyleSheet, Animated, Dimensions} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View} from 'tamagui';
import {Pause, Play} from 'lucide-react-native';
import SoundPlayer from 'react-native-sound-player';
import dayjs from 'dayjs';

import Home from 'app/screens/home';
import Stats from 'app/screens/stats';
import Profile from 'app/screens/profile';
import Lobby from 'app/screens/preview';
import Favorites from 'app/screens/favorites';
import Onboarding from 'app/screens/onboarding';

import {navigate} from 'app/navigationRef';
import useInterval from 'app/hooks/useInterval';
import {
  setButtonYPosition,
  toggleIsPlaying,
  setPlayedTime,
} from 'app/store/coreReducer';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';

const currentDate = dayjs().format('YYYY-MM-DD');
const {height} = Dimensions.get('screen');
const Stack = createNativeStackNavigator();

function RootNavigator() {
  const dispatch = useAppDispatch();
  const {bottom} = useSafeAreaInsets();
  const defaultPosition = height - bottom - 250;
  const {
    hideWelcomeScreen,
    isPlaying,
    currentRouteName,
    playedTime = {},
    buttonYPosition = defaultPosition,
  } = useAppSelector(state => state.core);

  const lastPositionY = useRef(buttonYPosition);
  const pan = useRef(new Animated.ValueXY({x: 10, y: buttonYPosition})).current;

  const {pause, resume} = useInterval(() => {
    dispatch(
      setPlayedTime({
        id: currentDate,
        playedTime: (playedTime[currentDate] || 0) + 1,
      }),
    );
  }, 1000);

  useEffect(() => {
    if (isPlaying) {
      resume();
    } else {
      pause();
    }
  }, [isPlaying, pause, resume]);

  const playAndStopSound = useCallback(() => {
    if (isPlaying) {
      SoundPlayer.pause();
    } else {
      SoundPlayer.resume();
    }
    dispatch(toggleIsPlaying(!isPlaying));
  }, [dispatch, isPlaying]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        // Save the new Y position
        lastPositionY.current += gestureState.dy;
        dispatch(setButtonYPosition(lastPositionY.current));

        // Update the pan value to maintain the current position
        pan.setOffset({x: 0, y: lastPositionY.current});
        pan.setValue({x: 0, y: 0}); // Reset animated value to 0 for future drags
      },
    }),
  ).current;

  return (
    <>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={hideWelcomeScreen ? 'Home' : 'Onboarding'}>
        <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen name="Stats" component={Stats} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Favorites" component={Favorites} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
      </Stack.Navigator>

      {currentRouteName !== 'Onboarding' && (
        <Animated.View
          {...panResponder.panHandlers} // Attach the gesture handlers
          style={[
            styles.draggableBox,
            {transform: [{translateY: pan.y}]}, // Bind Y-axis to the pan value
          ]}>
          <View
            jc="center"
            bg={currentRouteName === 'Home' ? '#266B56' : '#fff'}
            w={46}
            h={46}
            br={23}
            ai="center"
            p={10}
            onPress={() => {
              navigate('Home');
            }}>
            <Svg width={24} height={24} fill="none">
              <Path
                stroke={currentRouteName === 'Home' ? '#fff' : '#266B56'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.235 2.374c-.368.152-.697.482-1.356 1.14-.659.66-.989.989-1.14 1.356a2 2 0 0 0 0 1.531c.151.368.48.697 1.14 1.356.658.659.988.989 1.356 1.14a2 2 0 0 0 1.53 0c.368-.151.697-.48 1.356-1.14.659-.66.988-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.152-.368-.48-.697-1.14-1.356-.66-.659-.988-.989-1.356-1.141a2 2 0 0 0-1.53 0ZM4.87 8.738c-.367.152-.697.481-1.355 1.14-.66.66-.989.989-1.141 1.356a2 2 0 0 0 0 1.531c.152.368.482.697 1.14 1.356.66.659.989.988 1.356 1.14a1.999 1.999 0 0 0 1.531 0c.368-.152.697-.481 1.356-1.14.659-.659.988-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.152-.368-.48-.698-1.14-1.357-.66-.659-.988-.988-1.356-1.14a2.003 2.003 0 0 0-1.531 0Zm11.373 1.14c-.659.66-.988.989-1.14 1.356a1.999 1.999 0 0 0 0 1.531c.152.368.481.697 1.14 1.356.659.659.989.988 1.356 1.14a2 2 0 0 0 1.53 0c.368-.152.698-.481 1.357-1.14.659-.659.987-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.153-.368-.481-.698-1.14-1.357-.66-.659-.989-.988-1.356-1.14a2 2 0 0 0-1.531 0c-.367.152-.697.481-1.356 1.14Zm-5.008 5.224c-.368.152-.697.482-1.356 1.14-.659.66-.989.989-1.14 1.357a2 2 0 0 0 0 1.53c.151.368.48.697 1.14 1.356.658.659.988.989 1.356 1.14a2 2 0 0 0 1.53 0c.368-.151.697-.48 1.356-1.14.659-.66.988-.988 1.14-1.356.203-.49.203-1.04 0-1.53-.152-.368-.48-.698-1.14-1.356-.659-.66-.988-.989-1.356-1.141a2 2 0 0 0-1.53 0Z"
              />
            </Svg>
          </View>

          <View
            jc="center"
            bg={currentRouteName === 'Favorites' ? '#266B56' : '#fff'}
            w={46}
            h={46}
            br={23}
            ai="center"
            p={10}
            onPress={() => navigate('Favorites')}>
            <Svg width={24} height={24} fill="none">
              <Path
                stroke={currentRouteName === 'Favorites' ? '#fff' : '#266B56'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0L5 21Z"
              />
            </Svg>
          </View>

          <View jc="center" p={10} ai="center" onPress={playAndStopSound}>
            {isPlaying ? (
              <Pause size={26} stroke="#266B56" />
            ) : (
              <Play size={26} stroke="#266B56" />
            )}
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  draggableBox: {
    position: 'absolute',
    right: 10,
    top: 40,
    gap: 7,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 60,
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
});

export default RootNavigator;
