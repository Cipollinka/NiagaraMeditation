import React, {useState, useCallback} from 'react';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import useKeyboard from '@rnhooks/keyboard';
import {useFocusEffect} from '@react-navigation/native';
import {XStack, Image, SizableText, View, Button, Input} from 'tamagui';

import {navigate} from 'app/navigationRef';
import {useAppDispatch} from 'app/store/hooks';
import {
  setCurrentRouteName,
  setHideWelcomeScreen,
  setUserInfo,
} from 'app/store/coreReducer';

const {width} = Dimensions.get('screen');

const Onboarding: React.FC = () => {
  const dispatch = useAppDispatch();
  const [visible] = useKeyboard();
  const [name, setName] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useFocusEffect(
    useCallback(() => {
      dispatch(setCurrentRouteName('Onboarding'));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const goToHome = () => {
    dispatch(setUserInfo({name, createdAt: new Date().toISOString()}));
    navigate('Home');
    dispatch(setHideWelcomeScreen(true));
  };

  return (
    <TouchableOpacity
      style={styles.root}
      activeOpacity={1}
      onPress={Keyboard.dismiss}>
      <ImageBackground
        style={styles.root}
        source={require('app/assets/images/bg.png')}>
        <KeyboardAvoidingView style={styles.root} behavior="padding">
          <View h="100%" f={1} jc="flex-end">
            <View
              bg="#fff"
              borderTopLeftRadius={16}
              borderTopRightRadius={16}
              height={visible ? '86%' : '60%'}
              pt={20}
              gap={20}>
              <XStack ai="center" jc="center" mt={-90}>
                <Image source={require('app/assets/images/logo.png')} />
              </XStack>
              <SizableText
                mt={10}
                lh={34}
                fow="700"
                ta="center"
                fos={34}
                mb={10}
                col="#02151C">
                {activeStep === 0
                  ? 'Welcome to Niagara Meditation'
                  : 'How should we call you?'}
              </SizableText>
              <SizableText
                lh={20}
                fow="700"
                ta="center"
                fos={width <= 375 ? 16 : 20}
                px={50}
                col="#21483D">
                {activeStep === 0
                  ? `Your serene escape to the calming sounds of the Niagara Falls. Let
            the power of water help you relax, de-stress, and find inner peace.`
                  : 'Please enter your nickname below.'}
              </SizableText>

              {activeStep === 1 && (
                <Input
                  h={60}
                  br={30}
                  col="#02151C"
                  borderColor="#428772"
                  bg="#fff"
                  mx="10%"
                  onChangeText={text => setName(text)}
                  value={name}
                  placeholderTextColor="#B9B9B9"
                  placeholder="Nickname example"
                />
              )}

              <XStack
                w="100%"
                mt={width <= 375 ? 0 : 10}
                mb={width <= 375 ? 0 : 20}
                px={20}>
                <Button
                  br={50}
                  h={60}
                  bg="#428772"
                  w="100%"
                  disabledStyle={{
                    opacity: 0.5,
                  }}
                  disabled={activeStep === 1 && !name.length}
                  onPress={() => {
                    if (activeStep === 0) {
                      setActiveStep(1);
                    } else {
                      goToHome();
                    }
                  }}>
                  <SizableText fos={20} ta="center" f={2} lh={20} col="#fff">
                    {activeStep === 0 ? 'Next' : 'Start!'}
                  </SizableText>
                </Button>
              </XStack>

              <XStack jc="center" gap={12}>
                <View
                  w={16}
                  h={16}
                  br={8}
                  bg="#428772"
                  opacity={activeStep === 0 ? 1 : 0.5}
                />
                <View
                  w={16}
                  h={16}
                  br={8}
                  bg="#428772"
                  opacity={activeStep === 1 ? 1 : 0.5}
                />
              </XStack>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Onboarding;
