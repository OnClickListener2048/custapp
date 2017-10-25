/**
 * Created by zhuangzihao on 2017/10/24.
 * 单独处理tab界面的loading，解决切换tab时出现的bug
 */
import React,{Component} from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Modal,
    Dimensions,
    Animated,
    Easing,
    Text
} from 'react-native';
const  ANIMATED_DURATION = 250;
var {width, height} = Dimensions.get('window');

export default class PLPActivityIndicator extends Component{

    constructor(props) {
        super(props);
        this.state = {
            opacity:new Animated.Value(0),
            pointerEvents: 'none',
        };
    }
    static defaultProps={
        message:'加载中...',
    }
    render(){
        return(
            <Animated.View style={[styles.background,{opacity:this.state.opacity}]} pointerEvents={this.state.pointerEvents}>
                <Animated.View style={[styles.activeBg,{opacity:this.state.opacity}]}>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                    />
                    {this._messageView()}
                </Animated.View>
            </Animated.View>
        )

    }
    _messageView(){
        return(
            <Text style={styles.message}>
                {this.props.message}
            </Text>
        )
    }
    show(){

        this.setState({
            pointerEvents: 'auto',
        },()=>{
            Animated.timing(this.state.opacity,{
                toValue: 1,
                duration: ANIMATED_DURATION ,
                easing: Easing.out(Easing.ease)
            }).start()
        });

    }
    hide(){
        let _this = this
        setTimeout(function () {
            Animated.timing(_this.state.opacity, {
                toValue: 0,
                duration: ANIMATED_DURATION,
                easing: Easing.in(Easing.ease)
            }).start(()=>{
                _this.setState({
                    pointerEvents: 'none',
                })
            });
        },500)

    };

};

const styles = StyleSheet.create({
    background:{
        backgroundColor:'rgba(0,0,0,0)',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        width:width,
        height:height,
        left:0,
        top:0
    },
    activeBg:{
        padding:15,
        backgroundColor:'rgba(0,0,0,0.8)',
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center'
    },
    message:{
        color:'white',
        fontSize:15,
        marginTop:5,
        opacity:0.8
    }


});