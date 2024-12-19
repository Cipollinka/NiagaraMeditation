import React, {useCallback, useEffect} from 'react';
import {Bookmark, Pause, Play, Share2} from 'lucide-react-native';
import {TouchableOpacity, Share} from 'react-native';
import Svg, {G, Path} from 'react-native-svg';
import {SizableText, View, XStack} from 'tamagui';
import SoundPlayer from 'react-native-sound-player';

import {navigate} from 'app/navigationRef';
import {
  toggleFavorite,
  toggleIsPlaying,
  setActiveCardPlayingId,
} from 'app/store/coreReducer';
import data from 'app/assets/data';
import {useAppDispatch, useAppSelector} from 'app/store/hooks';

interface CardProps {
  id: string;
  url: string;
  name: string;
  duration: string;
  description: string;
  isFromFavorites?: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  url,
  name,
  description,
  duration,
  isFromFavorites = false,
}) => {
  const dispatch = useAppDispatch();

  const {
    favorites = [],
    isPlaying,
    activeCardPlayingId = data[0].id,
  } = useAppSelector(state => state.core);

  useEffect(() => {
    return () => {
      SoundPlayer.stop();
    };
  }, [url]);

  const playAndStopSound = useCallback(() => {
    if (isPlaying) {
      SoundPlayer.pause();
    } else {
      SoundPlayer.loadUrl(url);
      SoundPlayer.resume();
    }
    dispatch(toggleIsPlaying(!isPlaying));
    dispatch(setActiveCardPlayingId(id));
  }, [isPlaying, url, dispatch, id]);

  const shareLink = useCallback(() => {
    Share.share({
      url: 'https://www.niagara.com',
    });
  }, []);

  return (
    <View
      bg="#fff"
      br={16}
      p={20}
      mb={10}
      onPress={() => navigate('Lobby', {id, isFromFavorites})}>
      <XStack gap={10} mb={10}>
        <View px={15} py={5} bg="#266B56" br={20}>
          <SizableText fos={14} fow={500}>
            Meditation
          </SizableText>
        </View>

        <View
          px={15}
          py={5}
          bg="#fff"
          borderWidth={1}
          borderColor="#266B56"
          br={20}>
          <SizableText col="#266B56" fos={14} fow={500}>
            {duration} min
          </SizableText>
        </View>
      </XStack>

      <SizableText mb={8} fos={15} lh={22} fow="700" col="#000">
        {name}
      </SizableText>

      <SizableText col="#266B56" fos={14} fow={500}>
        {description}
      </SizableText>

      <XStack gap={16} mt={10}>
        <TouchableOpacity activeOpacity={0.8} onPress={playAndStopSound}>
          <View w={46} h={46} br={23} bg="#266B56" jc="center" ai="center">
            {isPlaying && id === activeCardPlayingId ? (
              <Pause size={24} color="#fff" fill="#fff" />
            ) : (
              <Play size={24} color="#fff" fill="#fff" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => dispatch(toggleFavorite(id))}>
          <View w={46} h={46} br={8} jc="center" ai="center">
            <Bookmark
              size={24}
              color="#266B56"
              fill={favorites.includes(id) ? '#266B56' : '#fff'}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={shareLink}>
          <View w={46} h={46} br={8} jc="center" ai="center">
            <Share2 size={24} color="#266B56" />
          </View>
        </TouchableOpacity>
      </XStack>

      <View pos="absolute" top={20} right={0}>
        <Svg width={94} height={159} fill="none">
          <G fill="#266B56">
            <Path d="M20.607 116.298c-.838-2.656 2.081-4.92 4.446-3.449l7.14 4.443a3.003 3.003 0 0 0 2.488.314l8.02-2.529c2.657-.838 4.921 2.081 3.45 4.446l-4.443 7.141a3 3 0 0 0-.314 2.487l2.53 8.021c.837 2.656-2.082 4.92-4.447 3.449l-7.14-4.443a3.003 3.003 0 0 0-2.488-.314l-8.02 2.529c-2.657.838-4.921-2.081-3.45-4.446l4.443-7.141a3 3 0 0 0 .314-2.487l-2.53-8.021Z" />
            <Path
              fillOpacity={0.2}
              d="M51.315 94.147c.258-2.773 3.826-3.73 5.435-1.456l2.013 2.842a3 3 0 0 0 2.17 1.253l3.469.322c2.773.258 3.729 3.826 1.456 5.435l-2.842 2.013a3 3 0 0 0-1.253 2.171l-.322 3.468c-.258 2.773-3.826 3.729-5.436 1.456l-2.013-2.842a2.998 2.998 0 0 0-2.17-1.253l-3.468-.322c-2.773-.258-3.73-3.826-1.456-5.436l2.842-2.013a3 3 0 0 0 1.253-2.17l.322-3.468ZM32.444 65.264c2.143-1.779 5.342.068 4.873 2.814l-1.119 6.551a3 3 0 0 0 .65 2.422l4.244 5.114c1.779 2.143-.068 5.342-2.813 4.873l-6.552-1.119a3 3 0 0 0-2.421.649l-5.115 4.245c-2.143 1.779-5.342-.068-4.873-2.813l1.12-6.552a3 3 0 0 0-.65-2.421l-4.245-5.115c-1.779-2.143.068-5.342 2.814-4.873l6.552 1.119a3 3 0 0 0 2.42-.649l5.115-4.245Z"
            />
            <Path d="M70.97 52.8c1.031-2.586 4.724-2.493 5.625.142l2.15 6.29a3 3 0 0 0 1.726 1.816l6.174 2.463c2.587 1.032 2.494 4.725-.141 5.625l-6.29 2.15a3 3 0 0 0-1.817 1.727l-2.462 6.173c-1.032 2.587-4.725 2.494-5.626-.141l-2.149-6.29a3 3 0 0 0-1.727-1.816l-6.174-2.463c-2.587-1.032-2.494-4.725.142-5.625l6.29-2.15a3 3 0 0 0 1.816-1.727l2.462-6.174Z" />
            <Path
              fillOpacity={0.2}
              d="M98.67 32.28c.394-2.757 4.006-3.535 5.501-1.186l3.567 5.609a3.002 3.002 0 0 0 2.106 1.36l6.58.941c2.757.395 3.535 4.006 1.185 5.501l-5.608 3.568a2.999 2.999 0 0 0-1.359 2.106l-.943 6.58c-.394 2.756-4.006 3.534-5.5 1.185l-3.568-5.608a3 3 0 0 0-2.106-1.36l-6.58-.942c-2.757-.395-3.535-4.006-1.185-5.5l5.608-3.569a3 3 0 0 0 1.36-2.106l.942-6.58ZM93.344 85.12c1.032-2.588 4.725-2.495 5.625.14l.906 2.65a3.002 3.002 0 0 0 1.727 1.816l2.6 1.037c2.587 1.032 2.494 4.725-.142 5.626l-2.649.905a3 3 0 0 0-1.816 1.727l-1.037 2.6c-1.032 2.587-4.725 2.494-5.626-.141l-.905-2.65a3 3 0 0 0-1.727-1.816l-2.6-1.037c-2.587-1.032-2.494-4.725.141-5.625l2.65-.905a3 3 0 0 0 1.816-1.728l1.037-2.6ZM76.966 7.927c1.031-2.586 4.724-2.493 5.625.142l.905 2.649a3 3 0 0 0 1.727 1.816l2.6 1.037c2.587 1.032 2.494 4.725-.14 5.626l-2.65.905a3 3 0 0 0-1.816 1.727l-1.038 2.6c-1.032 2.587-4.725 2.494-5.625-.141l-.905-2.649a3 3 0 0 0-1.728-1.816l-2.6-1.038c-2.586-1.032-2.493-4.725.142-5.625l2.649-.905a3 3 0 0 0 1.816-1.728l1.038-2.6ZM88.498 110.044c2.143-1.778 5.342.069 4.873 2.814l-1.127 6.6a3 3 0 0 0 .648 2.421l4.277 5.153c1.779 2.143-.068 5.342-2.813 4.873l-6.6-1.127a2.998 2.998 0 0 0-2.422.648l-5.152 4.277c-2.143 1.779-5.343-.068-4.874-2.814l1.128-6.6a3 3 0 0 0-.649-2.421l-4.277-5.153c-1.778-2.142.069-5.342 2.814-4.873l6.6 1.128a3.002 3.002 0 0 0 2.422-.649l5.152-4.277Z"
            />
          </G>
        </Svg>
      </View>
    </View>
  );
};

export default Card;
