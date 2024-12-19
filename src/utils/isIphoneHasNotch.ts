import {getDeviceId, hasNotch} from 'react-native-device-info';

export const isIphoneHasNotch = () => {
  const iPhonesWithDynamicIsland = [
    'iPhone15,2',
    'iPhone15,3',
    'iPhone15,4',
    'iPhone15,5',
    'iPhone16,1',
    'iPhone16,2',
  ];
  return hasNotch() || iPhonesWithDynamicIsland.includes(getDeviceId());
};
