/**
 * Created by jinglan on 2018/4/24.
 */

import React  from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import BComponent from '../../base';
import * as apis from '../../apis/service';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import demoData from './local/ProfitPage.json'

import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'
import ServiceCommonCell from "./view/ServiceCommonCell";

export default class ProfitPage extends BComponent {

    constructor(props){
        super(props);
        this.state={
            data:[],
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,
            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex,
            isHideInvalidData : true
        };

    }

    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }


    loadData(date='',isPull=false){

        if (this.props.is_demo == '1'){
            this.setState({
                data:demoData.data,
            });
            return;
        }

        if(isPull){
            this.setState({
                isRefreshing:true
            })
        }else{
            this.setState({
                isLoading:true
            })
        }
        apis.loadProfitPageData(this.props.companyid,date).then(
            (responseData) => {
                if(responseData.code == 0){
                    this.setState({
                        data:responseData.data,
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false
                    })
                }else{
                    this.setState({
                        isRefreshing:false,
                        isLoading:false
                    });
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {
                this.setState({
                    isRefreshing:false,
                    isLoading:false
                });
                Toast.show('加载失败！')
            },
        );
    }






    _onRefresh(){
        this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate,true)
    }

    _showTimer(){
        this.refs.ChooseTimerModal._showTimer()
    }

    //render
    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.42+20
        if(!this.state.isfirstRefresh){
            return(
                <View style={{width:DeviceInfo.width,alignItems:'center',height:DeviceInfo.height-headerHeight,justifyContent:'center'}}>
                    <Text style={{fontSize:15,color:'#999999'}}>暂时没有查到相关数据</Text>
                </View>
            )
        }else{
            return <View />
        }
    }

    _separateView(){
        return(
            <View style={{width:DeviceInfo.width,height:12,backgroundColor:'transparent'}}/>
        )
    }

    _renderItem(item){
        let  info = item.item;
        return(
            <ServiceCommonCell
                projectName={info.projectName}
                endMonthSum={info.endMonthSum}
                endYearSum={info.endYearSum}
                endMonth={"本月"}
                endYear={"本年累计"}
                isclick={false}
            />
        )
    }



    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="利润表"  />
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <FlatList
                    renderItem={this._renderItem.bind(this)}
                    data={this.state.data}
                    keyExtractor = {(item, index) => index}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                    ListFooterComponent={this._separateView.bind(this)}
                />
                <PLPActivityIndicator isShow={this.state.isLoading} />
            </View>
        )
    }

    _callback(index){
        this.setState({
            timeIndex:index
        });
        this.loadData(this.state.timeDateArr[index].relateDate)
        this.props.callback && this.props.callback(index)
    }
}


const styles = StyleSheet.create({

    buttonStyle: {
        flexDirection:"row",
        backgroundColor: 'transparent',
        marginLeft: 14,
        borderRadius: 2,
        borderColor: '#CEAF72',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        width: 80,
    },

    buttonTextStyle: {
        marginLeft:4,
        fontSize: 12,
        color: '#CEAF72',
        textAlign: 'center'
    },

    grayBtnStyle: {
        backgroundColor: '#D8D8D8',
        marginLeft: 12,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        width: 80,
    },

    grayBtnTextStyle: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center'
    },
});