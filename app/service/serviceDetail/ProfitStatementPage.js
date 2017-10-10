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
import ChooseTimerModal from '../../view/ChooseTimerModal'
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'

export default class ProfitStatementPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            profit:'- -',
            income:'- -',
            expenditure:'- -',
            dataSource:[],
            isRefreshing:false,
            year:props.year,
            month:props.month
        };
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData('1',this.state.year+'-'+this.state.month)
        });
    }
    loadData(companyid = '1',date='',isPull=false){
        let loading
        if(isPull){
            this.setState({
                isRefreshing:true
            })
        }else{
            loading = SActivityIndicator.show(true, "加载中...");
        }

        apis.loadProfit(companyid,date).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                if(responseData.code == 0){

                    this.setState({
                        profit:responseData.profit,
                        income:responseData.income,
                        expenditure:responseData.expenditure,
                        dataSource:responseData.list,
                        isRefreshing:false
                    })

                }else{
                    this.setState({
                        isRefreshing:false
                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this.setState({
                    isRefreshing:false
                })
                Toast.show('加载失败！')
            },
        );
    }
    _onRefresh(){
        this.loadData('1',this.state.year+'-'+this.state.month,true)
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
                    topNum={"¥"+this.state.profit}
                    leftDes="收入"
                    leftNum={"¥"+this.state.income}
                    rightDes="支出"
                    rightNum={"¥"+this.state.expenditure}
                />
                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="应付账款明细"/>
            </View>
        )
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor = {(item, index) => index}
                    renderItem={this._renderItem.bind(this)}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                />
                <ChooseTimerModal yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>

            </View>
        )
    }
    _callback(year,month){
        InteractionManager.runAfterInteractions(() => {
            this.loadData('1',year+'-'+month)
            this.props.callback && this.props.callback(year,month,true)
            this.setState({
                year,
                month
            })
        });

    }
}

class Cell extends Component{

    render(){
        return(
            <View style={[{width:DeviceInfo.width,height:85,backgroundColor:'white',paddingLeft:13,flexDirection:'row',alignItems:'center'},this.props.item.index==0?{marginTop:0}:{marginTop:10}]}>
                <View style={[{width:30,height:85,justifyContent:'center',alignItems:'center'},this.props.item.index%2==0?{backgroundColor:'#EB5B47'}:{backgroundColor:'#F8863F'}]}>
                    <Text style={{fontSize:setSpText(16),color:'white'}}>{this.props.item.item.date.slice(0,this.props.item.item.date.length-1)}</Text>
                    <Text style={{fontSize:setSpText(16),color:'white',marginTop:5}}>月</Text>
                </View>
                <View style={{flex:1,borderRightWidth:0.5,borderRightColor:'#dcdcdc',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:setSpText(14),color:'#999999'}}>利润</Text>
                    <Text style={{color:'#E13238',fontSize:setSpText(20),marginTop:5}}>{this.props.item.item.profit}</Text>
                </View>
                <View style={{flex:1,justifyContent:'space-between',alignItems:'center'}}>
                    <View style={{flexDirection:'row',alignItems:'center',}}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>收入</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>¥{this.props.item.item.income}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center', }}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>支出</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>¥{this.props.item.item.expenditure}</Text>
                    </View>
                </View>
            </View>
        )
    }
}