/**
 * Created by zhuangzihao on 2017/11/23.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const col = 5

const itemWidth = deviceWidth/col
const itemHeight = 80
const circleWidth = 30
export default class CustomHeader extends Component {

    static defaultProps = {
        tabNames: ['抄税','发送票据','财务处理','申请纳税','清卡'],
    };
    static propTypes = {
        goToPage: React.PropTypes.func, // 跳转到对应tab的方法
        activeTab: React.PropTypes.number, // 当前被选中的tab下标
        tabs: React.PropTypes.array, // 所有tabs集合
        tabNames: React.PropTypes.array, // 保存Tab名称
    };  // 注意这里有分号
    render() {
        return (
            <View style={{width:DeviceInfo.width,flexDirection:'row'}}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }

    renderTabOption(tab, i) {
        let backgroundColor={}
        let textColor = {}
        let numColor = {}
        if( i == this.props.activeTab){
            backgroundColor={
                backgroundColor:'#E13238'
            }
            textColor={
                color:'#E13238'
            }
            numColor={
                color:'white'
            }
        }else{
            textColor={
                color:'#999999'
            }
            numColor={
                color:'#666666'
            }
        }
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>this.click(i)}  key={tab}>
                <View style={{width:itemWidth,height:itemHeight,alignItems:'center',position:'relative'}}>
                    <View style={[{width:circleWidth,height:circleWidth,borderRadius:circleWidth/2,marginTop:10,justifyContent:'center',alignItems:'center',backgroundColor:'#F0F0F0'},backgroundColor]}>
                        <Text style={[numColor,{fontSize:setSpText(12)}]}>
                            0{i+1}
                        </Text>
                    </View>
                    <View style={[{width:itemWidth-10,height:30,marginTop:10,justifyContent:'center',alignItems:'center'}]}>
                        <Text style={[textColor,{fontSize:setSpText(14)}]}>
                            {this.props.tabNames[i]}
                        </Text>
                    </View>
                    {this.renderLeftLine(this.props.activeTab,i)}
                    {this.renderRightLine(this.props.activeTab,i)}

                </View>
            </TouchableOpacity>
        );
    }
    click=(i)=>{
        this.props.goToPage(i)
        let eventArr = ['s_copiestax','s_sendbill','s_finance','s_applyTax','s_clearCard'];
        UMTool.onEvent(eventArr[i])
    }
    renderLeftLine(selectIndex,index){

        let backgroundColor={}
        if(selectIndex+1==index){
            backgroundColor={
                backgroundColor:'#E13238'
            }
        }

        if (index != 0){
            return(
                <View style={[{height:1,width:itemWidth/2-(circleWidth/2),position:'absolute',left:0,top:circleWidth/2+10,backgroundColor:'#F0F0F0'},backgroundColor]}/>
            )
        }else{
            return null
        }
    }
    renderRightLine(selectIndex,index){
        let backgroundColor={}
        if (selectIndex == index){
            backgroundColor={
                backgroundColor:'#E13238'
            }
        }
        if (index != 4){
            return(
                <View style={[{height:1,width:itemWidth/2-(circleWidth/2),position:'absolute',right:0,top:circleWidth/2+10,backgroundColor:'#F0F0F0'},backgroundColor]}/>
            )
        }else{
            return null
        }
    }

}