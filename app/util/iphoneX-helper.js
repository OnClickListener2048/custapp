/**
 * Created by zhuangzihao on 2017/11/24.
 */
import { Dimensions, Platform } from 'react-native';

export function isIphoneX() {
    let dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
    );
}