import {isIphoneHasNotch} from './isIphoneHasNotch';

const hasNotch = isIphoneHasNotch();

export const getBottomScreenGap = () => (hasNotch ? 120 : 100);
