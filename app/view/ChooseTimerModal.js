/**
 * Created by zhuangzihao on 2017/9/26.
 */
import React,{Component}  from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated
} from 'react-native';

export default class ChooseTimerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow:false,
            maskTouchDisabled : true,
            pointerEvents: 'none'
        }
        this.heightValue= new Animated.Value(0)
        this.fadeAnim= new Animated.Value(0)


    }
    render(){

        const height = this.heightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 200]
        })

        return(
            <View style={[{position:'absolute',top:0,left:0,right:0},this.state.isShow?{bottom:0}:{}]}>
                {this._maskView()}
                <TouchableOpacity onPress={()=>{this._showTimer()}}>
                    <View style={{width:DeviceInfo.width,backgroundColor:'transparent',flexDirection:'row',padding:15,paddingLeft:24,paddingRight:24}}>
                        <Text style={{fontSize:20,color:'white'}}>8月</Text>
                        <Text style={{color:'white',fontSize:14,alignSelf:'flex-end'}}>2017</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={[{backgroundColor:'white',width:DeviceInfo.width},{height}]}>
                </Animated.View>
            </View>


        )
    }
    _maskView() {
        return(
            <Animated.View style={{
                opacity: this.fadeAnim,
                backgroundColor: 'rgba(0,0,0,0.3)',
                position:'absolute',
                top:100,
                bottom:0,
                right:0,
                left:0,
            }}
                           pointerEvents={this.state.pointerEvents}
            >
                <TouchableOpacity
                    disabled = {this.state.maskTouchDisabled}
                    activeOpacity={1}
                    onPress={() => this.close()}
                    style={{flex:1}}>
                    <View style={{flex:1}}>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
    _showTimer(){
        this.show();
    }

    show(){
        this.setState({
            maskTouchDisabled: false,
            pointerEvents: 'auto',
            isShow:true
        },()=>{
            Animated.spring(this.heightValue, {
                toValue: 1,
                duration: 250,
            }).start()

            Animated.timing(
                this.fadeAnim,
                {
                    toValue: 1,
                }
            ).start();
        });

    }
    close(){


        this.setState({
            maskTouchDisabled: true,
            pointerEvents: 'none',
            isShow:false
        },()=>{
            Animated.spring(this.heightValue, {
                toValue: 0,
                duration: 250,
            }).start()
            Animated.timing(
                this.fadeAnim,
                {
                    toValue: 0,
                    duration: 250
                }
            ).start();
        });
    }
}