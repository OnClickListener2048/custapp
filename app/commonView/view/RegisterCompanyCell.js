/**
 * Created by jinglan on 2017/6/13.
 */



import React, {PropTypes,Component} from 'react';
import {View, Text,Image,Dimensions,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Alert,} from 'react-native';
// import styles from '../style/SubViewStyle'

const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;


class RegisterCompanyCell extends Component{


    constructor(props) {
        super(props);
        this.tabState = {};
        this.state = {
        };
    }

    static propTypes = {
        isFirst: PropTypes.bool,
        isLast: PropTypes.bool,
        processState: PropTypes.string,
        textColor: PropTypes.string,
    };


    _leftTipViewNormalBottomLine(){
        if(this.props.isLast){
            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'white'}]}></View>

        }else {

            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'#e6e6e6'}]}></View>

        }

    }

    _leftTipViewNormalTopLine(){
        if(this.props.isFirst){
            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'white'}]}></View>

        }else {

            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'#e6e6e6'}]}></View>

        }

    }

    _leftTipViewHighBottomLine(){
        if(this.props.isLast){
            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'white'}]}></View>

        }else {

            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'#e6e6e6'}]}></View>

        }

    }

    _leftTipViewHighTopLine(){
        if(this.props.isFirst){
            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'white'}]}></View>

        }else {

            return  <View style={[{width : 1 ,flex: 1,backgroundColor:'#e6e6e6'}]}></View>

        }

    }

    _leftTipView() {

        console.log("detail.processState" + this.props.processState);


        if (this.props.processState == '进行中' || this.props.processState == '已结束'|| this.props.processState == '已完成') {

            return  <View style={[{width: 10, alignItems:'center'}]}>

                       {this._leftTipViewHighTopLine()}
                       <View style={[{width: 10, height : 10, borderRadius:5,backgroundColor:'#E5151d'}]}></View>
                       {this._leftTipViewHighBottomLine()}
                    </View>;
        }else {
            return   <View style={[{width: 10, alignItems:'center'}]}>

                {this._leftTipViewNormalTopLine()}

                <View style={[{width: 10, height : 10, borderRadius:5,backgroundColor:'#e6e6e6'}]}>

                         </View>
                        {this._leftTipViewNormalBottomLine()}

                     </View>;
        }

    }


    _renderRightImg(){
        if (this.props.processState == '进行中' || this.props.processState == '已结束'|| this.props.processState == '已完成') {
            return <Image style={{height: 22, width: 22, marginRight: 15, resizeMode: 'stretch'}}
                          source={require('../../img/right_red.png')}/>
        }else {
            return <Image style={{height: 22, width: 22, marginRight: 15, resizeMode: 'stretch'}}
                          source={require('../../img/right_l.png')}/>

        }

    }


    render(){
        const {isFirst, isLast,processState,textColor} = this.props
        console.log( '点击里面render' + processState);

        return(

            <View style={{backgroundColor:'#F8F8F8'}}>
                {/*<TouchableOpacity activeOpacity={0.8} onPress={()=>this.onClick()}>*/}
                    <View style={styles.container}>

                        <View style={styles.left}>
                            {this._leftTipView()}
                            <Text numberOfLines={1} style={{fontSize:15,marginLeft:15,color:textColor}}>{this.props.detail.stepName}</Text>

                        </View>

                        <View style={styles.center}>
                            <Text numberOfLines={1} style={{fontSize:15,color:textColor,justifyContent:'center'}}>{this.props.detail.stepContact}</Text>

                        </View>

                        <View style={styles.right}>

                            {this._renderRightImg()}

                            <Text numberOfLines={1} textAlign='right'
                                  style={{fontSize:15,color:textColor,marginRight:10}}>{this.props.detail.stepStatus}</Text>

                        </View>
                    </View>
                {/*</TouchableOpacity>*/}

                {/*<View style={styles.close}>*/}
                    {/*<TouchableOpacity activeOpacity={0.5} onPress={()=>this.delete()}>*/}
                        {/*<Image style={{height:22,width:22,resizeMode: 'stretch',}} source={require('../image/icon_close.png')}/>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}

            </View>
        );
    }

    onClick(){
        this.props.onClick();
    }

    delete(){
        this.props.onDelete();
    }
}

var styles = StyleSheet.create({
    container:{
        height:40,
        backgroundColor:'#FFFFFF',
        flexDirection:'row'
    },
    close:{
        width:22,
        height:22,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent',
        flex:1,
        bottom:55,
        left:2,
        right:0,
        position: 'absolute'
    },
    icon:{
        width:40,
        height:40,
        borderRadius:20
    },
    left:{
        flex:4,
        marginLeft:15,

        flexDirection:'row',
        alignItems:'center'
    },
    center:{
        flex:2,
        justifyContent:'center'
    },
    right:{
        flex:2,
        flexDirection:'row-reverse',
        marginRight:15,
        alignItems:'center'


    }
});

module.exports = RegisterCompanyCell;