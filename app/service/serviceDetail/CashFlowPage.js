/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React  from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    InteractionManager
} from 'react-native';
import ExpanableList from '../../view/ExpanableList'
import BComponent from '../../base';
import SectionHeader from '../../view/SectionHeader'
import ServiceCell from './view/ServiceCell'
import ChooseTimerModal from '../../view/ChooseTimerModal'
import HeaderView from '../view/HeaderView'
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import dataDemo from './local/CashFlow.json'
import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBar from '../view/TimeSearchBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'

export default class CashFlowPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            balance:'- -',
            balance_start:'- -',
            balance_end:'- -',
            dataSource:[],
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,

            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex

        };
        this.openOptions=[];
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    componentWillUnmount() {
        UMTool.onEvent('c_teturn')
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }
    loadData(date='',isPull=false){

        if(this.props.is_demo == '1'){

            this.setState({
                balance:dataDemo.balance,
                balance_start:dataDemo.balance_start,
                balance_end:dataDemo.balance_end,
                dataSource:dataDemo.list,
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

        apis.loadCashFlow(this.props.companyid,date).then(
            (responseData) => {

                if(responseData.code == 0){

                    this.setState({
                        balance:responseData.data.balance?responseData.data.balance:'- -',
                        balance_start:responseData.data.balance_start?responseData.data.balance_start:'- -',
                        balance_end:responseData.data.balance_end?responseData.data.balance_end:'- -',
                        dataSource:responseData.data.list?responseData.data.list:[],
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false
                    })

                    if(responseData.data.list){
                        this.openOptions = Array.apply(null, Array(responseData.data.list.length)).map(function(item, i) {
                            return true;
                        });
                    }

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
    _renderRow (rowItem, rowId, sectionId) {

        return(
            <ServiceCell style={{backgroundColor:'#F1F1F1'}} underLine={true} title={rowItem.name} item1_money={rowItem.start} item2_money={rowItem.end}/>
        )

    };
    _renderSection (section, sectionId) {
        let dic = this.state.dataSource[sectionId]
        return(
            <ServiceCell isOpen={this.openOptions[sectionId]} underLine={true}  isHeader={dic.others.length>0} title={dic.name} titleStyle={{color:'#E13238'}} item1_money={dic.start} item2_money={dic.end}/>

        )
    };
    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width,position:'relative'}}>
                <HeaderView
                    hasTop={true}
                    topDes="净流动资金"
                    topNum={this.state.balance}
                    leftDes="期初"
                    leftNum={this.state.balance_start}
                    rightDes="期末"
                    rightNum={this.state.balance_end}
                />
                <SectionHeader style={{backgroundColor:'#F1F1F1'}} leftViewStyle={{backgroundColor:'#C6A567'}} text="现金流明细"/>
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
    render() {
        return (
            <View style={{backgroundColor:'#F1F1F1',flex:1}}>
                <ServiceNavigatorBar isSecondLevel = {true}  navigator={this.props.navigator} isDemo = {this.props.is_demo} title="现金流" year={this.state.year} month={this.state.month} callback = {this._callback.bind(this)}/>
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <ExpanableList
                    ref="list"
                    ListHeaderComponent = {this._listHeaderComponent.bind(this)}
                    dataSource={this.state.dataSource}
                    headerKey="name"
                    memberKey="others"
                    isOpenArr={this.openOptions}
                    renderRow={this._renderRow.bind(this)}
                    renderSectionHeaderX={this._renderSection.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                <PLPActivityIndicator isShow={this.state.isLoading} />
                {/*<ChooseTimerModal ref="ChooseTimerModal" disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>*/}
            </View>

        );
    }

    _callback(index){
        this.setState({
            timeIndex:index
        })
        // alert(this.state.timeDateArr[index].relateDate)
        this.loadData(this.state.timeDateArr[index].relateDate)
        this.props.callback && this.props.callback(index)
    }

}