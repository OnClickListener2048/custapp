/**
 * Created by zhuangzihao on 2018/1/3.
 */
import React, {Component,PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    ScrollView,
    InteractionManager
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
const monthWidth = SCREEN_WIDTH/3
export default class TimeSearchBar extends Component {

    constructor(props){
        super(props)
        this._index = props.timeIndex
    }

    componentWillReceiveProps(nextProps){
        this._index = parseInt(nextProps['timeIndex'])
        this._scrollView.scrollTo({x: monthWidth*(this._index), y: 0, animated: false})
    }

    render(){
        return(
            <View style={{width:DeviceInfo.width,height:40,position:'relative',backgroundColor:'#D9C298',}}>

                <ScrollView
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    onMomentumScrollEnd = {this._onMomentumScrollEnd.bind(this)}
                    ref={(scrollView) => { this._scrollView = scrollView; }}
                    snapToInterval = {monthWidth}
                >
                    {
                        [''].map((item,index)=>{
                            return(
                                <View key={'left'+index} style={{width:monthWidth}} />
                            )
                        })
                    }
                    {
                      this.props.timeDateArr.map((item,index)=>{

                            let color = '#664B14';
                            (this.props.timeIndex  == index)?color = 'white':color = '#664B14'
                            return(
                                <TouchableWithoutFeedback key={index} onPress={()=>{this._selectMonth(index)}}>
                                    <View style={{width:monthWidth,justifyContent:'center',alignItems:'center',backgroundColor:'transparent',marginBottom:10}}>
                                        <Text style={{color,fontSize:16}}>
                                            {item.relateText}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            )
                        })
                    }
                    {
                        [''].map((item,index)=>{
                            return(
                                <View key={'right'+index} style={{width:monthWidth}} />
                            )
                        })
                    }
                </ScrollView>
                <View style={{position:'absolute',left:0,right:0,bottom:0,width:SCREEN_WIDTH,height:DeviceInfo.onePR,backgroundColor:'rgba(255, 255, 255, 0.3)'}}/>
            </View>
        )
    }
    _selectMonth(index){

        if(index == this._index)return
        this._index = index
        this._scrollView.scrollTo({x: monthWidth*(this._index), y: 0, animated: true})
        if(Platform.OS === 'android'){

            this.props.callback && this.props.callback(this._index)
        }
    }

    _onMomentumScrollEnd (event) {
        this._contentOffsetX = event.nativeEvent.contentOffset.x;
        this._index = Math.round(this._contentOffsetX / monthWidth);
        this._scrollView.scrollTo({x: monthWidth*this._index, y: 0, animated: true})
        this.props.callback && this.props.callback(this._index)
    }

}