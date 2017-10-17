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
import Toast from 'react-native-root-toast'

import BComponent from '../../base';
import {scaleSize} from  '../../util/ScreenUtil'
const deviceWidth = Dimensions.get('window').width;
const col = 4
const itemMargin = scaleSize(15)
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
import DefaultView from '../../view/DefaultView'
export default class HomePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            loadState:'loading',
            isRefreshing:false,
            isFirstRefresh:true
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
        let loading
        if(this.state.isFirstRefresh){
            //第一次加载显示菊花loading
            loading = SActivityIndicator.show(true, "加载中...");

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
                        section.key = responseData.list[i].title;
                        //showtype
                        section.data = [{data:responseData.list[i].products,type:responseData.list[i].showtype}];
                        for(let j=0;j<section.data.length;j++){
                            section.data[j].key = j
                        }
                        dataSource[i] = section
                    }
                    //修改状态
                    if(this.state.isFirstRefresh){
                        //第一次加载
                        SActivityIndicator.hide(loading);
                        if(responseData.list.length == 0){
                            //没数据
                            this.setState({
                                loadState:'no-data',
                            })
                        }else{
                            //成功
                            this.setState({
                                dataSource:dataSource,
                                loadState:'success',
                                isFirstRefresh:false
                            })
                        }
                    }else{
                        //不是第一次加载
                        if(responseData.list.length == 0){
                            //没数据
                            this.setState({
                                isRefreshing:false
                            })
                        }else{
                            //成功
                            this.setState({
                                dataSource:dataSource,
                                isRefreshing:false
                            })
                        }
                    }

                }else{
                    //加载失败
                    if(this.state.isFirstRefresh){
                        //第一次加载
                        SActivityIndicator.hide(loading);
                        this.setState({
                            loadState:'error',
                        })
                    }else{
                        //不是第一次加载
                        this.setState({
                            isRefreshing:false
                        })
                    }
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')

                }
            },
            (e) => {
                Toast.show('加载失败！');

                //加载失败
                if(this.state.isFirstRefresh){
                    //第一次加载
                    SActivityIndicator.hide(loading);
                    this.setState({
                        loadState:NetInfoSingleton.isConnected?'error':'no-net',
                    })
                }else{
                    //不是第一次加载
                    this.setState({
                        isRefreshing:false
                    })
                }
            },
        );
    }

    render(){

        if(this.state.loadState == 'success'){

            return(
                <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                    <SectionList
                        renderItem={this._renderItem.bind(this)}
                        renderSectionHeader={this._renderSectionHeader.bind(this)}
                        sections={this.state.dataSource}
                        stickySectionHeadersEnabled={false}
                        ListHeaderComponent={this._listHeaderComponent.bind(this)}
                        ListFooterComponent={this._listFooterComponent.bind(this)}
                        onRefresh={this._onRefresh.bind(this)}
                        refreshing={this.state.isRefreshing}
                        removeClippedSubviews={false}
                    >
                    </SectionList>
                </View>

            )

        }else {
            return(
                <DefaultView onPress={()=>this.loadData()} type ={this.state.loadState}/>
            )
        }

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
                                    <Image source={item.logo}/>
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
            <SectionHeader style={{marginTop:10}} text ={item.section.key} />
        )
    }
    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <Image resizeMode="cover" source={require('../../img/name_bg.png')} style={{width:deviceWidth,justifyContent:'center',
                    alignItems:'center'}}>
                    <Text style={{backgroundColor:'transparent',fontSize:setSpText(16),color:'white',fontWeight:'bold'}}>免费核查公司名称,让您轻松通过工商注册</Text>
                    <TouchableOpacity   onPress={this._goVerifyName.bind(this)} style={{width:160,height:30,borderRadius:15,backgroundColor:'#CB1A19',justifyContent:'center',alignItems:'center',marginTop:15}}>
                        <Text style={{color:'white',fontSize:setSpText(16)}}>免费核名</Text>
                    </TouchableOpacity>
                </Image>
                <View style={{flexDirection:'row',width:deviceWidth,backgroundColor:'white'}}>
                    {
                        headerData.map((item,i)=>{
                            return(
                                <TouchableOpacity key={i} style={{flex:1}} onPress={()=>this._goColumnDetail(i,item)}>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Image style={{marginTop:20}} source={item.logo }/>
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

        this.props.navigator.push({
            screen: 'VerifyResultPage',
            title:'核名结果',
        });
    }
    _goProductDetail(item){
        this.props.navigator.push({
            screen: 'ProductDetailPage',
            title:item.name,
            passProps:{
                navigatorTitle : item.name,
                item
            }
        });
    }
    _goColumnDetail(index,item){
        switch (index){
            case 0:
            {
                this.props.navigator.push({
                    screen: 'ColumnDetailPage',
                    title:item.title,
                    passProps:{
                        navigatorTitle : item.title,
                        type:1
                    }
                });
            }
                break
            case 1:
            {
                this.props.navigator.push({
                    screen: 'ColumnDetailPage',
                    title:item.title,
                    passProps:{
                        navigatorTitle : item.title,
                        type:2
                    }
                });
            }
                break
            case 2:
            {
                this.props.navigator.switchToTab({
                    tabIndex: 2
                });
            }
                break
            case 3:
            {
                this.props.navigator.push({
                    screen: 'ColumnDetailPage',
                    title:item.title,
                    passProps:{
                        navigatorTitle : item.title,
                        type:3
                    }
                });
            }
                break
            case 4:
            {
                this.props.navigator.push({
                    screen: 'WebViewPage',
                    title:'加盟合作',
                    passProps:{
                        url:'https://www.baidu.com'
                    }
                });

            }
                break
            default:
                break
        }
        
    }
    _goVerifyName(){
        this.props.navigator.push({
            screen: 'VerifyNamePage',
            title:'免费核名',
        });
    }

}

