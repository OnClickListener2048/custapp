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

export default class CompanySurveyPage extends BComponent {


    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            phone:null,
            loadState:''
        };
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    componentDidMount(){
        UserInfoStore.getLastUserPhone().then(
            (mobile) => {
                if (mobile !== null) {
                    this.setState({
                        phone: mobile,     // 手机号
                    });
                    this._onLoadMessageInfo(mobile);
                    // this._onLoadMessageInfo('13810397064');//13810397064长炯

                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );

    }

    //企业详情接口数据请求
    _onLoadMessageInfo(phone){
        let loading = SActivityIndicator.show(true, "加载中...");
        apis.loadVerifyCompanyInfo(phone).then(

            (responseData) => {
                SActivityIndicator.hide(loading);

                if(responseData.code == 0) {
                    if(responseData.data === undefined){
                        console.log("输出返回数据"+responseData.data);
                        //没数据
                        this.setState({
                            loadState:'no-data',
                        })
                        return;
                    }

                    const companyData = [
                        {
                            title:'基本信息',
                            type:'1',
                            dataArr:responseData.data.infos===undefined?[]:responseData.data.infos,
                        },
                        {
                            title:'证照信息',
                            type:'2',
                            dataArr:responseData.data.license===undefined?[]:responseData.data.license,
                        }

                    ]

                    let dataSource = [];
                    for (let i = 0; i<companyData.length;i++){
                        let section = {};
                        section.key = companyData[i].title;
                        section.data = companyData[i].dataArr;

                        if(companyData[i].dataArr!==undefined){
                            console.log("企业信息数据="+companyData[i].dataArr);

                            for(let j=0;j<section.data.length;j++){
                                section.data[j].key = j
                            }
                        }

                        dataSource[i] = section
                    }


                    this.setState({
                        dataSource:dataSource
                        // dataSource:responseData.data
                    })
                    console.log("输出返回数据"+responseData.data);

                    //修改状态
                    SActivityIndicator.hide(loading);
                    if( responseData.data === null){
                        console.log("输出返回数据"+responseData.data);
                        //没数据
                        this.setState({
                            loadState:'no-data',
                        })
                    }else{
                        //成功
                        this.setState({
                            dataSource:dataSource,
                            loadState:'success'
                        })
                    }
                }else{
                    //加载失败
                    SActivityIndicator.hide(loading);
                    this.setState({
                        loadState:'error',
                    })

                }
            },
            (e) => {
                //加载失败
                SActivityIndicator.hide(loading);
                this.setState({
                    loadState:NetInfoSingleton.isConnected?'error':'no-net',
                })
            },
        );
    }

    render(){
        if(this.state.loadState == 'success') {
            return (
                <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
                    <SectionList
                        renderItem={this._renderItem.bind(this)}
                        renderSectionHeader={this._renderSectionHeader.bind(this)}
                        sections={this.state.dataSource}
                        stickySectionHeadersEnabled={false}
                    >
                    </SectionList>
                </View>

            )
        }else {
            return(
                <DefaultView onPress={()=>this._onLoadMessageInfo(this.state.phone)} type ={this.state.loadState}/>
            )
        }
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