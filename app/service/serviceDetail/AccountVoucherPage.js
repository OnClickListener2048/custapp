/**
 * Created by jinglan on 2018/4/4.
 */

import React, {Component} from 'react';
import {
    View,
    DeviceEventEmitter,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Button,
    TouchableWithoutFeedback
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../../config';
import Alert from "react-native-alert";
import SubmitButton from "../../view/SubmitButton";
import * as apis from '../../apis';
import Toast from 'react-native-root-toast';
import DefaultView from '../../view/DefaultView'

import BComponent from '../../base/BComponent'
export default class AccountVoucherPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            company : null,
            dataSource:[],
            isShowButton:false,
            userMobile:'',
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
            selectedCompanyId:'2'
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));



        UserInfoStore.getCompany().then(
            (company) => {
                if (company && company.infos && company.infos.length>0) {
                    this.setState({
                        selectedCompanyId: company.id,
                        company : company
                    });
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );

    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        // console.log('ApplicationCenterPage event.type', event.type);
        //console.log('ApplicationCenterPage event.type', event.id);
        super.onNavigatorEvent(event)
        if (event.id === 'willAppear') {

            UserInfoStore.getUserInfo().then(
                (user) => {

                    if (user && user.mobilePhone.length>0) {
                        this.setState({userMobile: user.mobilePhone,
                        });
                        this._loadData();

                    }
                },
                (e) => {
                    console.log("读取信息错误:", e);
                },
            );

        }
    }



    _loadData(){

        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            });
            return;
        }


        let loading = SActivityIndicator.show(true, "载入中...");


        apis.getCompany(this.state.userMobile).then(
            (companyInfo) => {
                SActivityIndicator.hide(loading);

                if (companyInfo && companyInfo.list) {

                    let tmpCompaniesArr = companyInfo.list;

                    if (companyInfo.applypay) {
                        this.setState({isShowButton: companyInfo.applypay == true});

                        UserInfoStore.setApplyPay(JSON.stringify(companyInfo.applypay)).then(
                            (applypay) => {

                            },
                            (e) => {

                            },
                        );
                    }


                    if (tmpCompaniesArr && tmpCompaniesArr.length > 0) {

                        this.setState({
                            initStatus:'initSucess',
                            dataSource: tmpCompaniesArr});
                    }else {
                        this.setState({
                            initStatus:'no-data',
                        });
                    }



                    UserInfoStore.setCompanyArr(tmpCompaniesArr).then(
                        (user) => {
                        },
                        (e) => {

                        },
                    );



                    // let isFind = false;

                    if (tmpCompaniesArr.length > 0) {
                        let index = 0;
                        for (let i = 0; i < tmpCompaniesArr.length; i++){
                            let companyInfo = tmpCompaniesArr[i];
                            if(companyInfo.default){
                                index = i;
                                break;
                            }
                            // if (companyInfo.id === this.state.selectedCompanyId){
                            //     isFind = true;
                            //     break;
                            // }
                            //
                            // if (i == tmpCompaniesArr.length-1 && isFind === false){
                            //
                            //     let selectCompanyInfo = tmpCompaniesArr[0];
                            //     UserInfoStore.setCompany(selectCompanyInfo).then(
                            //         (user) => {
                            //             console.log("公司信息保存成功");
                            //             // 选中我的页面
                            //             this.setState({selectedCompanyId: selectCompanyInfo.id});
                            //
                            //
                            //         },
                            //         (e) => {
                            //
                            //         },
                            //     );
                            // }
                        }
                        this.setState({selectedCompanyId: tmpCompaniesArr[index].id});
                        UserInfoStore.setCompany(tmpCompaniesArr[index]).then();


                    } else {

                    }


                } else {
                    UserInfoStore.removeCompany().then();
                    UserInfoStore.removeCompanyArr().then();
                    UserInfoStore.removeApplyPay().then();
                    this.setState({
                        initStatus:'no-data',
                    });
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this.setState({
                    initStatus:'error',
                });
                UserInfoStore.removeCompany().then();
                UserInfoStore.removeCompanyArr().then();
                UserInfoStore.removeApplyPay().then();

            },
        );
    }




    _alert(item){
        if (item.id === this.state.selectedCompanyId) {
            return;
        }


        let tipStr = '是否设置\"' + item.name + '\"为默认看账企业'


        Alert.alert('提示', tipStr, [{
            text: "取消",
            onPress: ()=>{
                console.log('you clicked cancel');
            },
            color:'#999999'
        },{
            text: "确认",
            onPress: ()=>{
                this._press(item);
            },
        }]);

    }

    _goFee(){
        Alert.alert('提示', '提交后，客服将于24小时内联系拨打您的手机号码', [{
            text: "取消",
            onPress: ()=>{
                console.log('you clicked cancel');
            },
            color:'#999999'
        },
            {
                text: "提交",
                onPress: ()=>{

                    apis.fee().then(
                        (responseData) => {
                            if (responseData.code == 0) {
                                console.log('我要续费提交成功');
                                Toast.show('提交成功！')
                            }else{
                                Toast.show('提交失败！')
                            }
                        },
                        (e) => {
                            console.log('我要续费提交失败');
                            Toast.show('提交失败！')

                        }
                    );

                },
            }]);
    }

    _press(item){

        if(item.id === this.state.selectedCompanyId)return

        apis.changeCompany(item.id).then(
            (responseData) => {

                if(responseData.code === 0){
                    //切换成功
                    this.setState({
                        selectedCompanyId:item.id
                    });

                    UserInfoStore.setCompany(item).then(
                        (user) => {
                            console.log("公司信息保存成功");
                            DeviceEventEmitter.emit('ChangeCompany');
                        },
                        (e) => {
                            console.log("公司信息保存错误:", e);
                        },
                    );
                }else{
                    Toast.show('切换公司失败')
                }

            },
            (e) => {
                Toast.show('切换公司失败')

            },
        );


    }

    _pushToCompanySurveyPage(item){
        this.push({
            screen: 'CompanySurveyPage',
            title:'我的公司',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps: {
                company:item,

            }
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fafafa'}}>


                <View style={[{height:46,width:SCREEN_WIDTH,justifyContent:'center',alignItems:'center',backgroundColor:"#FFFFFF"}] }>

                    <Text
                        numberOfLines={0}

                        style={[{fontSize: 18,
                            marginLeft : 10 ,color : '#333333'}] }>
                        {this.state.company ? this.state.company.name : "测试"}
                    </Text>
                </View>
                <View style={[{height:0.5,width:SCREEN_WIDTH,backgroundColor:"#D1D1D1"}] }>

                </View>

                <ScrollView style={{
                    width: SCREEN_WIDTH,
                    height: this.state.isShowButton === true ? SCREEN_HEIGHT - 50 - 40 : SCREEN_HEIGHT,
                    backgroundColor: '#fafafa'
                }}>

                </ScrollView>

                {this.state.isShowButton === true &&
                <SubmitButton onPress={this._goFee}
                              isEnabled={true}

                              text="我要续费"
                />}
                {this.state.isShowButton === true &&

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fafafa',
                    height: 20
                }}/>}


            </View>
        )
        // if (this.state.initStatus === 'initSucess') {
        //     return (
        //             <View style={{flex: 1, backgroundColor: '#fafafa'}}>
        //
        //                 <Text
        //                     numberOfLines={0}
        //
        //                     style={[{fontSize: 18,lineHeight: 20,height:46,width:SCREEN_WIDTH - 20,
        //                         marginLeft : 10 ,color : '#333333',backgroundColor:"orange"}] }>
        //                     呵呵哒
        //                 </Text>
        //
        //                 <ScrollView style={{
        //                     width: SCREEN_WIDTH,
        //                     height: this.state.isShowButton === true ? SCREEN_HEIGHT - 50 - 40 : SCREEN_HEIGHT,
        //                     backgroundColor: '#fafafa'
        //                 }}>
        //
        //                 </ScrollView>
        //
        //                 {this.state.isShowButton === true &&
        //                 <SubmitButton onPress={this._goFee}
        //                               isEnabled={true}
        //
        //                               text="我要续费"
        //                 />}
        //                 {this.state.isShowButton === true &&
        //
        //                 <View style={{
        //                     justifyContent: 'center',
        //                     alignItems: 'center',
        //                     backgroundColor: '#fafafa',
        //                     height: 20
        //                 }}/>}
        //
        //
        //             </View>
        //     )
        // } else {
        //     return (
        //         <DefaultView onPress={()=>this._loadData()} type={this.state.initStatus}/>
        //     )
        // }
    }

}


const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        //height: Dimensions.get('window').height * 0.3,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingTop:10,
        paddingBottom:15
    },
});