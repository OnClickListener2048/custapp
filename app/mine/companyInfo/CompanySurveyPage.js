/**
 * Created by zhuangzihao on 2017/9/19.
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
import Toast from 'react-native-root-toast';

const companyData = [
    {
        title:'基本信息',
        type:'1',
        dataArr:[
            {
                title:'纳税信用等级',
                subTitle:'A级'
            },
            {
                title:'纳税人状态',
                subTitle:'正常'
            },
            {
                title:'纳税类型',
                subTitle:'小规模纳税人'
            },
            {
                title:'公司地址',
                subTitle:'北京市海淀区魏公村23号'
            },
            {
                title:'电话',
                subTitle:'13666666666'
            },
            {
                title:'开户银行',
                subTitle:'中国建设银行魏公村支行'
            },
            {
                title:'银行账号',
                subTitle:'11001100110011001100'
            },
        ]
    },
    {
        title:'证照信息',
        type:'2',
        dataArr:[
            {
                title:'组织机构代码正本',
            },
            {
                title:'企业法人营业执照副本',
            }
        ]
    }

]
export default class CompanySurveyPage extends BComponent {


    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
        };
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };
    componentDidMount(){
        this._onLoadMessageInfo();
    }

    //企业详情接口数据请求
    _onLoadMessageInfo(){
        let loading = SActivityIndicator.show(true, "加载中...");
        apis.loadVerifyCompanyInfo('18088888888').then(

            (responseData) => {
                SActivityIndicator.hide(loading);

                if(responseData !== null && responseData.data !== null) {

                    const companyData = [
                        {
                            title:'基本信息',
                            type:'1',
                            dataArr:[
                                {
                                    title:'纳税信用等级',
                                    subTitle:responseData.data.tax_credit_rating,
                                },
                                {
                                    title:'纳税人状态',
                                    subTitle:responseData.data.tax_status,
                                },
                                {
                                    title:'纳税类型',
                                    subTitle:responseData.data.tax_type,
                                },
                                {
                                    title:'公司地址',
                                    subTitle:responseData.data.address,
                                },
                                {
                                    title:'电话',
                                    subTitle:responseData.data.tel,
                                },
                                {
                                    title:'开户银行',
                                    subTitle:responseData.data.bank,
                                },
                                {
                                    title:'银行账号',
                                    subTitle:responseData.data.bank_card,
                                },
                            ]
                        },
                        {
                            title:'证照信息',
                            type:'2',
                            dataArr:responseData.data.license,
                        }

                    ]

                    let dataSource = [];
                    for (let i = 0; i<companyData.length;i++){
                        let section = {};
                        section.key = companyData[i].title;
                        section.data = companyData[i].dataArr;
                        for(let j=0;j<section.data.length;j++){
                            section.data[j].key = j
                        }
                        dataSource[i] = section
                    }


                    this.setState({
                        dataSource:dataSource
                        // dataSource:responseData.data
                    })

                }
            },
            (e) => {
                SActivityIndicator.hide(loading);

                Toast.show(errorText( e ));
            },
        );
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <SectionList
                    renderItem={this._renderItem.bind(this)}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    sections={this.state.dataSource}
                    stickySectionHeadersEnabled={false}
                >
                </SectionList>
            </View>

        )
    }
    _renderItem (item) {

        if (item.item.subTitle == undefined){
            return(
                <CommenCell
                    leftText={item.item.name}
                    onPress = {this._click.bind(this,item.item,item.item.name)}
                />
            )
        }else{
            return(
                <OtherCell
                    title={item.item.title}
                    subTitle={item.item.subTitle}
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
        this.props.navigator.push({
            screen: 'LicenceInfoPage',
            title:name,
            passProps: {
                licenceinfo:licenceinfo,
            }

        });
    }

}

class OtherCell extends Component {

    static defaultProps = {
        title:'我是标题',//是标题
        subTitle:'我是副标题'//副标题
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