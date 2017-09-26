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

    static defaultProps = {
        callback:null,//
    };
    constructor(props) {
        super(props);
        let today = new Date();//获得当前日期
        this.state = {
            isShow:false,
            maskTouchDisabled : true,
            pointerEvents: 'none',
            year:today.getFullYear().toString(),
            month:(today.getMonth() + 1).toString(),
            yearSelected:today.getFullYear().toString(),
            monthSelected:(today.getMonth() + 1).toString()
        }
        this.heightValue= new Animated.Value(0)
        this.fadeAnim= new Animated.Value(0)
        this.monthArr = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12'
        ]
        this.yearArr=[]
        for (let i = 2000;i<=this.state.year;i++){
            this.yearArr.push(i.toString())
        }
        this.nowMonthArr=[]
        for (let j=1 ;j<=this.state.month;j++){
            this.nowMonthArr.push(j.toString())
        }
        this.year=today.getFullYear().toString()



    }
    render(){

        const height = this.heightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-280, 0]
        })

        return(
            <View style={[{position:'absolute',top:0,left:0,right:0},this.state.isShow?{bottom:0}:{}]}>
                {this._maskView()}
                <Animated.View style={[{backgroundColor:'white',width:DeviceInfo.width,height:280,paddingTop:20,position:'absolute'},{top:height}]}>
                    <View style={{flexDirection:'row',height:200}}>
                        <View style={{width:DeviceInfo.width/2, paddingLeft:20}}>
                            <Picker
                                selectedValue={this.state.year}
                                onValueChange={(year) => this.setState({year})}
                            >
                                {
                                    this.yearArr.map((item,index)=>{

                                        return(
                                            <PickerItem
                                                key={'year'-index}
                                                value={item}
                                                label={item+'年'}
                                            />
                                        )
                                    })
                                }
                            </Picker>
                        </View>
                        <View style={{width:DeviceInfo.width/2, paddingRight:20}}>
                            <Picker
                                selectedValue={this.state.month}
                                onValueChange={(month) => this.setState({month})}

                            >
                                {
                                    this.year==this.state.year?this.nowMonthArr.map((item,index)=>{

                                        return(
                                            <PickerItem
                                                key={'month'-index}
                                                value={item}
                                                label={item+'月'}
                                            />
                                        )
                                    }):this.monthArr.map((item,index)=>{

                                        return(
                                            <PickerItem
                                                key={'month'-index}
                                                value={item}
                                                label={item+'月'}
                                            />
                                        )
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                    <View style={{width:DeviceInfo.width,height:50,justifyContent:'space-between',flexDirection:'row',padding:24}}>
                        <TouchableOpacity onPress={()=>(this._cancle())}><Text style={{fontSize:16,color:'#333333'}}>取消</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this._ok()}}><Text style={{fontSize:16,color:'#E13238'}}>确定</Text></TouchableOpacity>
                    </View>
                </Animated.View>
                <TouchableOpacity activeOpacity={1} onPress={()=>{this._showTimer()}}>
                    <View style={[{width:DeviceInfo.width,flexDirection:'row',padding:15,paddingLeft:24,paddingRight:24,
                        justifyContent:'space-between',borderBottomColor:'rgba(255,255,255,0.15)',borderBottomWidth:0.5},this.state.isShow?{backgroundColor:'white'}:{backgroundColor:'transparent'}]}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[{fontSize:20},this.state.isShow?{color:'#999999'}:{color:'white'}]}>{this.state.monthSelected}月</Text>
                            <Text style={[{fontSize:14,alignSelf:'flex-end'},this.state.isShow?{color:'#999999'}:{color:'white'}]}>{this.state.yearSelected}</Text>
                        </View>
                        <Image source={this.state.isShow?require('../img/today_black.png'):require('../img/today_white.png')}/>
                    </View>
                </TouchableOpacity>
            </View>


        )
    }
    _cancle(){
        this.close()
    }
    _ok(){
        this.setState({
            monthSelected:this.state.month,
            yearSelected:this.state.year
        },()=>{
            this.close()
            this.props.callback && this.props.callback(this.state.yearSelected,this.state.monthSelected)
        })
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