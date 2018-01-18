/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    StyleSheet,
    Linking,
    Keyboard,
    KeyboardAvoidingView,
    PanResponder,
    Animated,
    TextInput,
    TouchableWithoutFeedback


} from 'react-native';
import WebTab from './WebVIew'
import BComponent from '../../base';
import * as apis from '../../apis';
import DefaultView from '../../view/DefaultView'
import Toast from 'react-native-root-toast';
import errorText from '../../util/ErrorMsg';
import Modal from '../../view/Modalbox';

import '../../modules/react-native-sww-activity-indicator';

const col = 4
const mag = 10
const boxWidth = Dimensions.get('window').width - 20
const itemWidth = (boxWidth-(col+1)*mag)/col
const window = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

export default class ColumnDetailPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataArr:[],
            itemSelected:{},
            loadState:'',

            navigatorTitle:this.props.navigatorTitle,          //标题名称

            isShowkeyBoard:false,
            mobile: '',     // 手机号
            area:'',  //服务区域
            name:'', //姓名
            message:'', //提交意见消息
        };

        this.marginTopValue= new Animated.Value(0)
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.updateMobile = this.updateMobile.bind(this);
        this.updateArea = this.updateArea.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateMmessage = this.updateMmessage.bind(this);

    }
    static defaultProps = {
        type:'1', //1注册公司 2记账报税 3企业变更
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.props.type)
        });
    }
    componentWillMount() {
        // 发送通知
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (e, gestureState) => {

                this.pageX = e.nativeEvent.pageX;
                this.pageY = e.nativeEvent.pageY;
            },
            onPanResponderMove: (e, gestureState) => {

                if (Math.abs(this.pageY - e.nativeEvent.pageY) > Math.abs(this.pageX - e.nativeEvent.pageX)) {
                    // 上下滑动
                    if (this.pageY > e.nativeEvent.pageY) {
                        //向上滑动
                        Animated.spring(this.marginTopValue, {
                            toValue: 1,
                            duration: 250,
                        }).start()
                    } else {
                        //向下滑动
                        Animated.spring(this.marginTopValue, {
                            toValue: 0,
                            duration: 250,
                        }).start()
                    }
                }
            },

        });

    }

    componentWillUnmount() {
        // 发送通知

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // 小屏键盘显示适配
    _keyboardDidShow() {
        this.setState({isShowkeyBoard: true});
    }

    // 小屏键盘显示适配
    _keyboardDidHide() {
        this.setState({isShowkeyBoard: false});
    }

    loadData(type = '0'){
        let loading = SActivityIndicator.show(true, "加载中...");

        apis.loadHomeData(type).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                if(responseData.code == 0 ){
                    if(responseData.list.length>0 && responseData.list[0].products.length>0){
                        this.setState({
                            dataArr:responseData.list[0].products,
                            itemSelected:responseData.list[0].products[0],

                            loadState:'success'
                        })
                    }else{
                        this.setState({
                            loadState:'no-data'
                        })
                    }
                }else{
                    this.setState({
                        loadState:'error'
                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {
                this.setState({
                    loadState:NetInfoSingleton.isConnected?'error':'no-net',
                })
                Toast.show('加载失败!')
                SActivityIndicator.hide(loading);

            },
        );

    }

    submitMessage(){

        if (this.state.area.length === 0){
            Toast.show('请输入服务区域');
            return;
        }else if (this.state.name.length === 0){
            Toast.show('请输入您的称呼');
            return;
        }else if (this.state.mobile.length === 0){
            Toast.show('请输入联系电话');
            return;
        }else if (this.state.message.length === 0){
            Toast.show('请输入留言内容');
            return;
        }else {
            let  mobileStr = this.state.mobile.replace(/[^\d]/g, '');// 过滤非数字输入
            let mobileValid = mobileStr.length > 0 && (mobileStr.match(/^([0-9]{11})?$/)) !== null;
            if (!mobileValid){
                Toast.show('请输入正确的联系电话');
                return;

            }

        }

        let loading = SActivityIndicator.show(true, "载入中...");
        //这里this.state.navigatorTitle 具体看产品到底要什么
        apis.submitFeedBack(this.state.navigatorTitle,this.state.area,this.state.name,this.state.mobile,this.state.message).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                Toast.show('提交成功');
                this.refs.modal3.close()
            }, (e) => {
                SActivityIndicator.hide(loading);
                Toast.show(errorText(e));

            }
        );
    }

    change(index) {
        if (this.state.dataArr[index]._id != this.state.itemSelected._id) {
            this.setState({
                itemSelected:this.state.dataArr[index]
            })
        }
    }


    callPhone(){
        Linking.openURL('tel:13522807924')
    }

    onlineMessage(){
        //在线留言
        this.refs.modal3.open()
    }

    updateMobile(mobile) {

        this.setState({mobile});
    }
    updateArea(area) {

        this.setState({area});
    }

    updateName(name) {

        this.setState({name});
    }

    updateMmessage(message) {
        this.setState({message});
    }


    render(){
        const marginTop = this.marginTopValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -DeviceInfo.width*0.4+20]
        })
        if(this.state.loadState == 'success'){
            return(
                <View {...this._panResponder.panHandlers} style={{flex:1,backgroundColor:'#F1F1F1'}} >
                    <Animated.View  style={{backgroundColor:'#F1F1F1',paddingBottom:10,paddingTop:10,marginTop}}>
                        <Image  style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4}} source={{uri:this.state.itemSelected.cover}}/>
                        <View style={{backgroundColor:'white', marginTop:-13,marginLeft:10,marginRight:10,paddingTop:10,paddingBottom:20,flexDirection:'row',flexWrap:'wrap',borderRadius:3}}>
                            {
                                this.state.dataArr.map((item,index)=>{
                                    let color = '#666666'
                                    let borderColor='#ECECEC'


                                    if(this.state.itemSelected._id == item._id){
                                        color = '#FF3238'
                                        borderColor = '#FF3238'
                                    }

                                    return(
                                        <TouchableOpacity key={index} onPress={()=>{this.change(index)}}>
                                            <View  style={[{marginLeft:mag,marginTop:mag,width:itemWidth,height:(2*itemWidth)/5,justifyContent:'center',alignItems:'center',borderColor,borderWidth:1}]}>
                                                <Text style={[{fontSize:14,color}]}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </View>
                    </Animated.View>
                    <WebTab url={this.state.itemSelected.url} />
                    <View style={styles.tabViewContainer}>
                        <TouchableOpacity
                            style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                            onPress={() => {
                                this.callPhone()
                            }}>
                            <View style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E13238'}}>
                                <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'免费咨询'}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                            onPress={() => {
                                this.onlineMessage()
                            }}>
                            <View  style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E19F0E'}}>
                                <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'在线留言'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Modal onBackClick={()=>Keyboard.dismiss()} backdropPressToClose={!this.state.isShowkeyBoard}
                           style={ {height: 479, width: SCREEN_WIDTH - 56, backgroundColor:'#F1F1F1',justifyContent: 'center', alignItems: 'center', marginTop: -30}}
                           position={"center"} ref={"modal3"}>
                        <TouchableWithoutFeedback onPress={dismissKeyboard}>

                            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0} style={[{flex: 1, backgroundColor:'#F1F1F1',width: SCREEN_WIDTH - 56,flexDirection: 'column',alignItems:'center'}]}>
                                <View  style={[{height: 479 - 20, width: SCREEN_WIDTH - 76,marginTop:10, backgroundColor:'#ffffff',flexDirection: 'column',alignItems:'center'}]}>

                                    <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 30}]}
                                               placeholder='服务区域'
                                               onChangeText={
                                                   (area) => {
                                                       this.updateArea(area);
                                                   }
                                               }
                                    />
                                    <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                               placeholder='您的称呼'
                                               onChangeText={
                                                   (name) => {
                                                       this.updateName(name);
                                                   }
                                               }
                                    />
                                    <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                               placeholder='联系电话'
                                               keyboardType={'number-pad'}
                                               onChangeText={
                                                   (mobile) => {
                                                       this.updateMobile(mobile);
                                                   }
                                               }
                                    />
                                    <TextInput underlineColorAndroid='transparent' multiline={true} ref={"content"} placeholderTextColor={'#D9D8D8'} style={[styles.textInputStyle,{marginTop: 10,height:this.state.isShowkeyBoard ? 140 : 180}]}
                                               placeholder='请在此输入留言内容,我们会尽快与您联系。'
                                               onChangeText={
                                                   (message) => {
                                                       this.updateMmessage(message);
                                                   }
                                               }
                                    />
                                    <TouchableOpacity
                                        style={styles.submitBtnTouchContainer}
                                        onPress={() => {
                                            this.submitMessage()
                                        }}>
                                        <View  style={[styles.btnContainer,{backgroundColor:'#FF9F0E',borderRadius:8}]}>
                                            <Text style={styles.textContainer}>{'我要咨询'}</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>

                    </Modal>

                </View>
            )
        }else{
            return(

                <View {...this._panResponder.panHandlers} style={{flex:1,backgroundColor:'#F1F1F1'}} >
                    <Animated.View  style={{backgroundColor:'#F1F1F1',paddingBottom:10,paddingTop:10,marginTop}}>
                        <Image  style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4}} source={{uri:this.state.itemSelected.cover}}/>
                        <View style={{backgroundColor:'white', marginTop:-13,marginLeft:10,marginRight:10,paddingTop:10,paddingBottom:20,flexDirection:'row',flexWrap:'wrap',borderRadius:3}}>
                            {
                                this.state.dataArr.map((item,index)=>{
                                    let color = '#666666'
                                    let borderColor='#ECECEC'


                                    if(this.state.itemSelected._id == item._id){
                                        color = '#FF3238'
                                        borderColor = '#FF3238'
                                    }

                                    return(
                                        <TouchableOpacity key={index} onPress={()=>{this.change(index)}}>
                                            <View  style={[{marginLeft:mag,marginTop:mag,width:itemWidth,height:(2*itemWidth)/5,justifyContent:'center',alignItems:'center',borderColor,borderWidth:1}]}>
                                                <Text style={[{fontSize:14,color}]}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </View>
                    </Animated.View>
                    <WebTab url={this.state.itemSelected.url} />
                    <View style={styles.tabViewContainer}>
                        <TouchableOpacity
                            style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                            onPress={() => {
                                this.callPhone()
                            }}>
                            <View style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E13238'}}>
                                <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'免费咨询'}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                            onPress={() => {
                                this.onlineMessage()
                            }}>
                            <View  style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E19F0E'}}>
                                <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'在线留言'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Modal onBackClick={()=>Keyboard.dismiss()} backdropPressToClose={!this.state.isShowkeyBoard}
                           style={ {height: 479, width: SCREEN_WIDTH - 56, backgroundColor:'#F1F1F1',justifyContent: 'center', alignItems: 'center', marginTop: -30}}
                           position={"center"} ref={"modal3"}>
                        <TouchableWithoutFeedback onPress={dismissKeyboard}>

                            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0} style={[{flex: 1, backgroundColor:'#F1F1F1',width: SCREEN_WIDTH - 56,flexDirection: 'column',alignItems:'center'}]}>
                                <view>

                                </view>
                                <View  style={[{height: 479 - 20, width: SCREEN_WIDTH - 76,marginTop:10, backgroundColor:'#ffffff',flexDirection: 'column',alignItems:'center'}]}>

                                    <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 30}]}
                                               placeholder='服务区域'
                                               onChangeText={
                                                   (area) => {
                                                       this.updateArea(area);
                                                   }
                                               }
                                    />
                                    <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                               placeholder='您的称呼'
                                               onChangeText={
                                                   (name) => {
                                                       this.updateName(name);
                                                   }
                                               }
                                    />
                                    <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]}
                                               placeholder='联系电话'
                                               keyboardType={'number-pad'}
                                               onChangeText={
                                                   (mobile) => {
                                                       this.updateMobile(mobile);
                                                   }
                                               }
                                    />
                                    <TextInput underlineColorAndroid='transparent' multiline={true} ref={"content"} placeholderTextColor={'#D9D8D8'} style={[styles.textInputStyle,{marginTop: 10,
                                        textAlignVertical: 'top',
                                        height:this.state.isShowkeyBoard ? 140 : 180}]}
                                               placeholder='请在此输入留言内容,我们会尽快与您联系。'
                                               onChangeText={
                                                   (message) => {
                                                       this.updateMmessage(message);
                                                   }
                                               }
                                    />
                                    <TouchableOpacity
                                        style={styles.submitBtnTouchContainer}
                                        onPress={() => {
                                            this.submitMessage()
                                        }}>
                                        <View  style={[styles.btnContainer,{backgroundColor:'#FF9F0E',borderRadius:8}]}>
                                            <Text style={styles.textContainer}>{'我要咨询'}</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>

                    </Modal>

                </View>
               // <DefaultView onPress={()=>this.loadData(this.props.type)} type ={this.state.loadState}/>
            )
        }
    }



}



const styles = StyleSheet.create({


    tabViewContainer: {
        height: 50,
        width: SCREEN_WIDTH,
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between',
        flexDirection: 'row',
    },
    btnTouchContainer: {
        flexDirection: 'row',
        height:50,
        width:(SCREEN_WIDTH - 4)/2
    },

    btnContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        flex:1,
        alignItems:'center'
    },
    textContainer: {
        fontSize:16,
        textAlign:'center',
        color:'#ffffff'
    },
    textInputStyle:{
        borderRadius:8,
        borderColor:'#CBCBCB',
        borderWidth:1,
        width:SCREEN_WIDTH - 76 - 40,
        height:40,
        color:'#666666',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize:16
    },
    submitBtnTouchContainer: {
        flexDirection: 'row',
        height:40,
        width:208,
        marginTop:24,
        borderRadius:8
    },

});