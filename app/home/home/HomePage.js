/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
   View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
    Platform,
    ImageBackground
} from 'react-native';
import SectionHeader from '../../view/SectionHeader'
import * as apis from '../../apis';
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import BComponent from '../../base';
import {scaleSize} from  '../../util/ScreenUtil'
import Toast from 'react-native-root-toast'

import {H5_URL} from '../../config'
const deviceWidth = Dimensions.get('window').width;
const col = 4
const itemMargin = scaleSize(10)
const itemWidth = (deviceWidth - itemMargin*(col+1))/col
const headerData = [
    {
        'title':'注册公司',
        "logo":require('../../img/register.png')
    },
    {
        'title':'记账报税',
        "logo":require('../../img/Accounting.png')
    },
    {
        'title':'财务报表',
        "logo":require('../../img/Finance.png')
    },
    {
        'title':'企业变更',
        "logo":require('../../img/changeConpany.png')
    },
    {
        'title':'加盟合作',
        "logo":require('../../img/registerConpany1.png')
    }
]
const footData = [
    {
        'title':'安全',
        "logo":require('../../img/safe.png')
    },
    {
        'title':'专业',
        "logo":require('../../img/major.png')
    },
    {
        'title':'价优',
        "logo":require('../../img/money.png')
    },
    {
        'title':'智能',
        "logo":require('../../img/Intelligence.png')
    },
    {
        'title':'放心',
        "logo":require('../../img/worry.png')
    },
    {
        'title':'贴心',
        "logo":require('../../img/peace.png')
    }
]
export default class HomePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            loadState:'success',
            isRefreshing:false,
            isFirstRefresh:true,
            isLoading:true
        };
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };
    componentDidMount(){
        this.loadData()
    }


    loadData(type = '0'){
        // let loading
        if(this.state.isFirstRefresh){
            //第一次加载显示菊花loading

            this.setState({
                isLoading:true
            })

        }else{
            //显示下拉loading
            this.setState({
                isRefreshing:true
            })
        }
        apis.loadHomeData(type).then(
            (responseData) => {
                if(responseData.code == 0){
                    //成功后处理数据
                    let dataSource = [];
                    for (let i = 0; i<responseData.list.length;i++){
                        let section = {};
                        section.title = responseData.list[i].name;
                        section.key = i;
                        //showtype
                        section.data = [{data:responseData.list[i].products,type:responseData.list[i].showtype?responseData.list[i].showtype:'1'}];
                        for(let j=0;j<section.data.length;j++){
                            section.data[j].key = j
                        }
                        dataSource[i] = section
                    }
                    //修改状态
                    if(responseData.list.length == 0){
                        //没数据
                        this.setState({
                            loadState:'no-data',
                            isLoading:false,
                            isFirstRefresh:false,
                            isRefreshing:false
                        })
                    }else{
                        //成功
                        this.setState({
                            dataSource:dataSource,
                            loadState:'success',
                            isFirstRefresh:false,
                            isLoading:false,
                            isRefreshing:false

                        })
                    }

                }else{
                    //加载失败
                    this.setState({
                        loadState:'error',
                        isLoading:false,
                        isRefreshing:false,
                        isFirstRefresh:false,
                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')

                }
            },
            (e) => {
                Toast.show('加载失败！');

                //加载失败
                this.setState({
                    loadState:NetInfoSingleton.isConnected?'error':'no-net',
                    isLoading:false,
                    isRefreshing:false,
                    isFirstRefresh:false,
                })
            },
        );
    }

    _listEmptyComponent(){
        let h = 0;
        if (DeviceInfo.OS === 'ios'){
            h = DeviceInfo.height-60-110-64-(DeviceInfo.width*0.42)-44;
        }else{
            h = DeviceInfo.height-50-110-44-(DeviceInfo.width*0.42)-44;
        }


            if(this.state.loadState == 'no-data'){
                return(
                    <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Text style={{fontSize:setSpText(15),color:'#999999'}}>暂时没有查到相关数据</Text>
                        <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请致电客服热线:400-107-0110</Text>
                    </View>
                )
            }else if(this.state.loadState == 'no-net'){
                return(
                    <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Text style={{fontSize:setSpText(15),color:'#999999'}}>网络请求失败</Text>
                        <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请检查您的网络</Text>
                    </View>
                )

            }else if(this.state.loadState == 'error'){
                return(
                    <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Text style={{fontSize:setSpText(15),color:'#999999'}}>网络请求失败</Text>
                        <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请检查您的网络</Text>
                    </View>
                )
            }else{
                //成功
                return(
                    <View style={{width:DeviceInfo.width, height:h,backgroundColor:'white'}}>

                    </View>
                )
            }



    }
    render(){

        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <SectionList
                    renderItem={this._renderItem.bind(this)}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    sections={this.state.dataSource}
                    stickySectionHeadersEnabled={false}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    ListFooterComponent={this._listFooterComponent.bind(this)}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                >
                </SectionList>
                <PLPActivityIndicator isShow={this.state.isLoading} />

            </View>
        )
    }
    _onRefresh(){
        this.loadData()
    }
    _renderItem (item) {

        if(item.item.type == '1'){
            return(
                <View style={{flexDirection:'row',flexWrap:'wrap',flex:1,paddingBottom:10,backgroundColor:'white'}}>
                    {
                        item.item.data.map((item, i) => {
                            return(
                                <TouchableOpacity key={i} onPress={this._goProductDetail.bind(this,item)}>
                                    <View style={{width:itemWidth,marginLeft:itemMargin,justifyContent:'center',alignItems:'center'}}>
                                        <Image resizeMode="contain" style={{marginTop:10, width:25,height:25}} source={{uri:item.icon}}/>
                                        <Text style={{marginTop:15,marginBottom:10,fontSize:setSpText(14),color:'#666666'}}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }else if(item.item.type == '2'){
            return (
                <View style={{width:deviceWidth,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',paddingBottom:20,backgroundColor:'white'}}>
                    {
                        item.item.data.map((item, i) => {
                            return(
                                <TouchableOpacity key={i} onPress={this._goProductDetail.bind(this,item)}>
                                    <Image resizeMode="cover" style={{justifyContent:'center',alignItems:'center',width:136,height:68,marginTop:10}} source={{uri:item.icon}}>
                                        <Text style={{backgroundColor:'transparent',fontSize:setSpText(16),color:'white',fontWeight:'bold'}}>{item.name}</Text>
                                    </Image>
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            )
        }else{
            return null
        }


    }
    _listFooterComponent(){
        return(
            <View style={{backgroundColor:'white'}}>
                <View style={{width:deviceWidth,height:10,backgroundColor:'#F9F9F9'}}/>
                <View style={{width:deviceWidth,flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        footData.map((item,index)=>{
                            return (
                                <View key={index} style={[{width:deviceWidth/3,flexDirection:'row',padding:10,justifyContent:'center',alignItems:'center'},index<3?{borderBottomWidth:1.5,borderBottomColor:'#f9f9f9'}:{},index%3<2?{borderRightWidth:1.5,borderRightColor:'#f9f9f9'}:{}]}>
                                    <Image resizeMode="contain" style={{width:25, height:25}} source={item.logo}/>
                                    <Text style={{fontSize:setSpText(14), color:'#333333',marginLeft:10}}>{item.title}</Text>
                                </View>
                            )
                        })
                    }
                    <View style={{width:deviceWidth,justifyContent:'center',alignItems:'center',padding:30,backgroundColor:'#F9F9F9'}}>
                        <Text style={{color:'#F9990A',fontSize:setSpText(18)}}>小企业财税管家</Text>
                        <Text style={{fontSize:12,color:'#999999',marginTop:5}}>热线电话：400-107-0110</Text>
                    </View>
                </View>
            </View>

        )
    }
    _renderSectionHeader(item){
        return(
            <SectionHeader style={{marginTop:10}} text ={item.section.title} />
        )
    }
    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <TouchableOpacity onPress={this._goVerifyName.bind(this)}>
                    <Image resizeMode="cover" source={require('../../img/banner.png')} style={{width:deviceWidth,height:DeviceInfo.width*0.42}}>

                    </Image>
                </TouchableOpacity>
                <View style={{flexDirection:'row',width:deviceWidth,backgroundColor:'white'}}>
                    {
                        headerData.map((item,i)=>{
                            return(
                                <TouchableOpacity key={i} style={{flex:1}} onPress={()=>this._goColumnDetail(i,item)}>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Image style={{marginTop:20,width:45,height:45}} source={item.logo }/>
                                        <Text  style={{marginTop:10,fontSize:setSpText(12),color:'#666666',marginBottom:20}}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>

        )
    }



    _goVerifyResultPage(){

        this.push({
            screen: 'VerifyResultPage',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            title:'核名结果',
        });
    }
    _goProductDetail(item){
        UMTool.onEvent(item.eventsid)
        this.push({
            screen: 'WebViewPage',
            title:item.name,
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                url:item.url
            }
        });
    }
    _goColumnDetail(index,item){
        switch (index){
            case 0:
            {
                UMTool.onEvent('registerCompany')
                this.push({
                    screen: 'WebViewPage',
                    title:'注册公司',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        url:H5_URL+'register?platform=app'
                    }
                });
            }
                break
            case 1:
            {
                UMTool.onEvent('accountingAndTax')
                this.push({
                    screen: 'WebViewPage',
                    title:'记账报税',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        url:H5_URL+'accounting?platform=app'
                    }
                });
            }
                break
            case 2:
            {
                this.props.navigator.switchToTab({
                    tabIndex: 1
                });
                UMTool.onEvent('financialReport')

            }
                break
            case 3:
            {
                UMTool.onEvent('enterpriseChange')
                this.push({
                    screen: 'WebViewPage',
                    title:'企业变更',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        url:H5_URL+'change?platform=app'
                    }
                });
            }
                break
            case 4:
            {
                UMTool.onEvent('leagueCooperation')
                this.push({
                    screen: 'WebViewPage',
                    title:'加盟合作',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        url:H5_URL+'invest?platform=app'
                    }
                });

            }
                break
            default:
                break
        }
        
    }
    _goVerifyName(){
        UMTool.onEvent('homepage_checkname')
        this.push({
            screen: 'VerifyNamePage',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            title:'免费核名',
        });
    }

}

