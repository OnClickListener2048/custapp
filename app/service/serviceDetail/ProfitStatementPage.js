/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React,{Component}  from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    InteractionManager
} from 'react-native';
import SectionHeader from '../../view/SectionHeader'
import BComponent from '../../base';
import HeaderView from '../view/HeaderView'
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'
import {exportFile} from '../../util/XlsxTool'

import demoData from './local/ProfitStatementPage.json'
export default class ProfitStatementPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            profit:'- -',
            income:'- -',
            expenditure:'- -',
            dataSource:[],
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,
            xslxData:[],
            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex,



        };
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    componentWillUnmount() {
        UMTool.onEvent('p_return')
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }
    _shareToWeXin(){
        exportFile(this.state.xslxData,'净利润',[{wpx: DeviceInfo.width/4}, {wpx: DeviceInfo.width/4}, {wpx: DeviceInfo.width/4}, {wpx: DeviceInfo.width/4}])

    }
    loadData(date='',isPull=false){

        if(this.props.is_demo=='1'){

            let dic =demoData.list[this.state.timeIndex];
            let arr = [];
            for(let i=this.state.timeIndex-1;i>=0;i--){

                arr.push(demoData.list[demoData.list.length-1-i])
            }

            this.setState({
                profit:dic.profit,
                income:dic.income,
                expenditure:dic.expenditure,
                dataSource:arr,
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

        apis.loadProfit(this.props.companyid,date).then(
            (responseData) => {
                if(responseData.code == 0){
                    let xslxData = [['月份','利润','收入','支出']]
                    for(let i = 0 ;i<responseData.list.length; i++){
                        let dic = responseData.list[i];
                        xslxData.push([dic.date,dic.profit,dic.income,dic.expenditure])
                    }

                    this.setState({
                        profit:responseData.profit?responseData.profit:'- -',
                        income:responseData.income?responseData.income:'- -',
                        expenditure:responseData.expenditure?responseData.expenditure:'- -',
                        dataSource:responseData.list?responseData.list:[],
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false,
                        xslxData:xslxData
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

    _renderItem(item){
        return(
            <Cell item={item}/>
        )
    }

    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <HeaderView
                    hasTop={true}
                    topDes="本月利润"
                    topNum={this.state.profit}
                    leftDes="收入"
                    leftNum={this.state.income}
                    rightDes="支出"
                    rightNum={this.state.expenditure}


                />
                <SectionHeader style={{backgroundColor:'#F1F1F1'}} leftViewStyle={{backgroundColor:'#C6A567'}} text="本年历史利润"/>
            </View>
        )
    }
    _showTimer(){
        this.refs.ChooseTimerModal._showTimer()
    }
    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.56
        if(!this.state.isfirstRefresh){
            return(
                <View style={{width:DeviceInfo.width,alignItems:'center',height:DeviceInfo.height-headerHeight,justifyContent:'center'}}>
                    <Text style={{fontSize:15,color:'#999999'}}>暂时没有查到相关数据</Text>
                    {/*<Text style={{fontSize:15,color:'#999999',marginTop:10}}>或者致电客服热线:400-107-0110</Text>*/}
                </View>
            )
        }else{
            return <View />
        }

    }
    render(){

        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="净利润" shareToWeXin = {this._shareToWeXin.bind(this)}/>
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor = {(item, index) => index}
                    renderItem={this._renderItem.bind(this)}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                {/*<ChooseTimerModal ref="ChooseTimerModal" disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>*/}
                <PLPActivityIndicator isShow={this.state.isLoading} />

            </View>
        )
    }

    _callback(index){
        this.setState({
            timeIndex:index
        },()=>{
            this.loadData(this.state.timeDateArr[index].relateDate)
            this.props.callback && this.props.callback(index)
        })
        // alert(this.state.timeDateArr[index].relateDate)
    }
}

class Cell extends Component{

    render(){
        return(
            <View style={[{width:DeviceInfo.width,height:85,backgroundColor:'white',paddingLeft:13,flexDirection:'row',alignItems:'center'},this.props.item.index==0?{marginTop:0}:{marginTop:10}]}>
                <View style={[{width:30,height:85,justifyContent:'center',alignItems:'center'},this.props.item.index%2==0?{backgroundColor:'#C6A567'}:{backgroundColor:'#EB5B47'}]}>
                    <Text style={{fontSize:setSpText(16),color:'white'}}>{this.props.item.item.date}</Text>
                    <Text style={{fontSize:setSpText(16),color:'white',marginTop:5}}>月</Text>
                </View>
                <View style={{flex:1,borderRightWidth:0.5,borderRightColor:'#dcdcdc',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:setSpText(14),color:'#999999'}}>利润</Text>
                    <Text style={{color:'#E13238',fontSize:setSpText(20),marginTop:10}}>{this.props.item.item.profit}</Text>
                </View>
                <View style={{flex:1,justifyContent:'space-between',paddingLeft:15}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>收入</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>{this.props.item.item.income}</Text>
                    </View>
                    <View style={{flexDirection:'row' ,alignItems:'center',marginTop:10}}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>支出</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>{this.props.item.item.expenditure}</Text>
                    </View>
                </View>
            </View>
        )
    }
}