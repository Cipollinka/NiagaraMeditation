import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  ImageBackground,
  Share,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import SoundPlayer from 'react-native-sound-player';
import {Defs, Svg, G, Path, ClipPath} from 'react-native-svg';
import {XStack, YStack, SizableText, View} from 'tamagui';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bookmark,
  Pause,
  Play,
  Share2,
  StepBack,
  StepForward,
} from 'lucide-react-native';

import data from 'app/assets/data';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';
import {toggleFavorite, toggleIsPlaying} from 'app/store/coreReducer';
import {useFocusEffect} from '@react-navigation/native';

interface PreviewProps {
  route?: {
    params?: {
      id: string;
      isFromFavorites?: boolean;
    };
  };
}

dayjs.extend(duration);
const {width} = Dimensions.get('screen');

const Preview: React.FC<PreviewProps> = ({route}) => {
  const dispatch = useAppDispatch();
  const id = route?.params?.id;
  const isFromFavorites = route?.params?.isFromFavorites;

  const [musicInfo, setMusicInfo] = useState<{
    currentTime: number;
    duration: number;
  } | null>(null);

  const {favorites = [], isPlaying} = useAppSelector(state => state.core);

  const activeDataIndex = data.findIndex(item => item.id === id);
  const activeData = activeDataIndex !== -1 ? data[activeDataIndex] : null;

  const availableWidth = width - 60;
  const chunks = Math.floor(availableWidth / 50);

  const shareLink = useCallback(() => {
    Share.share({
      url: 'https://www.niagara.com',
    });
  }, []);

  const filteredData = useMemo(() => {
    if (!isFromFavorites) {
      return data;
    }

    return data.filter(item => favorites.includes(item.id));
  }, [favorites, isFromFavorites]);

  const getInfo = async () => {
    try {
      const info = await SoundPlayer.getInfo();
      setMusicInfo(info);
    } catch (e) {
      console.log('There is no song playing', e);
    }
  };

  useEffect(() => {
    if (activeData?.url) {
      SoundPlayer.loadUrl(activeData.url);
      getInfo();

      return () => {
        SoundPlayer.stop();
      };
    }
  }, [activeData]);

  useEffect(() => {
    const timerId = setInterval(() => {
      getInfo();
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(toggleIsPlaying(true));
      SoundPlayer.resume();

      return () => {
        dispatch(toggleIsPlaying(false));
      };
    }, [dispatch]),
  );

  const playAndStopSound = useCallback(() => {
    if (isPlaying) {
      SoundPlayer.pause();
    } else {
      SoundPlayer.resume();
    }
    dispatch(toggleIsPlaying(!isPlaying));
  }, [dispatch, isPlaying]);

  const playNextSound = useCallback(() => {
    const nextIndex = activeDataIndex + 1;
    const nextFormattedIndex = nextIndex >= filteredData.length ? 0 : nextIndex;

    SoundPlayer.loadUrl(filteredData[nextFormattedIndex].url);
    SoundPlayer.resume();
    dispatch(toggleIsPlaying(true));
    getInfo();
  }, [activeDataIndex, filteredData, dispatch]);

  const playPreviousSound = useCallback(() => {
    const nextIndex = activeDataIndex - 1;
    const nextFormattedIndex =
      nextIndex < filteredData.length ? filteredData.length - 1 : nextIndex;

    SoundPlayer.loadUrl(filteredData[nextFormattedIndex].url);
    SoundPlayer.resume();
    dispatch(toggleIsPlaying(true));
    getInfo();
  }, [activeDataIndex, filteredData, dispatch]);

  if (!id || !activeData) {
    return null;
  }

  const formattedDuration =
    musicInfo?.duration !== undefined
      ? dayjs
          .duration(musicInfo.duration - musicInfo.currentTime, 'seconds')
          .format('mm:ss')
      : 0;

  const percentage =
    musicInfo?.duration !== undefined
      ? (musicInfo.currentTime / musicInfo.duration) * 100
      : 0;
  const isEnded =
    musicInfo?.duration !== undefined &&
    musicInfo.currentTime >= musicInfo.duration;

  return (
    <ImageBackground
      style={styles.root}
      source={require('app/assets/images/bg.png')}>
      <YStack f={1} jc="space-between" mt={50}>
        <XStack mt={20} ai="center" jc="center">
          <View px={15} py={5} bg="#266B56" br={20}>
            <SizableText fos={23} fow={500}>
              {isEnded
                ? 'Meditation ended'
                : isPlaying
                ? 'Meditation'
                : 'Paused'}
            </SizableText>
          </View>
        </XStack>

        <YStack h={width <= 375 ? '85%' : '60%'} pos="relative">
          <LinearGradient
            style={styles.root}
            colors={['transparent', '#266B56', '#266B56', '#266B56', '#266B56']}
            start={{x: 0.01, y: 0}}
            end={{x: 0.01, y: 1}}>
            <XStack mt={70} mb={50} ai="center" jc="center">
              <View
                h={50}
                w={120}
                jc="center"
                ai="center"
                bg="transparent"
                borderWidth={2}
                borderColor="#fff"
                br={20}>
                <SizableText col="#fff" fos={32} lh={34} fow={500}>
                  {formattedDuration}
                </SizableText>
              </View>
            </XStack>

            <YStack px={20} gap={10}>
              <SizableText fos={17} lh={22} fow={500} col="#fff">
                {activeData.name}
              </SizableText>
              <SizableText fos={15} lh={22} fow={500} col="#fff">
                {activeData.description}
              </SizableText>
            </YStack>

            {isEnded ? (
              <XStack gap={16} px={20} mt={20}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => dispatch(toggleFavorite(id))}>
                  <View w={46} bg="#fff" h={46} br={8} jc="center" ai="center">
                    <Bookmark
                      size={24}
                      color="#266B56"
                      fill={favorites.includes(id) ? '#266B56' : '#fff'}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={shareLink} activeOpacity={0.8}>
                  <View w={46} bg="#fff" h={46} br={8} jc="center" ai="center">
                    <Share2 size={24} color="#266B56" />
                  </View>
                </TouchableOpacity>
              </XStack>
            ) : (
              <>
                <XStack pos="relative" w="100%" h={50} px={30} mt={20}>
                  <XStack
                    gap={2}
                    f={1}
                    pos="absolute"
                    left={30}
                    right={30}
                    opacity={0.37}>
                    {Array.from({length: chunks})
                      .fill('1')
                      .map((item, i) => (
                        <Svg
                          width={50}
                          height={50}
                          fill="none"
                          key={(item as string) + i}>
                          <G clipPath="url(#a)">
                            <Path
                              fill="#fff"
                              d="M36.371 3.906a1.827 1.827 0 0 0-1.442 1.863v36.539a1.826 1.826 0 1 0 3.606 0V5.769a1.827 1.827 0 0 0-1.985-1.863 1.826 1.826 0 0 0-.179 0ZM13.294 5.829a1.827 1.827 0 0 0-1.442 1.863v32.693a1.827 1.827 0 1 0 3.606 0V7.692a1.827 1.827 0 0 0-1.985-1.863 1.826 1.826 0 0 0-.179 0Zm17.308 5.77a1.827 1.827 0 0 0-1.442 1.863v21.153a1.828 1.828 0 1 0 3.604 0V13.462a1.828 1.828 0 0 0-1.981-1.864 1.856 1.856 0 0 0-.183 0h.002ZM7.525 13.52a1.827 1.827 0 0 0-1.442 1.864v17.307a1.827 1.827 0 1 0 3.604 0V15.385a1.827 1.827 0 0 0-1.981-1.864 1.796 1.796 0 0 0-.183 0h.002Zm11.539 1.923a1.827 1.827 0 0 0-1.443 1.864v13.461a1.826 1.826 0 1 0 3.604 0V17.308a1.826 1.826 0 0 0-1.98-1.864 1.796 1.796 0 0 0-.183 0h.002Zm23.077 0a1.826 1.826 0 0 0-1.443 1.864v13.461a1.827 1.827 0 1 0 3.606 0V17.308a1.827 1.827 0 0 0-1.985-1.864 1.78 1.78 0 0 0-.178 0ZM1.756 19.29a1.827 1.827 0 0 0-1.442 1.864v5.77a1.827 1.827 0 1 0 3.605 0v-5.77a1.827 1.827 0 0 0-1.984-1.864 1.817 1.817 0 0 0-.181 0h.002Zm23.077 0a1.827 1.827 0 0 0-1.442 1.864v5.77a1.828 1.828 0 1 0 3.603 0v-5.77a1.828 1.828 0 0 0-1.98-1.864 1.856 1.856 0 0 0-.183 0h.002Zm23.077 0a1.827 1.827 0 0 0-1.443 1.864v5.77a1.827 1.827 0 1 0 3.606 0v-5.77a1.826 1.826 0 0 0-1.984-1.864 1.84 1.84 0 0 0-.18 0Z"
                            />
                          </G>
                          <Defs>
                            <ClipPath id="a">
                              <Path fill="#fff" d="M.192 0h50v50h-50z" />
                            </ClipPath>
                          </Defs>
                        </Svg>
                      ))}
                  </XStack>

                  <XStack
                    w={`${percentage}%`}
                    pos="absolute"
                    overflow="hidden"
                    left={30}
                    right={30}
                    gap={2}>
                    {Array.from({length: chunks})
                      .fill('1')
                      .map((item, i) => (
                        <Svg
                          width={50}
                          height={50}
                          fill="none"
                          key={(item as string) + i}>
                          <G clipPath="url(#a)">
                            <Path
                              fill="#fff"
                              d="M36.371 3.906a1.827 1.827 0 0 0-1.442 1.863v36.539a1.826 1.826 0 1 0 3.606 0V5.769a1.827 1.827 0 0 0-1.985-1.863 1.826 1.826 0 0 0-.179 0ZM13.294 5.829a1.827 1.827 0 0 0-1.442 1.863v32.693a1.827 1.827 0 1 0 3.606 0V7.692a1.827 1.827 0 0 0-1.985-1.863 1.826 1.826 0 0 0-.179 0Zm17.308 5.77a1.827 1.827 0 0 0-1.442 1.863v21.153a1.828 1.828 0 1 0 3.604 0V13.462a1.828 1.828 0 0 0-1.981-1.864 1.856 1.856 0 0 0-.183 0h.002ZM7.525 13.52a1.827 1.827 0 0 0-1.442 1.864v17.307a1.827 1.827 0 1 0 3.604 0V15.385a1.827 1.827 0 0 0-1.981-1.864 1.796 1.796 0 0 0-.183 0h.002Zm11.539 1.923a1.827 1.827 0 0 0-1.443 1.864v13.461a1.826 1.826 0 1 0 3.604 0V17.308a1.826 1.826 0 0 0-1.98-1.864 1.796 1.796 0 0 0-.183 0h.002Zm23.077 0a1.826 1.826 0 0 0-1.443 1.864v13.461a1.827 1.827 0 1 0 3.606 0V17.308a1.827 1.827 0 0 0-1.985-1.864 1.78 1.78 0 0 0-.178 0ZM1.756 19.29a1.827 1.827 0 0 0-1.442 1.864v5.77a1.827 1.827 0 1 0 3.605 0v-5.77a1.827 1.827 0 0 0-1.984-1.864 1.817 1.817 0 0 0-.181 0h.002Zm23.077 0a1.827 1.827 0 0 0-1.442 1.864v5.77a1.828 1.828 0 1 0 3.603 0v-5.77a1.828 1.828 0 0 0-1.98-1.864 1.856 1.856 0 0 0-.183 0h.002Zm23.077 0a1.827 1.827 0 0 0-1.443 1.864v5.77a1.827 1.827 0 1 0 3.606 0v-5.77a1.826 1.826 0 0 0-1.984-1.864 1.84 1.84 0 0 0-.18 0Z"
                            />
                          </G>
                          <Defs>
                            <ClipPath id="a">
                              <Path fill="#fff" d="M.192 0h50v50h-50z" />
                            </ClipPath>
                          </Defs>
                        </Svg>
                      ))}
                  </XStack>
                </XStack>

                <XStack gap={20} px={20} mt={20} jc="center" ai="center">
                  {filteredData.length > 1 && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={playPreviousSound}>
                      <StepBack
                        size={35}
                        opacity={0.7}
                        fill="#fff"
                        stroke="#fff"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={playAndStopSound}>
                    <View
                      w={75}
                      h={75}
                      br={40}
                      bg="#fff"
                      jc="center"
                      ai="center">
                      {isPlaying ? (
                        <Pause size={35} fill="#266B56" stroke="#266B56" />
                      ) : (
                        <Play size={35} fill="#266B56" stroke="#266B56" />
                      )}
                    </View>
                  </TouchableOpacity>

                  {filteredData.length > 1 && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={playNextSound}>
                      <StepForward
                        opacity={0.7}
                        size={35}
                        stroke="#fff"
                        fill="#fff"
                      />
                    </TouchableOpacity>
                  )}
                </XStack>
              </>
            )}
          </LinearGradient>
        </YStack>
      </YStack>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default Preview;
