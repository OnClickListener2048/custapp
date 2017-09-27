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
import UltimateListView from "react-native-ultimate-listview";
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import SActivityIndicator from '../../modules/react-native-sww-activity-indicator';
const deviceWidth = Dimensions.get('window').width;

export default class VerifyResultPage extends BComponent {
    constructor(props) {
        super(props);
        this.state={
            fetchState:'no-data'
        }
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    // 载入初始化数据
    onFetch = (page = 1, startFetch, abortFetch) => {

        let mesId = ''

        if (page >1){
            let arr = this.listView.getRows()
            let obj = arr[arr.length-1]
            mesId = obj.msgId
        }
        let pageSize = 10
        apis.loadMessageData(pageSize,mesId).then(
            (responseData) => {
                if((responseData !== null && responseData.data !== null)){
                    startFetch(responseData.data,page * pageSize)

                }else{
                    abortFetch()
                    this.setState({
                        fetchState:'error'
                    })
                }
            },
            (e) => {
                abortFetch()
                this.setState({
                    fetchState:'error'
                })
            },
        );
    };

    renderItem = (item, index, separator) => {
        // alert(JSON.stringify(item))
        return(

                <TouchableOpacity onPress={this._goto.bind(this)}>
                    <CommonCell
                        leftText={item.title }
                        rightText={item.date}
                        isClick={false}
                    />
                </TouchableOpacity>

        )
    };

    renderHeader = () => {
        // alert(JSON.stringify(item))
        return(

            <View style={{height: 56, width:deviceWidth,backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 16, marginLeft : 10 ,color : '#333333'}] }>相似公司</Text>
                <Text
                    textAlign='right'
                    numberOfLines={1}
                    style={[{fontSize: 16, marginRight :10 , color : '#E13238'}] }>共20条</Text>
            </View>

        )
    };


    _delete(index){
        let arr = JSON.parse(JSON.stringify(this.listView.getRows()))
        arr.splice(index,1)
        this.listView.updateDataSource(arr);
    }
    _goto(){

        this.props.navigator.push({
            screen: 'SystemMessagePage',
            title:'系统消息'
        });

    }
    renderPaginationFetchingView = () => {

        if(!NetInfoSingleton.isConnected){
            return (
                <DefaultView type='no-net' onPress={this.refresh.bind(this)}/>
            );
        }else{
            return (
                <DefaultView type={this.state.fetchState} onPress={this.refresh.bind(this)}/>
            );
        }
        //第一次请求是占位图

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
                    style={[{fontSize: 16, marginLeft :2 , color : '#999999'}] }>爱康鼎</Text>
            </View>


            <View style={{height: 256, width:deviceWidth,flexDirection:'column',backgroundColor:'#ffffff',alignItems:'center'}}>
                <Image source={require('../../img/veryfyWarm.png')} style={{ marginTop:DeviceInfo.OS==='ios'?60:60}}>

                </Image>
                <Text
                    textAlign='left'
                    numberOfLines={1}
                    style={[{fontSize: 20, marginTop :30 , color : '#333333'}] }>报告老板，该名称注册通过有风险。</Text>
            </View>


            <UltimateListView style={{flex:1,backgroundColor:'#f9f9f9'}}
                contentContainerStyle={{marginTop:0}}
                ref={(ref) => this.listView = ref}
                              header={this.renderHeader}
                onFetch={this.onFetch}
                keyExtractor={(item, index) => `${index} - ${item}`}  //this is required when you are using FlatList
                refreshable={false}
                //refreshableMode={DeviceInfo.OS==='ios'?'advanced':'basic'} //basic or advanced
                item={this.renderItem}  //this takes three params (item, index, separator)
                paginationFetchingView={this.renderPaginationFetchingView}
                emptyView={this.emptyView}
            />
        </View>


        )
    }
//f9f9f9
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
                        style={[{fontSize: 16, marginLeft :2 , color : '#999999'}] }>爱康鼎</Text>
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
        return (
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                {this.renderRisk()}
                {/*{this.renderSuccess()}*/}

            </View>
        );
    }



}