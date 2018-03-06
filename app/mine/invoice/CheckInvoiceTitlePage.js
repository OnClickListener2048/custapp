/**
 * Created by liufei on 2018/3/5.
 */

import React from 'react';
import BComponent from '../../base/BComponent';
import {
    StyleSheet,
    ScrollView,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import SubmitButton from "../../view/SubmitButton";
import Alert from "react-native-alert";
import Toast from 'react-native-root-toast';
import Modal from '../../view/Modalbox';
import * as apis from '../../apis';
import * as WeChat from'react-native-wechat'
export default class CheckInvoiceTitlePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',//发票抬头id
            company:'',//公司名称
            taxID:'',//税号
            address:'',//公司地址
            mobile:'',//公司电话
            bank:'',//开户银行
            account:'',//银行账户

        };
        this._callBackRefresh = this._callBackRefresh.bind(this);
        this._loadData = this._loadData.bind(this);

    }


    componentWillMount() {

        this.initNavigatorBar();
        this._loadData();
    }

    _loadData(){
        apis.loadInvoiceDetialData(this.props.id).then(
            (responseData) => {

                if (responseData.code === 0) {
                    this.setState({
                            _id:responseData.data._id,
                            company:responseData.data.company,
                            taxID:responseData.data.taxID,
                            address:responseData.data.address,
                            mobile:responseData.data.mobile,
                            bank:responseData.data.bank,
                            account:responseData.data.account
                        }
                    )

                }else{
                    Toast.show("数据请求失败");
                }
            },
            (e) => {
                Toast.show("数据请求失败");
            },
        )
    }

    initNavigatorBar(){
        if(Platform.OS === 'ios') {
            UserInfoStore.getMobileLoginInfo().then(
                v => {
                    if(v && v.open) {
                        this.props.navigator.setButtons({
                            rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
                        });
                    } else {
                        this.props.navigator.setButtons({
                            rightButtons: [{icon: require('../../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
                        });
                    }
                }, e => {
                    this.props.navigator.setButtons({
                        rightButtons: [{icon: require('../../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
                    });
                }
            );
        } else {
            // Android一直打开微信登录
            this.props.navigator.setButtons({
                rightButtons: [{icon: require('../../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
            });
        }
    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event)
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'share') { // this is the same id field from the static navigatorButtons definition
                this.refs.shareModel.open()
            }
        }
    }

    _callBackRefresh(){
        this._loadData();
    }

    //编辑
    edit(){
        this.push({
            screen: 'AddInvoiceTitlePage',
            title:'编辑',
            passProps: {
                //回调!
                callback: this._callBackRefresh,
                _id: this.state._id,
                company:this.state.company,
                taxID:this.state.taxID,
                address:this.state.address,
                mobile:this.state.mobile,
                bank:this.state.bank,
                account:this.state.account,
            }
        });
    }

    //删除
    del(){
        apis.deleteInvoiceTitle(this.props.id).then(
            (responseData) => {
                if (responseData.code === 0) {//删除成功刷新页面
                    Alert.alert('删除成功', '', [{
                        text: "确定",
                        onPress: ()=>{
                            // this.push({
                            //     screen: 'InvoiceTitleListPage',
                            //     title:'公司抬头',
                            // });

                            // let callback = this.props.callback;
                            // if(callback) {
                            //     callback();
                            // }
                            DeviceEventEmitter.emit('ReloadInvoiceTitleState');


                            this.props.navigator.pop();

                        },
                        color:'#C6A567'
                    },
                    ]);
                }else{
                    Toast.show("删除失败");
                }
            },
            (e) => {
                Toast.show("删除失败");
            },
        );

    }
    _share(){
        let shareStr = ''
        if(this.state.company) shareStr = shareStr + "名称:" +  this.state.company + ';'
        if(this.state.taxID) shareStr = shareStr + "税号:" +  this.state.taxID + ';'
        if(this.state.address) shareStr = shareStr + "单位地址:" +  this.state.address + ';'
        if(this.state.mobile) shareStr = shareStr + "电话号码:" +  this.state.mobile + ';'
        if(this.state.bank) shareStr = shareStr + "开户银行:" +  this.state.bank + ';'
        if(this.state.account) shareStr = shareStr + "银行账户:" +  this.state.account + ';'

        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.shareToSession({
                        description:shareStr,
                        type: 'text',

                    })
                        .catch((error) => {
                            // alert(error.message);
                        });
                } else {
                    // alert('没有安装微信软件，请您安装微信之后再试');
                    Toast.show('没有安装微信软件，请您安装微信之后再试')

                }
            });

    }


    render(){
        return(
            <View style={{flex:1}}>
                <ScrollView style={styles.container}>
                    <View style={styles.wrp}>
                        <Text style={styles.text_title}>
                            抬&#12288;&#12288;头：
                        </Text>
                        <Text style={styles.text_context}>
                            {this.state.company}
                        </Text>

                    </View>
                    <View style={[styles.line,{marginLeft:20}]}/>
                    <View style={styles.wrp}>
                        <Text style={styles.text_title}>
                            税&#12288;&#12288;号：
                        </Text>
                        <Text style={styles.text_context}>
                            {this.state.taxID}
                        </Text>
                    </View>
                    <View style={[styles.line,{marginLeft:20}]}/>
                    <View style={styles.wrp}>
                        <Text style={styles.text_title}>
                            单位地址：
                        </Text>
                        <Text style={styles.text_context}>
                            {this.state.address}
                        </Text>
                    </View>
                    <View style={[styles.line,{marginLeft:20}]}/>
                    <View style={styles.wrp}>
                        <Text style={styles.text_title}>
                            电话号码：
                        </Text>
                        <Text style={styles.text_context}>
                            {this.state.mobile}
                        </Text>
                    </View>
                    <View style={[styles.line,{marginLeft:20}]}/>
                    <View style={styles.wrp}>
                        <Text style={styles.text_title}>
                            开户银行：
                        </Text>
                        <Text style={styles.text_context}>
                            {this.state.bank}
                        </Text>
                    </View>
                    <View style={[styles.line,{marginLeft:20}]}/>
                    <View style={styles.wrp}>
                        <Text style={styles.text_title}>
                            银行账户：
                        </Text>
                        <Text style={styles.text_context}>
                            {this.state.account}
                        </Text>
                    </View>

                    <View style={{marginTop:50}}>
                        <SubmitButton
                            isEnabled={true}
                            text="编辑"
                            buttonStyle={{width:SCREEN_WIDTH-30,height:50}}
                            onPress={() => {
                                this.edit()
                            }}
                        />
                        <SubmitButton
                            isEnabled={false}
                            text="删除"
                            buttonStyle={{width:SCREEN_WIDTH-30,height:50}}
                            onPress={() => {
                                this.del()
                            }}

                        />
                    </View>
                </ScrollView>
                <Modal style={{height:187,backgroundColor:'#EDEDED'}} position={"bottom"} ref={"shareModel"}>
                    <Text style={{fontSize:18,padding:16,textAlign:'center',color:'#666666'}}>分享</Text>
                    <View style={{paddingLeft:70,paddingRight:70,flex:1,justifyContent:'space-around', alignItems:'center',flexDirection:'row',borderTopWidth:1,borderTopColor:'#E1E1E1'}}>
                        <TouchableOpacity onPress={()=>{this._share()}}>
                            <View style={{alignItems:'center'}}>
                                <Image source={require('../../img/share_friend.png')}/>
                                <Text style={{fontSize:12,marginTop:8,color:'#666666'}}>微信好友</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>


        )
    }





}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#F9F9F9',
    },
    wrp:{
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        width:SCREEN_WIDTH,
        alignItems:'center',
    },
    text_title:{
        color:'#000000',
        fontSize:16,
        marginTop:15,
        marginBottom:15,
        marginLeft:20
    },
    text_context:{
        color:'#333333',
        fontSize:16,
        marginLeft:30,
        marginTop:10,
        marginBottom:10,
        width:SCREEN_WIDTH-20-30-90
    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:0.5 ,
        backgroundColor:'transparent',
    },


})


