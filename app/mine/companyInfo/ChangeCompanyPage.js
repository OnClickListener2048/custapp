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

    _press(item){
        if (item.id === this.state.selectedCompanyId) {
            this.props.navigator.dismissLightBox()
            this.props.callback && this.props.callback()
            return;
        }

        this.setState({
            selectedCompanyId:item.id
        })

        UserInfoStore.setCompany(item).then(
            (user) => {
                console.log("公司信息保存成功");
                DeviceEventEmitter.emit('ChangeCompany');
                this.props.navigator.dismissLightBox()
                this.props.callback && this.props.callback()
            },
            (e) => {
                console.log("公司信息保存错误:", e);
                this.props.navigator.dismissLightBox()
                this.props.callback && this.props.callback()
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
                                                leftTextStyle={{left: 4,width: SCREEN_WIDTH - 98 - 66}}
                                                leftSelectBtnOnPress={this._press.bind(this,item)}
                                                rightBtnOnPress={this._pushToCompanySurveyPage.bind(this,item)}

                                                leftImgStyle = {{left: 0}}
                                                underLine={(index === this.state.dataSource.length - 1 && this.state.dataSource.length > 0) ? false : true}
                                                style={{width: SCREEN_WIDTH,height:52,backgroundColor:'#ffffff'}}
                                                isClick ={false}
                                                isRightBtnClick ={true}

                                                leftIcon = {item.id==this.state.selectedCompanyId?require('../../img/com_choose_select.png'):require('../../img/com_choose_normal.png')}
                                                leftText= {item.name}
                                                leftTextNumLine = {2}
                                                rightView = {
                                                    <View style={{width: 98,height:50,flexDirection:'row', alignItems:'center',}}>
                                                        <View style={{width: 42,borderRadius:2,height:20,backgroundColor:'#E2D4B7',
                                                            justifyContent: 'center'}}>
                                                        <Text  style={{color:'#ffffff',textAlign:'center',fontSize:10}}>服务中</Text>
                                                        </View>
                                                        <View style={{marginLeft:5,width: 42,borderRadius:2,height:20,backgroundColor:'#B0B0B0',
                                                            justifyContent: 'center'}}>
                                                            <Text  style={{color:'#ffffff',textAlign:'center',fontSize:10}}>被授权</Text>
                                                        </View>


                                                    </View>
                                                }
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