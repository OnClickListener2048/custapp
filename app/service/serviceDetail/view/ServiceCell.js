/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React ,{Component} from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';


export default class ServiceCell extends Component {

    static defaultProps = {
        title:'',
        item1_name:'期初',
        item1_money:'',
        item2_name:'期末',
        item2_money:'',
        style:{},
        titleStyle:{},
        underLine:false,
        underLineStyle:{},
        isHeader:false,
        isShowArrow:true,
        isOpen:false
    };
    render(){
        let underLineStyle = {}
        if(this.props.underLine){
            underLineStyle = {
                borderBottomWidth:DeviceInfo.onePR,
                borderBottomColor:'#d1d1d1'
            }
        }

        return(
            <View style={[{width:DeviceInfo.width,paddingTop:15,paddingBottom:15,backgroundColor:'white',flexDirection:'row',alignItems:'center'},this.props.style,underLineStyle,this.props.underLineStyle]}>
                <View style={{borderRightWidth:1,borderRightColor:'#dcdcdc',justifyContent:'center',alignItems:'center',width:DeviceInfo.width*0.4,height:40}}>
                    <Text  style={[{fontSize:setSpText(17),color:'#333333',textAlign:'center'},this.props.titleStyle]}>{this.props.title}</Text>
                </View>
                <View style={{flex:1,justifyContent:'space-between',paddingLeft:25, paddingRight:25}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text numberOfLines={1} style={{fontSize:setSpText(14),color:'#999999'}}>{this.props.item1_name}</Text>
                        <Text numberOfLines={1} style={{fontSize:setSpText(14),color:'#333333',marginLeft:9}}>{this.props.item1_money}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                        <Text numberOfLines={1} style={{fontSize:setSpText(14),color:'#999999'}}>{this.props.item2_name}</Text>
                        <Text numberOfLines={1} style={{fontSize:setSpText(14),color:'#333333',marginLeft:9}}>{this.props.item2_money}</Text>
                    </View>
                </View>
                {this.renderArrow()}
            </View>
        )
    }
    renderArrow(){
        if(this.props.isHeader ){
            return(
                <View style={{paddingRight:18}}>
                    {this.props.isOpen?<Image source={require('../../../img/arrow_up_red.png')}/>:<Image source={require('../../../img/arrow_down_red.png')}/>}
                </View>
            )
        }else{
            return null
        }
    }
}