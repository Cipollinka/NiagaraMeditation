import React, {useMemo} from 'react';
import {SafeAreaView, FlatList} from 'react-native';
import {XStack, Button, View, Image, YStack, SizableText} from 'tamagui';
import Svg, {Path} from 'react-native-svg';
import {House} from 'lucide-react-native';

import data from 'app/assets/data';
import Card from 'app/components/card';
import {navigate} from 'app/navigationRef';
import {useAppSelector} from 'app/store/hooks';

const Favorites: React.FC = () => {
  const {favorites = []} = useAppSelector(state => state.core);

  const filteredData = useMemo(() => {
    return data.filter(item => favorites.includes(item.id));
  }, [favorites]);

  return (
    <YStack bg="#418F75" f={1}>
      <Image source={require('../../assets/images/bg.png')} style={{flex:1, width:'100%', height:'100%', position:'absolute'}} />
      {/*<View style={{position:'absolute', flex: 1, width: '100%', height:'100%', backgroundColor: '#fff', opacity:'0.5'}} />*/}
      <SafeAreaView>
        <XStack jc="space-between" ai="center" gap={20} px={20}>
          <View
            bg="#fff"
            w={44}
            jc="center"
            ai="center"
            h={44}
            br={22}
            onPress={() => navigate('Home')}>
            <House size={24} stroke="#266B56" />
          </View>
          <Image source={require('app/assets/images/logo.png')} />
          <View
            bg="#fff"
            jc="center"
            ai="center"
            w={44}
            h={44}
            br={22}
            onPress={() => navigate('Profile')}>
            <Svg width={24} height={24} fill="none">
              <Path
                stroke="#266B56"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
              />
              <Path
                stroke="#266B56"
                strokeWidth={2}
                d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
            </Svg>
          </View>
        </XStack>
        <YStack px={20} mt={20} mb={10}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredData}
            ListHeaderComponent={
              filteredData.length > 0 ? (
                <SizableText mb={10} fos={20} col={'#fff'}>
                  Saved:
                </SizableText>
              ) : null
            }
            renderItem={({item}) => <Card {...item} isFromFavorites />}
            ListFooterComponent={
              <XStack w="100%" mt={10} mb={20} px={20}>
                <Button
                  br={50}
                  h={60}
                  bg="#fff"
                  w="100%"
                  onPress={() => navigate('Home')}>
                  <SizableText fos={20} ta="center" f={2} lh={20} col="#418F75">
                    Start meditation
                  </SizableText>
                </Button>
              </XStack>
            }
            ListEmptyComponent={
              <XStack w="100%" mt={10} mb={20} px={20}>
                <SizableText fos={16} ta="center" f={2} lh={20} mb={10} col={'#fff'}>
                  You haven't favorited any meditations yet
                </SizableText>
              </XStack>
            }
          />
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default Favorites;
