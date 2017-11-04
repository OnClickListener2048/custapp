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
            "profit": "￥15,000.00",
            "income": "￥39,000.00",
            "expenditure": "￥24,000.00"
        },
        {
            "date": "11",
            "profit": "￥90,000.00",
            "income": "￥120,000.00",
            "expenditure": "￥30,000.00"
        },
        {
            "date": "10",
            "profit": "￥1,000.00",
            "income": "￥115,000.00",
            "expenditure": "￥114,000.00"
        },
        {
            "date": "9",
            "profit": "￥13,000.00",
            "income": "￥28,000.00",
            "expenditure": "￥15,000.00"
        },
        {
            "date": "8",
            "profit": "￥11,000.00",
            "income": "￥76,000.00",
            "expenditure": "￥65,000.00"
        },
        {
            "date": "7",
            "profit": "￥80,000.00",
            "income": "￥150,000.00",
            "expenditure": "￥70,000.00"
        },
        {
            "date": "6",
            "profit": "￥42,000.00",
            "income": "￥65,000.00",
            "expenditure": "￥23,000.00"
        },
        {
            "date": "5",
            "profit": "￥80,000.00",
            "income": "￥120,000.00",
            "expenditure": "￥40,000.00"
        },
        {
            "date": "4",
            "profit": "￥20,000.00",
            "income": "￥50.000.00",
            "expenditure": "￥30,000.00"
        },
        {
            "date": "3",
            "profit": "￥130,000.00",
            "income": "￥200,000.00",
            "expenditure": "￥70,000.00"
        },
        {
            "date": "2",
            "profit": "￥120,000.00",
            "income": "￥140,000.00",
            "expenditure": "￥20,000.00"
        },
        {
            "date": "1",
            "profit": "￥100,000.00",
            "income": "￥178,000.00",
            "expenditure": "￥78,000.00"
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
    thousandBitSeparator(num) {
        return num && (num
            .toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
        }) : num.toString().replace(/(\d)(?=(\d{3})+\b)/g, function($0, $1) {
            return $1 + ",";
        }));
    }
    loadData(date='',isPull=false){

        if(this.props.is_demo=='1'){

            let today = new Date()
            let arr = [];
            let profit = 0;
            let income = 0;
            let expenditure = 0;
            for (let i = today.getMonth();i>=0;i--){
                let dic = demoData.list[11-i];
                profit = profit + parseFloat(dic.profit.replace(/[,￥]/g,""));
                income = income + parseFloat(dic.income.replace(/[,￥]/g,""));
                expenditure = expenditure + parseFloat(dic.expenditure.replace(/[,￥]/g,""));
                arr.push(dic);
            }
            this.setState({
                profit:'￥'+this.thousandBitSeparator(profit)+'.00',
                income:'￥'+this.thousandBitSeparator(income)+'.00',
                expenditure:'￥'+this.thousandBitSeparator(expenditure)+'.00',
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