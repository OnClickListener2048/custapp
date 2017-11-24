/**
 * Created by zhuangzihao on 2017/11/24.
 */
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
} from 'react-native';
import {isIphoneX} from '../util/iphoneX-helper'

const {width, height} = Dimensions.get('window');

/**
 * 顶部导航栏, 带左右按钮和中间定制.
 */
export default class PLPCustomNavBar extends Component {

    static propTypes = {
        leftItem:PropTypes.func,
        titleItem:PropTypes.func,
        rightItem:PropTypes.func,
    };

    // 左边
    renderLeftItem() {
        if (this.props.leftItem === undefined) return;
        return this.props.leftItem();
    }

    // 中间
    renderTitleItem() {
        if (this.props.titleItem === undefined) return;
        return this.props.titleItem();
    }

    // 右边
    renderRightItem() {
        if (this.props.rightItem === undefined) return;
        return this.props.rightItem();
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 左边 */}
                <View>
                    {this.renderLeftItem()}
                </View>
                {/* 中间 */}
                <View>
                    {this.renderTitleItem()}
                </View>
                {/* 右边 */}
                <View>
                    {this.renderRightItem()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:width,
        height:Platform.OS === 'ios' ? isIphoneX()?90:64 : 44,
        backgroundColor:'#FAFAFA',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#DCDCDC',
        paddingTop:Platform.OS === 'ios' ?isIphoneX()?35: 20 : 0,
        zIndex:9999,
    },
});
