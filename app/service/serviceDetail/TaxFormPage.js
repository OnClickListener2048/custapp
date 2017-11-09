/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React  from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    InteractionManager
} from 'react-native';
import { Pie } from 'react-native-pathjs-charts'
import BComponent from '../../base';
import CommonCell from '../../view/CommenCell'
import ChooseTimerModal from '../../view/ChooseTimerModal'
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'
import HeaderView from '../view/HeaderView'
import SectionHeader from '../../view/SectionHeader'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

import demoData from './local/TaxFormPage.json'

export default class TaxFormPage extends BComponent {

    constructor(props){
        super(props)
        this.state={
            total:'- -',//本月累计
            data:[],
            isRefreshing:false,
            year:props.year,
            month:props.month,
            isfirstRefresh:true
        }

    }
    componentWillUnmount() {
        UMTool.onEvent('t_return')
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.year+'-'+this.state.month)
        });
    }
    loadData(date='',isPull=false){

        if (this.props.is_demo == '1'){
            this.setState({
                total:demoData.total,
                data:demoData.list,
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
        apis.loadTaxForm(this.props.companyid,date).then(
            (responseData) => {
                if(responseData.code == 0){

                    this.setState({
                        total:responseData.data.total?responseData.data.total:'- -',
                        data:responseData.data.list?responseData.data.list:[],
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
    _listHeaderComponent(){
        return (
            <View style={{width:DeviceInfo.width}}>
                <HeaderView
                    hasTop={true}
                    hasBottom={false}
                    topDes="本月累计"
                    topNum={this.state.total}
                    leftDes=""
                    leftNum=""
                    rightDes=""
                    rightNum=""
                />
                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="纳税表明细"/>

            </View>
        )
    }

    // _listHeaderComponent(){
    //     let options = {
    //         width: 260,
    //         height: 260,
    //         color: '#2980B9',
    //         r: 100,
    //         R: 130,
    //         animate: {
    //             type: 'oneByOne',
    //             duration: 2000,
    //             fillTransition: 3
    //         },
    //         label:{color:''}
    //
    //     }
    //     let colorArr=[
    //         '#EA4931',
    //         '#FFAE00',
    //         '#4287FF',
    //         '#00C3B0'
    //     ]
    //     return(
    //         <View style={{width:DeviceInfo.width,backgroundColor:'white'}}>
    //             <View style={{width:DeviceInfo.width,height:260,marginTop:70,alignItems:'center'}}>
    //                 <View style={{width:260,height:260,position:'relative'}}>
    //                     <Pie data={this.state.data}
    //                          options={options}
    //                          accessorKey="population"
    //                          pallete={
    //                              [
    //                                  {'r':234,'g':73,'b':49},
    //                                  {'r':255,'g':174,'b':0},
    //                                  {'r':66,'g':135,'b':255},
    //                                  {'r':0,'g':195,'b':176},
    //                              ]
    //                          }
    //
    //                     />
    //                     <View style={{width:130,height:130,position:'absolute',top:65,left:65,justifyContent:'center',alignItems:'center'}}>
    //                         <Text style={{fontSize:18,color:'#333333'}}>本月累计</Text>
    //                         <Text style={{fontSize:20,color:'#EA4931',fontWeight:'bold'}}>{this.state.total}</Text>
    //                     </View>
    //                 </View>
    //             </View>
    //             <View style={{flexDirection:'row',width:DeviceInfo.width,justifyContent:'space-around',marginTop:37,marginBottom:10}}>
    //                 {
    //                     this.state.data.map((item,index)=>{
    //                         return(
    //                             <View  key={index} style={{flexDirection:'row',alignItems:'center'}}>
    //                                 <View style={{width:10,height:10,borderRadius:10,backgroundColor:colorArr[index]}}></View>
    //                                 <Text style={{fontSize:12,color:'#999999',marginLeft:5}}>{item.name}</Text>
    //                             </View>
    //                         )
    //                     })
    //                 }
    //             </View>
    //         </View>
    //     )
    // }

    _renderItem(item){
        return(
            <CommonCell leftText={item.item.name} rightText={item.item.amount} isClick={false}/>
        )
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
            return <View />
        }
    }
    render(){

        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <FlatList
                    renderItem={this._renderItem.bind(this)}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    data={this.state.data}
                    keyExtractor = {(item, index) => index}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                <PLPActivityIndicator isShow={this.state.isLoading} />
                <ChooseTimerModal disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>
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