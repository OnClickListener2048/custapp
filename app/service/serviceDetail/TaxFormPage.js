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

export default class TaxFormPage extends BComponent {

    constructor(props){
        super(props)
        this.state={
            total:'- -',//本月累计
            data :[{
                title:'增值税',
                population: 10,
                text:'- -',
            }, {
                title:'城市建设税',
                population: 10,
                text:'- -'
            }, {
                title:'教育费附加',
                population: 10,
                text:'- -'
            }, {
                title:'印花税',
                population: 10,
                text:'- -'
            }],
            isRefreshing:false,
            year:props.year,
            month:props.month
        }

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
        apis.loadTaxForm(companyid,date).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                if(responseData.code == 0){
                    let arr = this.state.data
                    arr[0].text = '¥'+ responseData.vat
                    arr[1].text = '¥'+ responseData.uct
                    arr[2].text = '¥'+ responseData.edu
                    arr[3].text = '¥'+responseData.stamp

                    arr[0].population = parseFloat(responseData.vat.replace(/[,¥]/g,""))
                    arr[1].population = parseFloat(responseData.uct.replace(/[,¥]/g,""))
                    arr[2].population = parseFloat(responseData.edu.replace(/[,¥]/g,""))
                    arr[3].population = parseFloat(responseData.stamp.replace(/[,¥]/g,""))

                    this.setState({
                        total:responseData.total,
                        data:arr,
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
    _listHeaderComponent(){
        let options = {
            width: 260,
            height: 260,
            color: '#2980B9',
            r: 100,
            R: 130,
            animate: {
                type: 'oneByOne',
                duration: 2000,
                fillTransition: 3
            },
        }
        let colorArr=[
            '#EA4931',
            '#FFAE00',
            '#4287FF',
            '#00C3B0'
        ]
        return(
            <View style={{width:DeviceInfo.width,backgroundColor:'white'}}>
                <View style={{width:DeviceInfo.width,height:260,marginTop:70,alignItems:'center'}}>
                    <View style={{width:260,height:260,position:'relative'}}>
                        <Pie data={this.state.data}
                             options={options}
                             accessorKey="population"
                             pallete={
                                 [
                                     {'r':234,'g':73,'b':49},
                                     {'r':255,'g':174,'b':0},
                                     {'r':66,'g':135,'b':255},
                                     {'r':0,'g':195,'b':176},
                                 ]
                             }

                        />
                        <View style={{width:130,height:130,position:'absolute',top:65,left:65,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:18,color:'#333333'}}>本月累计</Text>
                            <Text style={{fontSize:20,color:'#EA4931',fontWeight:'bold'}}>¥{this.state.total}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row',width:DeviceInfo.width,justifyContent:'space-around',marginTop:37,marginBottom:10}}>
                    {
                        this.state.data.map((item,index)=>{
                            return(
                                <View  key={index} style={{flexDirection:'row',alignItems:'center'}}>
                                    <View style={{width:10,height:10,borderRadius:10,backgroundColor:colorArr[index]}}></View>
                                    <Text style={{fontSize:12,color:'#999999',marginLeft:5}}>{item.title}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    _renderItem(item){
        return(
            <CommonCell leftText={item.item.title} rightText={item.item.text} isClick={false}/>
        )
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
                />
                <ChooseTimerModal isChangeHeader={false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>
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