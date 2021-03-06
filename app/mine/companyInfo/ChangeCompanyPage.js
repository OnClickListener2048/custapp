/**
 * Created by zhuangzihao on 2017/9/19.
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

import CompanyInfoCell from './CompanyInfoCell'
import BComponent from '../../base/BComponent'
export default class ChangeCompanyPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
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
                    this.setState({selectedCompanyId: company.id});
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
    _authorizeButton(item){
        //获取当前授权人的手机号
        UserInfoStore.getLastUserPhone().then(
            (mobile) => {
                console.log("授权手机号" + mobile);
                this.setState({ownerMobile: mobile});
                console.log("公司ID,授权手机号" + item.id, mobile);
                this.push({
                    screen: 'AccreditPhonePage',
                    title: '授权看账',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps: {
                        companyid: item.id,
                        companyname:item.name,
                        ownerMobile: mobile,
                    },
                });
            }
        );

    }


    render() {
        if (this.state.initStatus === 'initSucess') {
            return (
                <TouchableWithoutFeedback onPress={() => this.props.navigator.dismissLightBox()}>
                    <View style={{flex: 1, backgroundColor: '#fafafa'}}>


                        <ScrollView style={{
                            width: SCREEN_WIDTH,
                            height: this.state.isShowButton === true ? SCREEN_HEIGHT - 50 - 40 : SCREEN_HEIGHT,
                            backgroundColor: '#fafafa'
                        }}>
                            {
                                this.state.dataSource.map((item, index) => {
                                    return (
                                        <CompanyInfoCell
                                            leftSelectBtnOnPress={this._alert.bind(this, item)}
                                            rightBtnOnPress={this._pushToCompanySurveyPage.bind(this, item)}
                                            authorizeButton={this._authorizeButton.bind(this,item)}
                                            underLine={(index === this.state.dataSource.length - 1 && this.state.dataSource.length > 0) ? false : true}
                                            isClick={false}
                                            isRightBtnClick={true}
                                            leftIcon={item.id == this.state.selectedCompanyId ? require('../../img/com_choose_select.png') : require('../../img/com_choose_normal.png')}
                                            leftText={item.name}
                                            surviveText={item.service_tag}
                                            ownerText={item.owner_tag}
                                        />

                                    )
                                })
                            }
                        </ScrollView>

                        {this.state.isShowButton === true &&
                        <SubmitButton
                            accessibilityLabel="company_fee_button" testID="company_fee_button"
                            onPress={this._goFee}
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
                </TouchableWithoutFeedback>
            )
        } else {
            return (
                <DefaultView onPress={()=>this._loadData()} type={this.state.initStatus}/>
            )
        }
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