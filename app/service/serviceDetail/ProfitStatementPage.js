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
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

const demoData = {
    "profit": "￥1,150,470.62",
    "income": "￥10,465,390.28",
    "expenditure": "￥9,314,919.66",
    "list": [
        {
            "date": "12",
            "profit": "￥132,582.30",
            "income": "￥889,504.07",
            "expenditure": "￥756,921.77"
        },
        {
            "date": "11",
            "profit": "￥95,613.73",
            "income": "￥860,706.80",
            "expenditure": "￥765,093.07"
        },
        {
            "date": "10",
            "profit": "￥120,280.93",
            "income": "￥885,202.00",
            "expenditure": "￥764,921.07"
        },
        {
            "date": "9",
            "profit": "￥107,644.70",
            "income": "￥885,719.70",
            "expenditure": "￥778,075.00"
        },
        {
            "date": "8",
            "profit": "￥119,812.50",
            "income": "￥895,000.00",
            "expenditure": "￥775,187.50"
        },
        {
            "date": "7",
            "profit": "￥99,847.00",
            "income": "￥900,000.00",
            "expenditure": "￥800,153.00"
        },
        {
            "date": "6",
            "profit": "￥86,841.80",
            "income": "￥922,456.31",
            "expenditure": "￥835,614.51"
        },
        {
            "date": "5",
            "profit": "￥89,370.07",
            "income": "￥895,101.02",
            "expenditure": "￥805,730.95"
        },
        {
            "date": "4",
            "profit": "￥42,249.49",
            "income": "￥820.920.38",
            "expenditure": "￥778,500.51"
        },
        {
            "date": "3",
            "profit": "￥85,567.23",
            "income": "￥850,000.00",
            "expenditure": "￥765,353.15"
        },
        {
            "date": "2",
            "profit": "￥69,766.00",
            "income": "￥850,000.00",
            "expenditure": "￥780,234.00"
        },
        {
            "date": "1",
            "profit": "￥100,894.87",
            "income": "￥810,030.00",
            "expenditure": "￥709,135.13"
        }
    ],
}
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
            month:props.month,
            isfirstRefresh:true,
            isLoading:false

        };
    }
    componentWillUnmount() {
        UMTool.onEvent('p_return')
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.year+'-'+this.state.month)
        });
    }
    loadData(date='',isPull=false){

        if(this.props.is_demo=='1'){

            this.setState({
                profit:demoData.profit,
                income:demoData.income,
                expenditure:demoData.expenditure,
                dataSource:demoData.list,
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

                    this.setState({
                        profit:responseData.profit?responseData.profit:'- -',
                        income:responseData.income?responseData.income:'- -',
                        expenditure:responseData.expenditure?responseData.expenditure:'- -',
                        dataSource:responseData.list?responseData.list:[],
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
        this.loadData(this.state.year+'-'+this.state.month,true)
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
                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="利润表明细"/>
            </View>
        )
    }
    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.56
        if(!this.state.isfirstRefresh){
            return(
                <View style={{width:DeviceInfo.width,alignItems:'center',height:DeviceInfo.height-headerHeight,justifyContent:'center'}}>
                    <Text style={{fontSize:15,color:'#999999'}}>暂时没有查到相关数据,请过些时日再查看</Text>
                    <Text style={{fontSize:15,color:'#999999',marginTop:10}}>或者致电客服热线:400-107-0110</Text>
                </View>
            )
        }else{
            return <View />
        }

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
                    istEmptyComponent={this._listEmptyComponent.bind()}
                />
                <ChooseTimerModal disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>
                <PLPActivityIndicator isShow={this.state.isLoading} />

            </View>
        )
    }
    _callback(year,month){
        InteractionManager.runAfterInteractions(() => {
            this.loadData(year+'-'+month)
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
                    <Text style={{fontSize:setSpText(16),color:'white'}}>{this.props.item.item.date}</Text>
                    <Text style={{fontSize:setSpText(16),color:'white',marginTop:5}}>月</Text>
                </View>
                <View style={{flex:1,borderRightWidth:0.5,borderRightColor:'#dcdcdc',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:setSpText(14),color:'#999999'}}>利润</Text>
                    <Text style={{color:'#E13238',fontSize:setSpText(20),marginTop:5}}>{this.props.item.item.profit}</Text>
                </View>
                <View style={{flex:1,justifyContent:'space-between',paddingLeft:15}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>收入</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>{this.props.item.item.income}</Text>
                    </View>
                    <View style={{flexDirection:'row' ,alignItems:'center'}}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>支出</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>{this.props.item.item.expenditure}</Text>
                    </View>
                </View>
            </View>
        )
    }
}