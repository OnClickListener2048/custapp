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
import GeneralLedgerCell from "./view/GeneralLedgerCell";

export default class GeneralLedgerPage extends BComponent {

    constructor(props){
        super(props)
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
        }
        this._showInvalidData = this._showInvalidData.bind(this);
        this._hideInvalidData = this._hideInvalidData.bind(this);


    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    // componentWillUnmount() {
    //     UMTool.onEvent('t_return')
    // }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }

    _deepCopy(arr) {

        var newObj = arr.concat();

        return newObj;
    }



    loadData(date='',isPull=false){
        if (this.props.is_demo == '1'){
            this.setState({
                data:demoData.data,
            })
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
        apis.loadGeneralLedgerData(this.props.companyid,date).then(
            (responseData) => {
                if(responseData.code == 0){

                    //深拷贝
                    let allDataArr = JSON.parse(JSON.stringify(responseData.data.generalLedgerDetail));

                    let detail = JSON.parse(JSON.stringify(responseData.data.generalLedgerDetail));


                    //数据处理 将整行与整块全是0的去掉
                    let tmpArr = [];

                    for (let i = 0; i < detail.length; i++ ){
                        let cellData = detail[i];
                        let values = cellData.values;

                        let allEmpty = true;

                        for(var key in values){
                            console.log("allKeys=========" + key + values[key])

                            let secArr = values[key];
                            let secTmpArr = [];
                            for (let j = 0; j < secArr.length; j++ ) {
                                let secInfo = secArr[j];
                                if (!(secInfo.debit == 0 && secInfo.credit == 0 && secInfo.balance == 0)){
                                    secTmpArr.push(secInfo)
                                }
                            }

                            values[key] = secTmpArr;  //给values里面数组重新赋值
                            if (secTmpArr.length > 0){
                                allEmpty = false;
                            }
                        }

                        if (allEmpty === false){
                            tmpArr.push(detail[i])
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


    _renderItem(item){
        let  info = item.item;
        let timeStr = "";
        let secArr = [];
        let values = info.values;

        for(var key in values){
            timeStr = key;
            secArr = values[key];

        }

        // secArr={secArr}


        return(
            <GeneralLedgerCell
                messageTitle={info.subjectNo + info.subjectName}
                messageTime={timeStr}
                secArr={secArr}
            />

        )
    }

    //跳转记账凭证详情
    _goVoucherDetail(item){
        if (this.props.is_demo == '1'){
            Toast.show('演示数据暂不支持查看凭证详情！')
            return;
        }
        this.push({
            screen: 'AccountVoucherPage',
            title:'记账凭证',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                companyName:this.props.companyName,
                dataDetail:item.item,
                relatedate:this.state.timeDateArr[this.state.timeIndex].relateDate
            }
        })
    }

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


    render(){

        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="总账" year={this.state.year} month={this.state.month} callback = {this._callback.bind(this)}/>
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <View style={{height:59,backgroundColor:"#ffffff",flexDirection:"row",alignItems:"center"}}>

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