/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React ,{Component} from 'react';
import {
    View,
    Text,

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
        underLineStyle:{}
    };
    render(){
        let underLineStyle = {}
        if(this.props.underLine){
            underLineStyle = {
                borderBottomWidth:0.5,
                borderBottomColor:'#d1d1d1'
            }
        }

        return(
            <View style={[{width:DeviceInfo.width,paddingTop:18,paddingBottom:18,backgroundColor:'white',flexDirection:'row'},this.props.style,underLineStyle,this.props.underLineStyle]}>
                <View style={{height:45,borderRightWidth:1,borderRightColor:'#dcdcdc',justifyContent:'center',alignItems:'center',width:DeviceInfo.width*0.4}}>
                    <Text style={[{fontSize:20,color:'#333333'},this.props.titleStyle]}>{this.props.title}</Text>
                </View>
                <View style={{flex:1,justifyContent:'space-between',paddingLeft:25, paddingRight:25}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:14,color:'#999999'}}>{this.props.item1_name}</Text>
                        <Text style={{fontSize:16,color:'#333333',marginLeft:9}}>{this.props.item1_money}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:14,color:'#999999'}}>{this.props.item2_name}</Text>
                        <Text style={{fontSize:16,color:'#333333',marginLeft:9}}>{this.props.item2_money}</Text>
                    </View>
                </View>

            </View>
        )
    }
}