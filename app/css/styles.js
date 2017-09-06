import {StyleSheet, Dimensions} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

export default StyleSheet.create({

    fullScreen: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        resizeMode: 'cover',// cover stretch
        marginBottom: 0,
        // flex: 1, 不能设置Flex, 否则登录页背景图会随着键盘的弹出变形
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        // // 设置子项目在主轴上的对齐方式
        // justifyContent:'center',
        // 单个子项在侧轴上的排列方式
        // alignItems:'center'
    },
});
