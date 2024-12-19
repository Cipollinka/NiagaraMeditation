import React from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {XStack, View, YStack, Input, SizableText, Button} from 'tamagui';

import {setUserInfo} from 'app/store/coreReducer';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState('');
  const [isEditMode, setIsEditMode] = React.useState(false);

  const {userInfo, playedTime = {}} = useAppSelector(state => state.core);

  const totalPlayedTime = Object.values(playedTime).reduce(
    (acc, cur) => acc + cur,
    0,
  );
  const totalTime = Number(totalPlayedTime / 60 / 60).toFixed(2);

  return (
    <YStack bg="#418F75" f={1}>
      <SafeAreaView>
        <YStack py={10} gap={20}>
          <YStack jc="center" ai="center" gap={10}>
            <View w={120} h={120} br={60} bg="#266B56" jc="center" ai="center">
              <SizableText fos={75} lh={80}>
                {userInfo?.name.charAt(0).toUpperCase()}
              </SizableText>
            </View>

            {isEditMode ? (
              <YStack w="100%" mt={20}>
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

                <XStack w="100%" mt={10} mb={20} px="10%">
                  <Button
                    br={50}
                    h={60}
                    bg="#fff"
                    w="100%"
                    disabledStyle={{
                      opacity: 0.5,
                    }}
                    disabled={!name.length}
                    onPress={() => {
                      dispatch(setUserInfo({name}));
                      setIsEditMode(false);
                    }}>
                    <SizableText
                      fos={20}
                      ta="center"
                      f={2}
                      lh={20}
                      col="#428772">
                      Save
                    </SizableText>
                  </Button>
                </XStack>
              </YStack>
            ) : (
              <YStack>
                <SizableText ta="center" fos={22} lh={26} fow={400}>
                  {userInfo?.name}
                </SizableText>

                <TouchableOpacity
                  onPress={() => {
                    setIsEditMode(true);
                    setName(userInfo?.name ?? '');
                  }}>
                  <SizableText mt={6} fos={14} lh={16} fow={400}>
                    change nickname
                  </SizableText>
                </TouchableOpacity>
              </YStack>
            )}
          </YStack>

          {!isEditMode && (
            <YStack
              jc="center"
              ai="center"
              gap={14}
              br={16}
              p={17}
              mx={20}
              bg="#266B56">
              <SizableText fos={14} lh={16} fow={400}>
                Total meditated:
              </SizableText>
              <SizableText fos={28} lh={32} fow={400}>
                {totalTime} HOUR{Number(totalTime) > 1 ? 'S' : ''}
              </SizableText>
            </YStack>
          )}
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default ProfileScreen;
