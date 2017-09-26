/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React  from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList
} from 'react-native';
import { Pie } from 'react-native-pathjs-charts'
import BComponent from '../../base';
import CommonCell from '../../view/CommenCell'
import ChooseTimerModal from '../../view/ChooseTimerModal'

const data =[{
    title:'增值税',
    population: 30500.45,
    text:'¥30,500.45'
}, {
    title:'城市建设税',
    population: 2000.00,
    text:'¥2,000.00'
}, {
    title:'教育费附加',
    population: 1100.00,
    text:'¥1,100.00'
}, {
    title:'印花税',
    population: 900.00,
    text:'¥900.00'
}]

export default class TaxFormPage extends BComponent {


    _listHeaderComponent(){
        let options = {
            width: 260,
            height: 260,
            color: '#2980B9',
            r: 100,
            R: 130,
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
                        <Pie data={data}
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
                            <Text style={{fontSize:20,color:'#EA4931',fontWeight:'bold'}}>¥12,000.00</Text>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row',width:DeviceInfo.width,justifyContent:'space-around',marginTop:37,marginBottom:10}}>
                    {
                        data.map((item,index)=>{
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
                    data={data}
                    keyExtractor = {(item, index) => index}
                />
                <ChooseTimerModal isChangeHeader={false}/>

            </View>
        )
    }
}