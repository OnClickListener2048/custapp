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
import ChooseTimerModal from '../../view/ChooseTimerModal'
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

const demoData = {
    "start_account": "￥20,600.00",
    "end_account": "￥20,600.00",
    "list": [
        {
            "name":"应收账款",
            "start":"￥20,600.00",
            "end":"￥20,600.00",
            "others":[
                {
                    "name":"演示公司1",
                    "start":"￥2,600.00",
                    "end":"￥2,600.00"
                },
                {
                    "name":"演示公司2",
                    "start":"￥18,000.00",
                    "end":"￥18,000.00"
                }
            ]
        }
    ],
}

export default class AccountsReceivablePage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            openOptions:[],
            dataSource:[],
            start_account:'- -',
            end_account:'- -',
            isRefreshing:false,
            year:props.year,
            month:props.month,
            isfirstRefresh:true,
            isLoading:false

        };
    }
    componentWillUnmount() {
        UMTool.onEvent('r_return')
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.year+'-'+this.state.month,'2')
        });
    }
    loadData(date='',type='2',isPull=false){

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

                    this.setState({
                        dataSource:responseData.list?responseData.list:[],
                        start_account:responseData.start_account?responseData.start_account:'- -',
                        end_account:responseData.end_account?responseData.end_account:'- -',
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false
                    })
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
        this.loadData(this.state.year+'-'+this.state.month,'2',true)
    }
    _renderRow (rowItem, rowId, sectionId) {

        return(
            <ServiceCell style={{backgroundColor:'#f9f9f9',paddingTop:26,paddingBottom:26}} underLine={true} title={rowItem.name} item1_name="期初" item2_name="期末" item1_money={rowItem.start} item2_money={rowItem.end}/>
        )

    };
    _renderSection (section, sectionId) {
        let dic = this.state.dataSource[sectionId]
        return(
            <ServiceCell isOpen={this.state.openOptions[sectionId]} isHeader={true} title={dic.name} titleStyle={{color:'#E13238'}} item1_name="期初" item2_name="期末" item1_money={dic.start} item2_money={dic.end}/>

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
                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="应收账款明细"/>
            </View>
        )
    }
    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.42+20
        if(!this.state.isfirstRefresh){
            return(
                <View style={{width:DeviceInfo.width,alignItems:'center',height:DeviceInfo.height-headerHeight,justifyContent:'center'}}>
                    <Text style={{fontSize:15,color:'#999999'}}>暂时没有查到相关数据,请过些时日再查看</Text>
                    <Text style={{fontSize:15,color:'#999999',marginTop:10}}>或者致电客服热线:400-107-0110</Text>
                </View>
            )
        }else{
            return <View/>
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
                    openOptions={this.state.openOptions}
                    renderSectionHeaderX={this._renderSection.bind(this)}
                    headerClickCallBack={(index)=>this._headerClickCallBack(index)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                <ChooseTimerModal disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>
                <PLPActivityIndicator isShow={this.state.isLoading} />

            </View>

        );
    }
    _callback(year,month){

        InteractionManager.runAfterInteractions(() => {
            this.loadData(year+'-'+month,'2')
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