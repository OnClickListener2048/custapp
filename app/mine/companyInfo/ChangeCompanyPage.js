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

import CompanyInfoCell from './CompanyInfoCell'
import BComponent from '../../base/BComponent'
export default class ChangeCompanyPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            selectedCompanyId:'2'
        };

        UserInfoStore.getCompanyArr().then(
            (companyArr) => {
                if (companyArr) {

                    if (companyArr && companyArr.length > 0) {
                        let arr = JSON.parse(JSON.stringify(companyArr))
                        this.setState({dataSource: arr});



                    }
                }else {
                    console.log("读取数组为空");


                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );

        UserInfoStore.getCompany().then(
            (company) => {
                console.log('走你company', company);
                if (company && company.infos && company.infos.length>0) {
                    this.setState({selectedCompanyId: company.id});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    _alert(item){
        if (item.id === this.state.selectedCompanyId) {
            return;
        }

        let tipStr = '是否设置\"' + item.name + '\"为默认看账企业'
        Alert.alert('提示', tipStr, [{
            text: "确认",
            onPress: ()=>{
                this._press(item);
            },
        },{
            text: "取消",
            onPress: ()=>{
                console.log('you clicked cancel');
            },
            color:'#999999'
        }]);
    }

    _press(item){

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


    }

    _pushToCompanySurveyPage(item){
        this.push({
            screen: 'CompanySurveyPage',
            title:'我的企业',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps: {
                company:item,

            }
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigator.dismissLightBox()}>
                <View style={{flex:1}}>


                        <ScrollView style={{width: SCREEN_WIDTH,backgroundColor:'#FAFAFA'}}>
                            {
                                this.state.dataSource.map((item,index)=>{
                                    return(
                                            <CompanyInfoCell
                                                leftSelectBtnOnPress={this._alert.bind(this,item)}
                                                rightBtnOnPress={this._pushToCompanySurveyPage.bind(this,item)}
                                                underLine={(index === this.state.dataSource.length - 1 && this.state.dataSource.length > 0) ? false : true}
                                                isClick ={false}
                                                isRightBtnClick ={true}
                                                leftIcon = {item.id==this.state.selectedCompanyId?require('../../img/com_choose_select.png'):require('../../img/com_choose_normal.png')}
                                                leftText= {item.name}
                                                surviveText = {'服务中'}
                                                ownerText = {'被授权'}
                                            />

                                    )
                                })
                            }
                        </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        );
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