/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React  from 'react';
import {
    View,
    Text,
    Image,
    InteractionManager
} from 'react-native';
import ExpanableList from '../../view/ExpanableList'
import BComponent from '../../base';
import SectionHeader from '../../view/SectionHeader'
import ServiceCell from './view/ServiceCell'
import HeaderView from '../view/HeaderView'
import {exportFile} from '../../util/XlsxTool'
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

import demoData from './local/AccountsReceivablePage.json'
import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'

export default class AccountsReceivablePage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            start_account:'- -',
            end_account:'- -',
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,
            xslxData:[],
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
        UMTool.onEvent('r_return')
    }
    _shareToWeXin(){
        exportFile(this.state.xslxData,'应收账款',[{wpx: 200}, {wpx: 50}, {wpx: 50}])

    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate,'1')
        });
    }
    loadData(date='',type='1',isPull=false){

        if (this.props.is_demo == '1'){
            this.setState({
                dataSource:demoData.list,
                start_account:demoData.start_account,
                end_account:demoData.end_account,
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
        apis.loadAccounts(this.props.companyid,date,type).then(
            (responseData) => {

                if(responseData.code == 0){
                    let xslxData = [['科目名称','期初余额','期末余额']]
                    for(let i = 0 ;i<responseData.list.length; i++){
                        let dic = responseData.list[i];
                        xslxData.push([dic.name,dic.start,dic.end])
                        if(dic.others && dic.others.length>0){
                            for(let j = 0;j<dic.others.length;j++){
                                let dicOther = dic.others[j]
                                xslxData.push([dicOther.name,dicOther.start,dicOther.end])
                            }
                        }
                    }
                    this.setState({
                        dataSource:responseData.list?responseData.list:[],
                        start_account:responseData.start_account?responseData.start_account:'- -',
                        end_account:responseData.end_account?responseData.end_account:'- -',
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false,
                        xslxData:xslxData
                    })

                    if(responseData.list){
                        this.openOptions = Array.apply(null, Array(responseData.list.length)).map(function(item, i) {
                            return true;
                        });
                    }
                }else{
                    this.setState({
                        isRefreshing:false,
                        isLoading:false

                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败!')
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
        this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate,'1',true)
    }
    _renderRow (rowItem, rowId, sectionId) {

        return(
            <ServiceCell style={{backgroundColor:'#F1F1F1'}} underLine={true} title={rowItem.name} item1_name="期初" item2_name="期末" item1_money={rowItem.start} item2_money={rowItem.end}/>
        )

    };
    _renderSection (section, sectionId) {
        let dic = this.state.dataSource[sectionId]
        return(
            <ServiceCell isOpen={this.openOptions[sectionId]} underLine={true}   isHeader={dic.others.length>0} title={dic.name} titleStyle={{color:'#E13238'}} item1_name="期初" item2_name="期末" item1_money={dic.start} item2_money={dic.end}/>

        )
    };
    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <HeaderView
                    hasTop={false}
                    leftDes="期初"
                    leftNum={this.state.start_account}
                    rightDes="期末"
                    rightNum={this.state.end_account}


                />
                <SectionHeader style={{backgroundColor:'#F1F1F1'}} leftViewStyle={{backgroundColor:'#C6A567'}} text="应收账款明细"/>
            </View>
        )
    }
    _showTimer(){
        this.refs.ChooseTimerModal._showTimer()
    }
    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.42+20
        if(!this.state.isfirstRefresh){
            return(
                <View style={{width:DeviceInfo.width,alignItems:'center',height:DeviceInfo.height-headerHeight,justifyContent:'center'}}>
                    <Text style={{fontSize:15,color:'#999999'}}>暂时没有查到相关数据</Text>
                    {/*<Text style={{fontSize:15,color:'#999999',marginTop:10}}>或者致电客服热线:400-107-0110</Text>*/}
                </View>
            )
        }else{
            return <View/>
        }

    }
    render() {
        return (
            <View style={{backgroundColor:'#F1F1F1',flex:1}}>
                <ServiceNavigatorBar isSecondLevel = {true}  navigator={this.props.navigator} isDemo = {this.props.is_demo} title="应收账款" shareToWeXin = {this._shareToWeXin.bind(this)} />
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <ExpanableList
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
                {/*<ChooseTimerModal ref="ChooseTimerModal" disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>*/}
                <PLPActivityIndicator isShow={this.state.isLoading} />

            </View>

        );
    }

    _callback(index){
        this.setState({
            timeIndex:index
        })
        // alert(this.state.timeDateArr[index].relateDate)
        this.loadData(this.state.timeDateArr[index].relateDate,'1')
        this.props.callback && this.props.callback(index)
    }

}