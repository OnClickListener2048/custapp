/**
 * Android 轮播图展示
 * Created by jiaxueting on 2017/7/3.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Image,
    Text,
    View
} from 'react-native';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

export  default class scrollViewTop extends Component {

    constructor(props) {
        super(props);
        this.state = {currentPage: 0,};
    }

    render() {
        return (
            <View style={styles.continer}>
                <ScrollView
                    ref='scrollView'
                    //水平方向
                    horizontal={true}
                    //当值为true时显示滚动条
                    showsHorizontalScrollIndicator={false}
                    //当值为true时，滚动条会停在滚动视图的尺寸的整数倍位置。这个可以用在水平分页上
                    pagingEnabled={true}
                    //滑动完一贞
                    onMomentumScrollEnd={(e)=>{this._onAnimationEnd(e)}}
                >
                    {this._renderAllImage()}
                </ScrollView>
                {/*<View style={styles.pageViewStyle}>*/}
                    {/*{this._renderAllIndicator()}*/}
                {/*</View>*/}
            </View>
        );
    }

    /**1.轮播图片展示 */
    _renderAllImage(){
        let imageViews=[];
        // for(var i=0;i<3;i++) {
        //     if (i === 0) {
        //         var image = require('../img/banner.png');
        //     }else if(i===1){
        //         var image = require('../img/banner1.png');
        //     }else if(i===2){
        //         var image = require('../img/banner2.png');
        //     }
        //     imageViews.push(
        //         <Image
        //             key={i}
        //             style={{flex:1,width:ScreenWidth}}
        //             source={image}
        //
        //         />
        //     );
        // }

        imageViews.push(
                <Image
                    key={0}
                    style={{flex:1,width:ScreenWidth}}
                    source={require('../img/banner3.png')}

                />
            );
        return imageViews;
    }

    /**2.手动滑动分页实现 */
    _onAnimationEnd(e) {
        //求出偏移量
        let offsetX = e.nativeEvent.contentOffset.x;
        //求出当前页数
        let pageIndex = Math.floor(offsetX / ScreenWidth);
        //更改状态机
        this.setState({ currentPage: pageIndex });
    }

    /**3.页面指针实现 */
    _renderAllIndicator() {
        let indicatorArr = [];
        let style;//3,图片数量
        for (let i = 0; i < 3; i++) {
            //判断
            style = (i==this.state.currentPage)?{color:'#157efb'}:{color:'rgba(0,0,0,0.2)'};
            indicatorArr.push(
                <Text key={i} style={[{fontSize:30},style]}>
                    •
                </Text>
            );
        }
        return indicatorArr;
    }

}

const styles = StyleSheet.create({
    continer:{
        backgroundColor: '#dddddd'
    },
    pageViewStyle:{
        height:30,
        width:ScreenWidth,
        backgroundColor:'transparent',
        position:'absolute',
        bottom:0,
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
    }
});