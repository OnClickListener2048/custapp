/**
 * Created by liufei on 2018/1/22.
 */

import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../config';

export default class CheckInfoItemTwo extends Component {
    constructor(props){
        super(props)
        this._isShowLine=this._isShowLine.bind(this)
    }

    static propTypes = {
        name: PropTypes.string,//名称
        value:PropTypes.string,//内容
        isShowLine:PropTypes.bool//是否显示分割线
    };

    static defaultProps = {
        name:'',
        value:'',
        isShowLine:true
    }


    _isShowLine(isShowLine){
        if(isShowLine) {
            return (
                <View style={styles.line}/>
            );
        }
    }

    render(){
        const {name,value,isShowLine} = this.props
        return(
          <View style={styles.container}>
              <View style={styles.wrap1}>
                  <Text style={styles.text1}>
                      {name}：
                  </Text>
                   <Text style={styles.text2}>
                      {value}
                   </Text>
               </View>
               {this._isShowLine(isShowLine)}
           </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FFFFFF',
        paddingLeft:15
    },
    wrap1:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
        marginLeft:10,
        marginRight:20,
        marginTop:10,
        marginBottom:10,
        alignItems:'center'
    },
    line:{
        height:0.25,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:1 ,
        backgroundColor:'transparent',
    },
    text1:{
        width:100,
        fontSize:18,
        color:'#000000',

    },
    text2:{
        width:SCREEN_WIDTH-150,
        fontSize:18,
        marginLeft:10,
        color:'#333333',
    }

});


