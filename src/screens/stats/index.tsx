import React from 'react';
import {SafeAreaView, Dimensions} from 'react-native';
import {YStack, SizableText} from 'tamagui';
import {LineChart} from 'react-native-gifted-charts';

import {useAppSelector} from 'app/store/hooks';

const {width} = Dimensions.get('screen');

const Stats: React.FC = () => {
  const {playedTime = {}} = useAppSelector(state => state.core);

  const weekData = Object.values(playedTime)
    .slice(0, 7)
    .map(item => ({
      value: Number(item),
    }));
  const data = Object.values(playedTime)
    .slice(0, 30)
    .map(item => ({
      value: Number(item),
    }));

  return (
    <YStack bg="#418F75" f={1}>
      <SafeAreaView>
        <YStack px={20} mt={20} mb={10}>
          <SizableText mb={26} fos={20}>
            Statistics:
          </SizableText>

          <YStack br={16} bg="#fff" px={23} py={26} mb={14}>
            <SizableText fos={18} fow={700} mb={10} col="#000">
              This Week stats
            </SizableText>

            <LineChart
              color1="#A9D571"
              dataPointsColor1="transparent"
              width={width - 160}
              data={weekData}
              initialSpacing={0}
              curved
              yAxisLabelContainerStyle={{
                marginLeft: 0,
                marginRight: 0,
                width: 40,
              }}
              areaChart1
              xAxisThickness={1}
              yAxisThickness={1}
              formatYLabel={value => `${value.slice(0, 4)}`}
            />
          </YStack>
          <YStack br={16} bg="#fff" px={23} py={26} mb={14}>
            <SizableText fos={18} fow={700} mb={10} col="#000">
              Month
            </SizableText>

            <LineChart
              color1="#A9D571"
              dataPointsColor1="transparent"
              width={width - 160}
              data={data}
              initialSpacing={0}
              curved
              xAxisThickness={1}
              yAxisThickness={1}
              yAxisLabelContainerStyle={{
                marginLeft: 0,
                marginRight: 0,
                width: 40,
              }}
              areaChart1
              formatYLabel={value => `${value.slice(0, 4)}`}
            />
          </YStack>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};

export default Stats;
