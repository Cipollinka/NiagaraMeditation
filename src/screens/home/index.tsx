import React from 'react';
import {SafeAreaView, FlatList} from 'react-native';
import {XStack, Image, YStack, SizableText, View} from 'tamagui';
import Svg, {Path} from 'react-native-svg';

import data from 'app/assets/data';
import Card from 'app/components/card';
import {navigate} from 'app/navigationRef';

const Home: React.FC = () => {
  return (
    <YStack bg="#418F75" f={1}>
      <SafeAreaView>
        <XStack jc="space-between" ai="center" gap={20} px={20}>
          <View
            bg="#fff"
            w={44}
            jc="center"
            ai="center"
            h={44}
            br={22}
            onPress={() => navigate('Stats')}>
            <Svg width={24} height={24} fill="none">
              <Path
                fill="#266B56"
                d="M2.625 19.875V2.25H.75v18a1.86 1.86 0 0 0 1.83 1.5h20.67v-1.875H2.625Z"
              />
              <Path
                fill="#266B56"
                d="M4.725 12H6.6v5.85H4.725V12Zm4.89-6h1.89v11.85h-1.89V6Zm4.905 3h1.875v8.85H14.52V9Zm4.905-5.25H21.3v14.1h-1.875V3.75Z"
              />
            </Svg>
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
            data={data}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <SizableText mb={10} fos={20}>
                Recommended:
              </SizableText>
            }
            renderItem={({item}) => <Card {...item} />}
            ListFooterComponent={<XStack h={280} />}
          />
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default Home;
