/**
 * Created by jinglan on 2017/9/26.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Text
} from 'react-native';
import CommonCell from '../../view/CommenCell'
import RefreshListView, {RefreshState} from '../../view/RefreshListView'
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import '../../modules/react-native-sww-activity-indicator';
import errorText from '../../util/ErrorMsg';
import Toast from 'react-native-root-toast';

const deviceWidth = Dimensions.get('window').width;

export default class VerifyResultPage extends BComponent {
    constructor(props) {
        super(props);
        this.state={

            fetchState:this.props.fetchState, //'checkRisk' ; 'checkSuccess' ;
            dataStatus:this.props.dataStatus, //  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据

            keyword: this.props.keyword,  //注册公司名称
            mobile: this.props.mobile,   //手机号
            vcode: this.props.vcode,    //验证码
            refreshState: RefreshState.Idle,
            dataList: [],

        }

        this.page =1

    }


    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    componentDidMount(){



        if (this.state.fetchState === 'checkRisk'){
            this.setState({
                fetchState:'checkRisk'
            })
            this.loadData()
        }

        if (this.state.fetchState === 'checkSuccess'){
            this.setState({
                dataStatus:'initSucess',
                fetchState:'checkSuccess'
            })
        }


    }


    loadData(){
        if(!NetInfoSingleton.isConnected) {
            this.setState({
                dataStatus:'no-net'
            })
            return;
        }

        let loading = SActivityIndicator.show(true, "加载中...");

        apis.loadVerifyCompaniesList(this.state.keyword,'1','10').then(
            (responseData) => {

                SActivityIndicator.hide(loading);

                if((responseData !== null && responseData.list !== null)){

                    let newList = responseData.list;

                    let dataList =  newList;
                    this.setState({
                        dataList: dataList,
                        refreshState: RefreshState.NoMoreData,
                    })
                        this.setState({
                            dataStatus:'initSucess'
                        })

                }else{

                    this.setState({refreshState: RefreshState.Failure})
                        this.setState({
                            dataStatus:'error'
                        })

                }

            },
            (e) => {
                SActivityIndicator.hide(loading);

                Toast.show(errorText(e));
                this.setState({refreshState: RefreshState.Failure})
                    this.setState({
                        dataStatus:'error'
                    })

            },
        );
    }


    renderItem = (info) => {
        // alert(JSON.stringify(item))
        return(

                    <CommonCell
                        centerText={info.item.name }
                        isClick={false}
                    />

        )
    };





    renderHeader = () => {
        return(

            <View style={{height: 56, width:deviceWidth,backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 16, marginLeft : 10 ,color : '#333333'}] }>相似公司</Text>
                <Text
                    textAlign='right'
                    numberOfLines={1}
                    style={[{fontSize: 16, marginRight :10 , color : '#E13238'}] }>共{this.state.dataList.length}条</Text>
            </View>

        )
    };



    emptyView = () =>{
        //第一次请求没数据的空页面
        return(
            <DefaultView type="no-data" onPress={this.refresh.bind(this)}/>
        )
    }
    refresh(){
        this.listView.refresh()
    }

    renderRisk(){
        return(

        <View style={{flex:1,flexDirection:'column',backgroundColor:'#f9f9f9'}}>
                       <View style={{height: 56, width:deviceWidth,flexDirection:'row',alignItems:'center'}}>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 16, marginLeft : 10 ,color : '#333333'}] }>公司名称：</Text>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 16, marginLeft :2 , color : '#999999'}] }>{this.state.keyword}</Text>
            </View>


            <View style={{height: 256, width:deviceWidth,flexDirection:'column',backgroundColor:'#ffffff',alignItems:'center'}}>
                <Image source={require('../../img/veryfyWarm.png')} style={{ marginTop:DeviceInfo.OS==='ios'?60:60}}>

                </Image>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 20, marginTop :30 , color : '#333333'}] }>报告老板，该名称注册通过有风险。</Text>
            </View>


            <RefreshListView
                data={this.state.dataList}
                keyExtractor = {(item, index) => index}
                renderItem={this.renderItem.bind(this)}
                refreshState={this.state.refreshState}
                //onFooterRefresh={this.onFooterRefresh}
                isHeaderRefresh={false}
                renderHeader={this.renderHeader}
            />

        </View>


        )
    }

    renderSuccess(){
        return(

            <View style={{flex:1,flexDirection:'column',backgroundColor:'#f9f9f9'}}>
                <View style={{height: 56, width:deviceWidth,flexDirection:'row',alignItems:'center'}}>
                    <Text
                        textAlign='left'
                        numberOfLines={1}
                        style={[{fontSize: 16, marginLeft : 10 ,color : '#333333'}] }>公司名称：</Text>
                    <Text
                        textAlign='left'
                        numberOfLines={1}
                        style={[{fontSize: 16, marginLeft :2 , color : '#999999'}] }>{this.state.keyword}</Text>
                </View>


                <View style={{flex:1,flexDirection:'column',backgroundColor:'#ffffff',alignItems:'center'}}>
                    <Image source={require('../../img/verifySuccess.png')} style={{width:44, height:44, marginTop:DeviceInfo.OS==='ios'?70:70}}>

                    </Image>
                    <Text
                        textAlign='left'
                        numberOfLines={1}
                        style={[{fontSize: 20, marginTop :25 , color : '#333333'}] }>报告老板，该名称可以注册。</Text>
                </View>


            </View>


        )
    }

    render() {

        if(this.state.dataStatus === 'initSucess') {
            return (
                <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                    {this.state.fetchState === 'checkRisk' && this.renderRisk()}
                    {this.state.fetchState === 'checkSuccess' && this.renderSuccess()}
                </View>
            );
        }else {
            return(
                <DefaultView onPress={()=>this.loadData()} type ={this.state.dataStatus}/>
            )
        }


    }



}