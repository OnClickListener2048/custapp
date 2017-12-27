/**
 * 授权手机号页面
 * Created by jiaxueting on 2017/12/22.
 */
import React from 'react';
import CommenCell from '../../view/CommenCell'
import {StyleSheet,View,FlatList,Text,TouchableOpacity,Image,TouchableWithoutFeedback} from 'react-native';
import * as apis from '../../apis/accredit';
import BComponent from '../../base/BComponent'
import DefaultView from "../../view/DefaultView";
import Alert from "react-native-alert";
import Toast, {DURATION} from 'react-native-easy-toast'

export default class AccreditPhonePage extends BComponent {
    static navigatorStyle = {
        tabBarHidden: true, // 隐藏默认的顶部导航栏
        navBarHidden: false, // 隐藏默认的顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            phoneNum:'',//新添加的手机号
            dataSource: [],
            dataList:[],//接口返回数组信息
            cancelAccredit:false,//取消授权，默认不取消
            loadState:'success',
            isAcceditModal:false,//添加授权、取消授权下拉框（默认不显示）
            companyid:this.props.companyid,//公司ID
            ownerMobile:this.props.ownerMobile,//本次登录手机号
        };
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this._addOrCancelphoneNum = this._addOrCancelphoneNum.bind(this);
        this._addAccredit = this._addAccredit.bind(this);
        this._cancelPhone = this._cancelPhone.bind(this);
        this._onLoadPhone = this._onLoadPhone.bind(this);
    }
    state;


    componentDidMount(){
        this._onLoadPhone();
    }

    //请求所有授权手机号
    _onLoadPhone(){

        if(!this.props.companyid||!this.props.ownerMobile){
            Toast.show("公司ID为空或授权手机号为空");
            return;
        }
        console.log("企业详情页传值=",this.props.companyid,this.props.ownerMobile);
        var loading = SActivityIndicator.show(true, "加载中...");
        apis.getAccreditMobile(this.props.companyid,this.props.ownerMobile).then(
            (responseData) => {
                console.log("走进来")
                SActivityIndicator.hide(loading);
                if (responseData.code === 0) {
                    console.log("请求成功走进来")
                    if(responseData.list){
                        this.setState({
                            dataList:responseData.list
                        })
                        if(responseData.list.length===0){
                            this.props.navigator.setButtons({

                                rightButtons: [
                                    {
                                        icon: require('../../img/more_btn.png'),
                                        buttonColor: 'black', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                                        buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                                        buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                                        id: 'more'
                                    }]
                            });
                            this.setState({
                                cancelAccredit:false,
                                loadState:'no-data'
                            })
                            this._againData(responseData.list);
                        }else{
                                this.setState({
                                    loadState:'success'
                                })
                            this._againData(responseData.list);

                        }
                    }

                }else{
                    this.setState({
                            loadState: 'error'
                        }
                    );
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this.setState({
                    loadState: NetInfoSingleton.isConnected ? 'error' : 'no-net',
                })
                console.log('error', e)

            },
        );

    }

    //删除所选手机号
    _deleteMobile(mobile){
        console.log("删除所选手机号",mobile);
        if(!this.props.companyid||!this.props.ownerMobile||!mobile){
            this.refs.toast.show("公司ID为空或授权手机号为空", DURATION.LENGTH_SHORT);

            return;
        }

        apis.deleteAccreditMobile(this.props.ownerMobile,mobile,this.props.companyid).then(
            (responseData) => {
                if (responseData.code === 0) {//删除成功刷新页面
                    this._onLoadPhone();
                }else{
                    this.setState({
                            loadState: 'error'
                        }
                    );
                }
            },
            (e) => {
                this.setState({
                    loadState: NetInfoSingleton.isConnected ? 'error' : 'no-net',
                })
                console.log('error', e)

            },
        );
    }

    //取消授权点击事件
    _cancelAccredit(mobile){
        Alert.alert('授权提示', '取消该手机号授权', [
            {
                text: "取消",
                onPress: ()=>{
                    // this._onLoadPhone();
                },style: 'cancel',
            },{
                text: "确定",
                onPress: ()=>{
                    this._deleteMobile(mobile);
                },
            }]);
    }

    _renderItem(item){
        console.log("授权后是否走renderItem",this.state.cancelAccredit);
        if(this.state.cancelAccredit){//取消授权，，，取消按钮显示

            return(
                <CommenCell
                    leftText={item.item.data}
                    leftIcon={require('../../img/cancel_icon.png')}
                    closeRightIcon={true}
                    isClick={false}
                    leftIconTouch={true}
                    onIconPress={this._cancelAccredit.bind(this,item.item.data)}
                />
            )
        }else{

            return(
                <CommenCell
                    leftText={item.item.data}
                    isClick={false}
                    closeRightIcon={true}
                />
            )
        }

    }

    //添加授权点击事件
    _addAccredit(){
        console.log("点击添加授权");
        //调用添加授权手机号提示框
        this.props.navigator.showLightBox({
            screen: "AccreditInputBox",
            passProps: {
                onClose: this.dismissLightBox,
                //回调!
                callback: this._addOrCancelphoneNum,
            },
            overrideBackPress: true, // 拦截返回键
            style: {
                backgroundBlur: 'none',
                backgroundColor: 'rgba(0,0,0,0.5)',
                tapBackgroundToDismiss:true
            }
        })
        this.setState({isAcceditModal:false,})

    }

    //取消授权点击事件
    _cancelPhone(){
        console.log("点击取消授权");
        if(this.state.loadState==='no-data'){
            this.refs.toast.show("您还没有对其他用户授权", DURATION.LENGTH_SHORT);
            return;
        }
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: '取消',
                    buttonColor: 'black', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    id: 'cancel'
                }]
        });
        this.setState({
            cancelAccredit:true,
            isAcceditModal:false,
        })
        this._againData(this.state.dataList);

    }

    //重新赋值
    _againData(phoneList){
        console.log("重新赋值=",phoneList,this.state.cancelAccredit);

        let dataSource=[];
        for (let i = 0; i<phoneList.length;i++){
            let flat = {};
            flat.key = i;
            flat.data = phoneList[i];
            flat.accredit = this.state.cancelAccredit;//是否显示删除按钮
            dataSource.push(flat)
        }
        this.setState({
            dataSource:dataSource
        })
    }


    _isAcceditRender(){
        if(this.state.isAcceditModal&&(this.state.loadState==='success'||this.state.loadState==='no-data')){
            console.log("下拉框点击显示",this.state.isAcceditModal)
            return(
                <View style={styles.isAccreditViewStyle}>
                    <View style={styles.isAccreditStyle}>
                        <TouchableOpacity onPress = {() => {this._addAccredit()}}
                        style={styles.touchArea}>
                            <Text style={styles.isAccredittext}>
                                {'添加授权'}
                            </Text>
                        </TouchableOpacity>
                        <View style={{backgroundColor:'#D4D4D4',height:0.5,width:94,marginLeft:6,marginRight:6}}/>
                        <TouchableOpacity onPress = {() => {this._cancelPhone()}}
                                          style={styles.touchArea}>
                            <Text style={styles.isAccredittext}>
                                {'取消授权'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }else{
            return(
                <View>
                </View>
            )
        }
    }

    //整个页面点击执行事件
    lostBlur(){
        console.log("点击事件执行");
        this.setState({
            isAcceditModal:false,
        })
    }

    render(){
        console.log("页面显示",this.state.cancelAccredit)
            return(
                <TouchableWithoutFeedback
                    onPress={this.lostBlur.bind(this)}>
                    <View style={styles.container}>
                        <Toast ref="toast" position={'bottom'} style={{zIndex: 1,}}/>
                        {this._isAcceditRender()}
                        {this.state.loadState == 'success'||this.state.loadState == 'no-data'?

                            <View style={styles.container}>
                                <FlatList
                                    style={{marginTop:20,zIndex: 1,}}
                                    data={this.state.dataSource}
                                    renderItem={this._renderItem.bind(this)}
                                >
                                </FlatList>
                                {this.state.loadState == 'no-data'&&
                                <View style={{alignItems:'center',
                                    position:'absolute',
                                    flex:1,
                                    alignSelf:'center',
                                    flexDirection:'row',zIndex: 1,
                                    justifyContent:'center',marginTop:20}}>
                                    <Image resizeMode="contain"
                                           source={require('../../img/warn_icon.png')}>
                                    </Image>
                                    <Text style={{fontSize:18,color:'#999999',marginLeft:5}}>
                                        {'您还没有对其他用户授权'}
                                    </Text>
                                </View>}
                            </View>
                            :
                            <DefaultView onPress={()=>this._onLoadPhone()} type ={this.state.loadState}/>
                        }
                    </View>
                </TouchableWithoutFeedback>
            )

    }

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../img/more_btn.png'),
                buttonColor: 'black', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                id: 'more'
            }]

        }

    //点击右按钮
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
         super.onNavigatorEvent(event);
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'more') { // this is the same id field from the static navigatorButtons definition

                this.setState({isAcceditModal:true,})
                console.log("右侧更多按钮",this.state.isAcceditModal);
            }else if(event.id=== 'cancel'){
                console.log("右侧取消按钮");
                this.props.navigator.setButtons({
                    rightButtons: [
                        {
                            icon: require('../../img/more_btn.png'),
                            buttonColor: 'black', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                            buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                            buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                            id: 'more'
                        }]
                });
                this.setState({
                    cancelAccredit:false,
                    isAcceditModal:false,
                })
                this._againData(this.state.dataList);

            }

        }


    }

    //添加手机号
    _addMobile(mobile){
        console.log("删除所选手机号",mobile);
        if(!this.props.companyid||!this.props.ownerMobile||!mobile){
            this.refs.toast.show("公司ID为空或授权手机号为空", DURATION.LENGTH_SHORT);

            return;
        }

        apis.addAccreditMobile(this.props.ownerMobile,mobile,this.props.companyid).then(
            (responseData) => {
                if (responseData.code === 0) {//添加成功刷新页面
                    this._onLoadPhone();
                }else{
                    this.refs.toast.show(responseData.msg, DURATION.LENGTH_SHORT);
                }
            },
            (e) => {
                this.refs.toast.show(e.msg, DURATION.LENGTH_SHORT);

            },
        );
    }

    //经营范围回调
    _addOrCancelphoneNum(phoneNum){

        if(phoneNum!=null){
            console.log("添加的手机号",phoneNum);
            this._addMobile(phoneNum);

        }

    }

}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        flex: 1,
    },
    isAccreditStyle:{
        backgroundColor:'rgba(0, 0, 0, 0.6)',
        alignSelf:'flex-end',
        width:114,
        height:90,
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center',
        borderRadius: 3,
    },
    touchArea:{
        width:114,
        height:44,
        alignItems:'center',
        justifyContent:'center',
    },
    isAccreditViewStyle:{
        alignSelf:'flex-end',
        width:129,
        height:90,
        zIndex: 10,
        position: 'absolute',
        paddingRight:10,
    },
    isAccredittext:{
        fontSize:16,
        color:'#ffffff',
    }
})
