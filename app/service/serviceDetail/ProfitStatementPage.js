/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React,{Component}  from 'react';
import {
    View,
    Text,
    FlatList,
    Image
} from 'react-native';
import SectionHeader from '../../view/SectionHeader'
import BComponent from '../../base';
import HeaderView from '../view/HeaderView'
import ChooseTimerModal from '../../view/ChooseTimerModal'

const data = [
    {
        month:'12'
    },
    {
        month:'11'
    },
    {
        month:'10'
    },
    {
        month:'9'
    },
    {
        month:'8'
    },
    {
        month:'7'
    },
    {
        month:'6'
    },
    {
        month:'5'
    },
    {
        month:'4'
    },
    {
        month:'3'
    },
    {
        month:'2'
    },
    {
        month:'1'
    },
]
export default class ProfitStatementPage extends BComponent {

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
                    topNum="¥30,000.00"
                    leftDes="收入"
                    leftNum="¥30,000.00"
                    rightDes="支出"
                    rightNum="¥30,000.00"
                />
                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="应付账款明细"/>
            </View>
        )
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <FlatList
                    data={data}
                    keyExtractor = {(item, index) => index}
                    renderItem={this._renderItem.bind(this)}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                />
                <ChooseTimerModal />

            </View>
        )
    }
}

class Cell extends Component{

    render(){
        return(
            <View style={[{width:DeviceInfo.width,height:85,backgroundColor:'white',paddingLeft:13,flexDirection:'row',alignItems:'center'},this.props.item.index==0?{marginTop:0}:{marginTop:10}]}>
                <View style={[{width:35,height:85,justifyContent:'center',alignItems:'center'},this.props.item.index%2==0?{backgroundColor:'#EB5B47'}:{backgroundColor:'#F8863F'}]}>
                    <Text style={{fontSize:16,color:'white'}}>{this.props.item.item.month}</Text>
                    <Text style={{fontSize:16,color:'white',marginTop:5}}>月</Text>
                </View>
                <View style={{width:(DeviceInfo.width-48)/2,height:45,borderRightWidth:0.5,borderRightColor:'#dcdcdc',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:14,color:'#999999'}}>利润</Text>
                    <Text style={{color:'#E13238',fontSize:20,marginTop:5}}>30,000.00</Text>
                </View>
                <View style={{width:(DeviceInfo.width-48)/2,height:45,justifyContent:'space-between',alignItems:'center'}}>
                    <View style={{flexDirection:'row',alignItems:'center',}}>
                        <Text style={{fontSize:14,color:'#999999'}}>期初</Text>
                        <Text style={{fontSize:16,color:'#333333',marginLeft:9}}>¥30,500.45</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center', }}>
                        <Text style={{fontSize:14,color:'#999999'}}>期末</Text>
                        <Text style={{fontSize:16,color:'#333333',marginLeft:9}}>¥60,050.46</Text>
                    </View>
                </View>


            </View>
        )
    }
}