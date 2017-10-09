/**
 * Created by liufei on 2017/9/20.
 */
import {
    StyleSheet,
} from 'react-native';
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F9F9F9'
    },
    container1:{
        backgroundColor:'#FFFFFF'
    },
    wrapper1:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        marginLeft:14,
        marginTop:12
    },
    head_img:{
        resizeMode: "contain",
    },
    wrapper2:{
        marginLeft:8,
        marginTop:5
    },
    company_title:{
        fontSize:18,
        color:'#333333'
    },
    wrapper3:{
        flexDirection:'row',
        marginTop:10

    },
    money_te:{
        fontSize:14,
        color:'#999999',
        marginTop:3
    },
    money_symbol:{
        fontSize:14,
        color:'#E13238',
        marginTop:3
    },
    money:{
        fontSize:18,
        color:'#E13238'

    },
    wrapper4:{
        width:SCREEN_HEIGHT,
        height:50,
        marginTop:10,
        paddingLeft:14,
        paddingRight:5,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    wrapper5:{
        flexDirection:'row',
        marginRight:8
    },
    right_img:{
        resizeMode : "contain",
        marginLeft:8
    }



});
export default styles;

