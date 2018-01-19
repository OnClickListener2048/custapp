/**
 * Created by jiaxueting on 2017/10/19.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SectionList
} from 'react-native';

import CommenCell from '../../view/CommenCell'
import SectionHeader from '../../view/SectionHeader'
import BComponent from '../../base/BComponent'
import * as apis from '../../apis/index';
import DefaultView from "../../view/DefaultView";
import PLPActivityIndicator from "../../view/PLPActivityIndicator";

export default class CompanySurveyPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            phone: null,
            loadState: '',
            owner: false, //是否有权限授权,默认无授权
            company :this.props.company,
            companyid:'',
        };
    }


    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    //点击右按钮
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'edit') { // this is the same id field from the static navigatorButtons definition
                console.log("跳转传值", this.state.companyid);
                // 获取公司地址
                const company = this.props.company;
                // UserInfoStore.getCompany().then(
                //     (company) => {
                        console.log('company', company);
                        if (company) {
                            console.log("授权手机号" + company.id+company.name);
                            this.setState({companyid: company.id});
                            //获取当前授权人的手机号
                            UserInfoStore.getLastUserPhone().then(
                                (mobile) => {
                                    console.log("授权手机号" + mobile);
                                    this.setState({ownerMobile: mobile});
                                    console.log("公司ID,授权手机号" + company.id, mobile);
                                    this.push({
                                        screen: 'AccreditPhonePage',
                                        title: '授权看账',
                                        backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                                        passProps: {
                                            companyid: company.id,
                                            companyname:company.name,
                                            ownerMobile: mobile,
                                        },
                                    });
                                }
                            );
                        }

                //     }
                // );

            }
        }

    }

    componentDidMount() {
        this._onLoadMessageInfo();
    }

    //企业详情接口数据请求

    _onLoadMessageInfo() {

        let company = this.props.company;
        if (company && company.owner) {
            console.log(company.owner);
            this.setState({
                owner: company.owner,
            })
            if (company.owner) {
                this.props.navigator.setButtons({
                    rightButtons: [
                        {
                            title: '授权', // for a textual button, provide the button title (label)
                            buttonColor: 'white', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                            buttonFontSize: 18, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                            buttonFontWeight: 'normal', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                            id: 'edit'
                        }]
                })
            } else {
                this.props.navigator.setButtons({
                    rightButtons: []
                })
            }
        }
        if (company && company.infos && company.infos.length > 0) {
            console.log("输出返回数据company" + company);
            console.log("输出返回数据company" + company.infos);

            const companyData = [
                {
                    title: '基本信息',
                    type: '1',
                    dataArr: company.infos === undefined ? [] : company.infos,
                },
                {
                    title: '证照信息',
                    type: '2',
                    dataArr: company.license === undefined ? [] : company.license,
                }

            ]
            console.log("到这里1");

            let dataSource = [];
            for (let i = 0; i < companyData.length; i++) {
                let section = {};
                section.key = companyData[i].title;
                section.data = companyData[i].dataArr;

                if (companyData[i].dataArr !== undefined) {
                    console.log("企业信息数据=" + companyData[i].dataArr);

                    for (let j = 0; j < section.data.length; j++) {
                        section.data[j].key = j
                    }
                }

                dataSource[i] = section
            }

            console.log("到这里2");

            this.setState({
                owner: company.owner,
                dataSource: dataSource
            })
            console.log("输出返回数据" + company);

            //修改状态


            //成功
            this.setState({
                dataSource: dataSource,
                loadState: 'success'
            })

        } else {
            this.setState({
                loadState: 'no-data',
            })
        }
    }




    render(){
        console.log("输出企业信息数据，"+this.state.dataSource);
        return (
            <View style={{flex: 1, backgroundColor: '#F1F1F1'}}>
                {this.state.loadState == 'success'?
                    <SectionList
                    renderItem={this._renderItem.bind(this)}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    sections={this.state.dataSource}
                    stickySectionHeadersEnabled={false}
                >
                </SectionList>:<DefaultView onPress={()=>this._onLoadMessageInfo()} type ={this.state.loadState}/>
                }
            </View>

            )

    }
    _renderItem (item) {
        if (item.item.value === undefined){
            return(
                <CommenCell
                    leftText={item.item.name}
                    onPress = {this._click.bind(this,item.item,item.item.name)}
                />
            )
        }else{
            return(
                <OtherCell
                    title={item.item.name}
                    subTitle={item.item.value}
                />
            )
        }



    }
    _renderSectionHeader(item){
        return(
            <SectionHeader style={{backgroundColor:"transparent"}}  text ={item.section.key} />
        )
    }

    _click(licenceinfo,name){
        this.push({
            screen: 'LicenceInfoPage',
            title:name,
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps: {
                licenceinfo:licenceinfo,
            }

        });
    }

}

class OtherCell extends Component {

    static defaultProps = {
        title:'',//是标题
        subTitle:' '//副标题
    };

    render(){
        return(
            <View style={{width:DeviceInfo.width,backgroundColor:'white',padding:14,borderBottomColor:'#ececec',
                borderBottomWidth:0.5,}}>
                <Text style={{fontSize:16,color:'#333333'}}>{this.props.title}</Text>
                <Text style={{fontSize:14,color:'#999999',marginTop:5}}>{this.props.subTitle}</Text>
            </View>
        )
    }
}