/**
 * Created by jinglan on 2018/4/13.
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
import demoData from './local/VouchersListPage.json'

import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'
import BalanceSheetCell from "./view/BalanceSheetCell";

export default class BalanceSheetPage extends BComponent {

    constructor(props){
        super(props);
        this.state={
            data:[],
            alldata:[],  //全部数据
            validData:[], //有效数据
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,
            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex,
            isHideInvalidData : true
        };
        this._showInvalidData = this._showInvalidData.bind(this);
        this._hideInvalidData = this._hideInvalidData.bind(this);



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
        apis.loadBalancesheet(this.props.companyid,date).then(
            (responseData) => {
                if(responseData.code == 0){

                    //深拷贝
                    let allDataArr = JSON.parse(JSON.stringify(responseData.data));

                    //对全部数据做二次处理,将cell数据包括cell名称改为数组
                    for (let i = 0 ; i < allDataArr.length ; i++){
                        let cellInfo = allDataArr[i];
                        let secArr = [];
                        let preData = {"abstract" : "期初",
                                    "sumDebit" : cellInfo.accountBalance.preSumDebit,
                                    "sumCredit" : cellInfo.accountBalance.preSumCredit,
                        };

                        let midData = {"abstract" : "本期",
                            "sumDebit" : cellInfo.accountBalance.midSumDebit,
                            "sumCredit" : cellInfo.accountBalance.midSumCredit,
                        };

                        let yearData = {"abstract" : "本年",
                            "sumDebit" : cellInfo.accountBalance.yearSumDebit,
                            "sumCredit" : cellInfo.accountBalance.yearSumCredit,
                        };

                        secArr.push(preData,midData,yearData);
                        cellInfo.detailArr = secArr
                    }


                    //深拷贝有效数据
                    let validArr = JSON.parse(JSON.stringify(responseData.data));

                    //数据处理 将整行与整块全是0的去掉
                    let tmpArr = [];

                    //对有效数据做二次处理,将cell数据包括cell名称改为数组
                    for (let i = 0 ; i < allDataArr.length ; i++){
                        let cellInfo = allDataArr[i];
                        let secArr = [];

                        if (!(cellInfo.accountBalance.preSumDebit == 0 && cellInfo.accountBalance.preSumCredit == 0)){
                            let preData = {"abstract" : "期初",
                                "sumDebit" : cellInfo.accountBalance.preSumDebit,
                                "sumCredit" : cellInfo.accountBalance.preSumCredit,
                            };
                            secArr.push(preData)
                        }


                        if (!(cellInfo.accountBalance.midSumDebit == 0 && cellInfo.accountBalance.midSumCredit == 0)){
                            let midData = {"abstract" : "本期",
                                "sumDebit" : cellInfo.accountBalance.midSumDebit,
                                "sumCredit" : cellInfo.accountBalance.midSumCredit,
                            };
                            secArr.push(midData)
                        }


                        if (!(cellInfo.accountBalance.midSumDebit == 0 && cellInfo.accountBalance.midSumCredit == 0)){
                            let yearData = {"abstract" : "本年",
                                "sumDebit" : cellInfo.accountBalance.yearSumDebit,
                                "sumCredit" : cellInfo.accountBalance.yearSumCredit,
                            };
                            secArr.push(yearData)
                        }



                        if (secArr.length > 0){
                            cellInfo.detailArr = secArr
                            tmpArr.push(cellInfo)
                        }

                    }




                    this.setState({
                        alldata:allDataArr,
                        validData:tmpArr,
                        data:this.state.isHideInvalidData ? tmpArr : allDataArr,
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false
                    })
                }else{
                    this.setState({
                        isRefreshing:false,
                        isLoading:false

                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {
                this.setState({
                    isRefreshing:false,
                    isLoading:false
                })
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


    //click

    _showInvalidData(){
        this.setState({
            data:this.state.alldata,
            isHideInvalidData:false
        })
    }
    _hideInvalidData(){
        this.setState({
            data:this.state.validData,
            isHideInvalidData:true
        })
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
        let secArr = info.detailArr;

        return(
            <BalanceSheetCell
                messageTitle={info.subjectNo + info.subjectName}
                secArr={secArr}
            />
        )
    }

    render(){

        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="科目余额表" year={this.state.year} month={this.state.month} callback = {this._callback.bind(this)}/>
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <View style={{height:59,backgroundColor:"#F1F1F1",flexDirection:"row",alignItems:"center"}}>

                    <TouchableOpacity onPress={this._hideInvalidData}>
                        <View style={[styles.grayBtnStyle]}>
                            <Text style={styles.grayBtnTextStyle}>{"无效数据"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._showInvalidData}>
                        <View style={[styles.buttonStyle]}>
                            <Text style={styles.buttonTextStyle}>{"√无效数据"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FlatList
                    renderItem={this._renderItem.bind(this)}
                    data={this.state.data}
                    keyExtractor = {(item, index) => index}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                    ItemSeparatorComponent={this._separateView.bind(this)}
                />
                <PLPActivityIndicator isShow={this.state.isLoading} />
            </View>
        )
    }
    _callback(index){
        this.setState({
            timeIndex:index
        })
        this.loadData(this.state.timeDateArr[index].relateDate)
        this.props.callback && this.props.callback(index)
    }

}

const styles = StyleSheet.create({


    buttonStyle: {
        backgroundColor: 'transparent',
        marginLeft: 14,
        borderRadius: 2,
        borderColor: '#CEAF72',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        width: 76,
    },

    buttonTextStyle: {
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
        width: 76,
    },
    grayBtnTextStyle: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center'
    },
});