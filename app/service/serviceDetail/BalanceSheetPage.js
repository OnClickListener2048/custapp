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
import demoData from './local/BalanceSheetPage.json'

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
        this._changeData = this._changeData.bind(this);
        this._getAllData = this._getAllData.bind(this);
        this._getValidData = this._getValidData.bind(this);
        this._cellClick = this._cellClick.bind(this);


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
            this._updateData(demoData.data);
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
                    this._updateData(responseData.data);
                    this.setState({
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

    _updateData(data){
        let responseTmpArr = this._changeData(data);
        let allDataArr = this._getAllData(responseTmpArr);
        let validArr = this._getValidData(responseTmpArr);

        this.setState({
            alldata:allDataArr,
            validData:validArr,
            data:this.state.isHideInvalidData ? validArr : allDataArr,
        })
    }

    //数据处理
    _changeData(data){
        //将二维数组处理成一维数组
        let responseArr = JSON.parse(JSON.stringify(data));

        let responseTmpArr = [];
        for (let i = 0 ; i < responseArr.length ; i++){
            let cellInfo = responseArr[i];

            responseTmpArr.push(cellInfo)

            let childSubjectinfo = cellInfo.childSubject;

            for(var key in childSubjectinfo){
                let secCellInfo = {};
                // console.log("allKeys=========" + key + childSubjectinfo[key])
                let childInfo = childSubjectinfo[key];
                secCellInfo.subjectNo = childInfo.subjectNo;
                secCellInfo.subjectName = childInfo.subjectName;
                secCellInfo.accountBalance = childInfo.accountBalance;
                responseTmpArr.push(secCellInfo)
            }
        }
        return responseTmpArr;
    }

    _getAllData(data){
        //深拷贝
        let allDataArr = JSON.parse(JSON.stringify(data));

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

            let endData = {"abstract" : "期末",
                "sumDebit" : cellInfo.accountBalance.endSumDebit,
                "sumCredit" : cellInfo.accountBalance.endSumCredit,
            };

            secArr.push(preData,midData,yearData,endData);
            cellInfo.detailArr = secArr
        }
        return allDataArr;
    }

    _getValidData(data){

        //深拷贝有效数据
        let validArr = JSON.parse(JSON.stringify(data));

        //数据处理 将整行与整块全是0的去掉
        let validTmpArr = [];

        //对有效数据做二次处理,将cell数据包括cell名称改为数组
        for (let i = 0 ; i < validArr.length ; i++){
            let cellInfo = validArr[i];
            let secArr = [];





            if (!(cellInfo.accountBalance.preSumDebit == 0 && cellInfo.accountBalance.preSumCredit == 0 && cellInfo.accountBalance.midSumDebit == 0 && cellInfo.accountBalance.midSumCredit == 0
                && cellInfo.accountBalance.yearSumDebit == 0 && cellInfo.accountBalance.yearSumCredit == 0 && cellInfo.accountBalance.endSumDebit == 0
                && cellInfo.accountBalance.endSumCredit == 0)){
                let preData = {"abstract" : "期初",
                    "sumDebit" : cellInfo.accountBalance.preSumDebit,
                    "sumCredit" : cellInfo.accountBalance.preSumCredit,
                };
                secArr.push(preData)

                let midData = {"abstract" : "本期",
                    "sumDebit" : cellInfo.accountBalance.midSumDebit,
                    "sumCredit" : cellInfo.accountBalance.midSumCredit,
                };
                secArr.push(midData)

                let yearData = {"abstract" : "本年",
                    "sumDebit" : cellInfo.accountBalance.yearSumDebit,
                    "sumCredit" : cellInfo.accountBalance.yearSumCredit,
                };
                secArr.push(yearData)

                let endData = {"abstract" : "期末",
                    "sumDebit" : cellInfo.accountBalance.endSumDebit,
                    "sumCredit" : cellInfo.accountBalance.endSumCredit,
                };
                secArr.push(endData)

            }


            if (secArr.length > 0){
                cellInfo.detailArr = secArr
                validTmpArr.push(cellInfo)
            }
        }

        return validTmpArr;
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
        let secArr = info.detailArr;
        return(
            <BalanceSheetCell
                messageTitle={info.subjectNo + " " + info.subjectName}
                subjectNO={info.subjectNo}
                secArr={secArr}
                banceCellPress={this._cellClick}
            />
        )
    }

    _cellClick(subjectNo,subjectTitle){

        if (this.props.is_demo == '1'){
            Toast.show("演示数据暂不支持查看明细账详情！")
        }else {
            this.props.navigator.push({
                screen: 'DetailAccountPage',
                title:subjectTitle,
                passProps: {
                    subjectNo:subjectNo,
                    timeDateArr:this.state.timeDateArr,
                    timeIndex:this.state.timeIndex,
                    companyid:this.props.companyid,
                    companyName:this.props.companyName,
                }
            });
        }

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

                    {this.state.isHideInvalidData === true && <TouchableOpacity onPress={this._showInvalidData}>
                        <View style={[styles.grayBtnStyle]}>
                            <Text style={styles.grayBtnTextStyle}>{"无效数据"}</Text>
                        </View>
                    </TouchableOpacity>}
                    {this.state.isHideInvalidData === false && <TouchableOpacity onPress={this._hideInvalidData}>
                        <View style={[styles.buttonStyle]}>
                            <Image
                                source={require('../../img/invalid_btn_tip.png')}/>

                            <Text style={styles.buttonTextStyle}>{"无效数据"}</Text>
                        </View>
                    </TouchableOpacity>}
                </View>
                <FlatList
                    renderItem={this._renderItem.bind(this)}
                    data={this.state.data}
                    keyExtractor = {(item, index) => index}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                    ItemSeparatorComponent={this._separateView.bind(this)}
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