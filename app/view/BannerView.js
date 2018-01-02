/**
 * Created by zhuangzihao on 2017/12/27.
 */

import React, { Component ,PropTypes} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';
const window = Dimensions.get('window');
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

export default class BannerView extends Component{

    static defaultProps = {
        bannerData:[],
        imageKey:'',
        style:{
            height:SCREEN_HEIGHT
        }

    };
    constructor(props) {
        super(props);
        this.state = {
            bannerData:props.bannerData,
            seletedIndex:0
        };
        this._index = 0

    }

    componentDidMount() {
        //默认跳第二章
        this._scrollView.scrollTo({x: SCREEN_WIDTH, y: 0, animated: false})
        this._beginTime();

    }

    componentWillUnmount() {
        clearInterval(this._timer);
    }
    render(){
        let imageLength = this.state.bannerData.length;
        let circleLength = 6 * imageLength + 5 * 2 * imageLength;
        let center = (SCREEN_WIDTH - circleLength) / 2;

        return(
            <View style={[{width:SCREEN_WIDTH},this.props.style]}>
                <ScrollView
                    ref={(scrollView) => { this._scrollView = scrollView; }}
                    horizontal={true}
                    contentContainerStyle={[this.props.style]}
                    showsVerticalScrollIndicator = {false}
                    showsHorizontalScrollIndicator = {false}
                    pagingEnabled = {true}
                    onMomentumScrollEnd = {this._onMomentumScrollEnd.bind(this)}
                    onTouchStart={this._onTouchStart.bind(this)}
                    onTouchEnd={this._onTouchEnd.bind(this)}
                >

                    {
                        this.state.bannerData.length>1?<TouchableWithoutFeedback>
                            <Image  resizeMode="cover" source={{uri:this.state.bannerData[this.state.bannerData.length-1][this.props.imageKey]}} style={{width:SCREEN_WIDTH,height:this.props.style.height}} />
                        </TouchableWithoutFeedback>:null
                    }
                    {
                        this.state.bannerData.map((item,index)=>{
                            return(
                                <TouchableWithoutFeedback key={index} >
                                    <Image  resizeMode="cover" source={{uri:item[this.props.imageKey]}} style={{width:SCREEN_WIDTH,height:this.props.style.height}} />
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                    {
                        this.state.bannerData.length>1?<TouchableWithoutFeedback>
                            <Image  resizeMode="cover" source={{uri:this.state.bannerData[0][this.props.imageKey]}} style={{width:SCREEN_WIDTH,height:this.props.style.height}} />
                        </TouchableWithoutFeedback>:null
                    }

                </ScrollView>
                <View style={{flexDirection:'row',position:'absolute',bottom:5,left:center}}>
                    {
                        this.state.bannerData.map((value,i) => {
                            return (<View key={i} style={ (i == this.state.seletedIndex) ? {
                                width:6,
                                height:6,
                                borderRadius:6,
                                backgroundColor:'#ffffff',
                                marginHorizontal:5,
                            }: {
                                width:6,
                                height:6,
                                borderRadius:6,
                                backgroundColor:'#f4797e',
                                marginHorizontal:5,
                            }}/>);
                        })
                    }
                </View>
            </View>

        )
    }



    _onTouchStart(){
        clearInterval(this._timer);
    }
    _onTouchEnd(){
        this._beginTime()
    }
    _beginTime(){
        let _this = this
        this._timer = setInterval(() => {
            _this._index = _this._index+1
            _this._scrollView.scrollTo({x:_this._index* SCREEN_WIDTH, y: 0, animated: true})
            if(_this._index == _this.state.bannerData.length+1){

                //最后一张跳第二张
                _this._timeout = setTimeout(()=>{
                    _this._scrollView.scrollTo({x: SCREEN_WIDTH, y: 0, animated: false})
                    //设置当前是第几个
                    _this.setState({
                        seletedIndex:0
                    })
                    _this._index = 0;
                    clearTimeout(this._timeout);
                },500);

            }else{
                _this.setState({
                    seletedIndex:_this._index-1
                })
            }

        }, 5000)
    }
    _onMomentumScrollEnd(event){
        this._contentOffsetX = event.nativeEvent.contentOffset.x;
        this._index = Math.round(this._contentOffsetX / SCREEN_WIDTH);
        console.log(this._index,'---',this.state.bannerData.length+1)
        if(this._index == this.state.bannerData.length+1){
            //最后一张跳第二张
            this._scrollView.scrollTo({x: SCREEN_WIDTH, y: 0, animated: Platform.OS === 'android'})
            //设置当前是第几个
            this.setState({
                seletedIndex:0
            })
        }else if(this._index == 0){
            //第一张跳倒数第二张
            this._scrollView.scrollTo({x: SCREEN_WIDTH* this.state.bannerData.length, y: 0, animated: Platform.OS === 'android'})
            //设置当前是第几个
            this.setState({
                seletedIndex:this.state.bannerData.length-1
            })

        }else{
            this.setState({
                seletedIndex:this._index-1
            })
        }

    }


}
