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
const dataDemo = {
    "balance": "￥131,712.26",
    "balance_start": "￥347,020.00",
    "balance_end": "￥347,020.00",
    "list": [
        {
            "num": "1001",
            "name": "库存现金",
            "start": "￥23,000.00",
            "end": "￥23,000.00",
            "others": []
        },
        {
            "num": "1002",
            "name": "银行存款",
            "start": "￥111,000.00",
            "end": "￥111,000.00",
            "others": []
        },
        {
            "num": "1012",
            "name": "其他货币资金",
            "start": "￥200,020.00",
            "end": "￥200,020.00",
            "others": [{
                "num": "1002001",
                "name": "信用卡",
                "start": "￥20.00",
                "end": "￥20.00"
            },
                {
                    "num": "1002002",
                    "name": "银行汇款",
                    "start": "￥200,000.00",
                    "end": "￥200,000.00"
                }
            ]
        },
        {
            "num": "1003",
            "name": "应收票据",
            "start": "￥13,000.00",
            "end": "￥13,000.00",
            "others": []
        }
    ]
}
export default class CashFlowPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            openOptions:[],
            balance:'- -',
            balance_start:'- -',
            balance_end:'- -',
            dataSource:[],
            isRefreshing:false,
            year:props.year,
            month:props.month,
            isfirstRefresh:true,
            isLoading:false

        };
    }
    componentWillUnmount() {
        UMTool.onEvent('c_teturn')
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.year+'-'+this.state.month)
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
    _renderRow (rowItem, rowId, sectionId) {

        return(
            <ServiceCell style={{backgroundColor:'#f9f9f9',paddingTop:26,paddingBottom:26}} underLine={true} title={rowItem.name} item1_money={rowItem.start} item2_money={rowItem.end}/>
        )

    };
    _renderSection (section, sectionId) {
        let dic = this.state.dataSource[sectionId]
        return(
            <ServiceCell isOpen={this.state.openOptions[sectionId]} isHeader={true} title={dic.name} titleStyle={{color:'#E13238'}} item1_money={dic.start} item2_money={dic.end}/>

        )
    };
    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <HeaderView
                    hasTop={true}
                    topDes="净流动资金"
                    topNum={this.state.balance}
                    leftDes="期初"
                    leftNum={this.state.balance_start}
                    rightDes="期末"
                    rightNum={this.state.balance_end}
                />

                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="现金流明细"/>
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
    render() {
        return (
            <View style={{backgroundColor:'#f9f9f9',flex:1}}>
                <ExpanableList
                    ListHeaderComponent = {this._listHeaderComponent.bind(this)}
                    dataSource={this.state.dataSource}
                    headerKey="name"
                    memberKey="others"
                    renderRow={this._renderRow.bind(this)}
                    renderSectionHeaderX={this._renderSection.bind(this)}
                    openOptions={this.state.openOptions}
                    headerClickCallBack={(index)=>this._headerClickCallBack(index)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                <PLPActivityIndicator isShow={this.state.isLoading} />
                <ChooseTimerModal disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>
            </View>

        );
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
    _headerClickCallBack(index){
        let openOptions =this.state.openOptions
        openOptions[index]=!openOptions[index]
        this.setState({openOptions})
    }
}