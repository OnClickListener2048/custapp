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
import demoData from './local/GeneralLedgerPage.json'

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
        };
        this._showInvalidData = this._showInvalidData.bind(this);
        this._hideInvalidData = this._hideInvalidData.bind(this);
        this._changeData = this._changeData.bind(this);
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
            this._changeData(demoData.data.generalLedgerDetail);
            if (!isPull){
                Toast.show("向左滑动即可查看余额数据!")
            }
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
                    this._changeData(responseData.data.generalLedgerDetail);
                    this.setState({
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false
                    })
                    if (!isPull){
                        Toast.show("向左滑动即可查看余额数据!")
                    }

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

    _changeData(data){
        //深拷贝
        let allDataArr = JSON.parse(JSON.stringify(data));
        let validDataArr = this._getValidData(data)
        this.setState({
            alldata:allDataArr,
            validData:validDataArr,
            data:this.state.isHideInvalidData ? validDataArr : allDataArr,
        })
    }


    _getValidData(data) {
        //数据处理 将整行与整块全是0的去掉
        let validArr = [];
        let detail = JSON.parse(JSON.stringify(data));

        for (let i = 0; i < detail.length; i++ ){
            let cellData = detail[i];
            let values = cellData.values;
            let allEmpty = true;

            for(var key in values){
                let secArr = values[key];
                let secTmpArr = [];
                for (let j = 0; j < secArr.length; j++ ) {
                    let secInfo = secArr[j];
                    secTmpArr.push(secInfo)

                    if (!(secInfo.debit == 0 && secInfo.credit == 0 && secInfo.balance == 0)){
                        allEmpty = false;
                    }
                }
                values[key] = secTmpArr;  //给values里面数组重新赋值

            }
            if (allEmpty === false){
                validArr.push(detail[i])
            }

        }
        return validArr;
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

    _onRefresh(){
        this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate,true)
    }

    _showTimer(){
        this.refs.ChooseTimerModal._showTimer()
    }

    //render
    _separateView(){
        return(
            <View style={{width:DeviceInfo.width,height:12,backgroundColor:'transparent'}}/>
        )
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
        return(
            <GeneralLedgerCell
                subjectNO={info.subjectNo}
                messageTitle={info.subjectNo + info.subjectName}
                messageTime={timeStr}
                secArr={secArr}
                generaLedgerCellPress={this._cellClick}
            />
        )
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

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="总账" year={this.state.year} month={this.state.month} callback = {this._callback.bind(this)}/>
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
                    {this.state.isHideInvalidData === false &&
                    <TouchableOpacity onPress={this._hideInvalidData}>
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