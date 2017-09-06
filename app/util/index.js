'use strict';

import {Dimensions, PixelRatio} from 'react-native'

const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width

// const pt2px = pt=>PixelRatio.getPixelSizeForLayoutSize(pt);
// const px2dp = px=>PixelRatio.roundToNearestPixel(px);

const basePx = 375
/**
 * 像素转点阵, 这里假定设计稿是按照iPhone 6尺寸制作的, 也就是750x1334像素.
 * usage: import px2dp from '../util'
 * @param px
 * @returns {number}
 */
export default function px2dp(px) {
    // return px *  deviceW / basePx / 3;
    return px / 2;
    // return PixelRatio.getPixelSizeForLayoutSize(px);
}
// export default px2dp;