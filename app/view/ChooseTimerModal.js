/**
 * Created by zhuangzihao on 2017/9/26.
 */
import React,{Component}  from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    PickerIOS,
    Platform
} from 'react-native';
import PickerAndroid from './PickerAndroid';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;
export default class ChooseTimerModal extends Component {
    constructor(props) {
        super(props);
        let today = new Date();//获得当前日期
        this.state = {
            isShow:false,
            maskTouchDisabled : true,
            pointerEvents: 'none',
            year:today.getFullYear(),
            month:today.getMonth() + 1,
        }
        this.heightValue= new Animated.Value(0)
        this.fadeAnim= new Animated.Value(0)




    }
    render(){

        const height = this.heightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-250, 0]
        })

        return(
            <View style={[{position:'absolute',top:0,left:0,right:0},this.state.isShow?{bottom:0}:{}]}>
                {this._maskView()}
                <Animated.View style={[{backgroundColor:'white',width:DeviceInfo.width,height:250,position:'absolute',paddingTop:50,flexDirection:'row'},{top:height}]}>
                    <View style={{width:DeviceInfo.width/2}}>
                        <Picker>
                            <PickerItem
                                key='1'
                                value='1'
                                label='1'
                            />
                            <PickerItem
                                key='2'
                                value='2'
                                label='2'
                            />
                            <PickerItem
                                key='3'
                                value='3'
                                label='3'
                            />
                        </Picker>
                    </View>
                    <View style={{width:DeviceInfo.width/2}}>
                        <Picker>
                            <PickerItem
                                key='1'
                                value='1'
                                label='1'
                            />
                            <PickerItem
                                key='2'
                                value='2'
                                label='2'
                            />
                            <PickerItem
                                key='3'
                                value='3'
                                label='3'
                            />
                            <PickerItem
                                key='4'
                                value='4'
                                label='4'
                            />
                            <PickerItem
                                key='5'
                                value='5'
                                label='5'
                            />
                            <PickerItem
                                key='6'
                                value='6'
                                label='6'
                            />
                        </Picker>
                    </View>
                </Animated.View>
                <TouchableOpacity activeOpacity={1} onPress={()=>{this._showTimer()}}>
                    <View style={[{width:DeviceInfo.width,flexDirection:'row',padding:15,paddingLeft:24,paddingRight:24},this.state.isShow?{backgroundColor:'white'}:{backgroundColor:'transparent'}]}>
                        <Text style={[{fontSize:20},this.state.isShow?{color:'#999999'}:{color:'white'}]}>{this.state.month}月</Text>
                        <Text style={[{fontSize:14,alignSelf:'flex-end'},this.state.isShow?{color:'#999999'}:{color:'white'}]}>{this.state.year}</Text>
                    </View>
                </TouchableOpacity>
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
        ).start(()=>{
            this.setState({
                maskTouchDisabled: true,
                pointerEvents: 'none',
                isShow:false
            })
        });
    }
}