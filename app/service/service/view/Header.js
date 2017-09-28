/**
 * Created by zhuangzihao on 2017/9/14.
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
export default class Header extends Component {

    static defaultProps = {
        selectIndex:0,
        btnArr:['抄税','发票数据','财务处理','申报纳税','清卡']
    };

    btnClick(index){
        this.props.btnClick&& this.props.btnClick(index)
    }

    render(){
        return(
            <View style={{width:DeviceInfo.width,flexDirection:'row'}}>
                {
                    this.props.btnArr.map((item,index)=>{
                        return(
                            <TouchableOpacity activeOpacity={0.8} key={index} onPress = {this.btnClick.bind(this,index)} >
                                <Button title={item} selectIndex={this.props.selectIndex}  index={index}  />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

class Button extends Component{

    static defaultProps = {
        title:'',
        index:0,
        selectIndex:0
    };

    render(){

        let backgroundColor={}
        let textColor = {}
        let numColor = {}
        if(this.props.index == this.props.selectIndex){
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
        return(
            <View style={{width:itemWidth,height:itemHeight,alignItems:'center',position:'relative'}}>
                <View style={[{width:25,height:25,borderRadius:12.5,marginTop:10,justifyContent:'center',alignItems:'center',backgroundColor:'#F0F0F0'},backgroundColor]}>
                    <Text style={[numColor,{fontSize:setSpText(12)}]}>
                        0{this.props.index+1}
                    </Text>
                </View>
                <View style={[{width:itemWidth-10,height:30,marginTop:10,justifyContent:'center',alignItems:'center'}]}>
                    <Text style={[textColor,{fontSize:setSpText(14)}]}>
                        {this.props.title}
                    </Text>
                </View>
                {this.renderLeftLine()}
                {this.renderRightLine()}

            </View>

        )
    }
    renderLeftLine(){

        let backgroundColor={}
        if(this.props.selectIndex+1==this.props.index){
            backgroundColor={
                backgroundColor:'#E13238'
            }
        }

        if (this.props.index != 0){
            return(
                <View style={[{height:1,width:itemWidth/2-12.5,position:'absolute',left:0,top:22,backgroundColor:'#F0F0F0'},backgroundColor]}/>
            )
        }else{
            return null
        }
    }
    renderRightLine(){
        let backgroundColor={}
        if (this.props.selectIndex == this.props.index){
            backgroundColor={
                backgroundColor:'#E13238'
            }
        }
        if (this.props.index != 4){
            return(
                <View style={[{height:1,width:itemWidth/2-12.5,position:'absolute',right:0,top:22,backgroundColor:'#F0F0F0'},backgroundColor]}/>
            )
        }else{
            return null
        }
    }

}

