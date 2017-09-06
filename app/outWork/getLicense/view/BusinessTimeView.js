/**
 * Created by jinglan on 2017/6/22.
 */
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions
} from 'react-native';

const window = Dimensions.get('window');
export const height = window.height;
export const width = window.width;

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        height:45 * 2,
        flexDirection: 'row',
        paddingTop:10,
        paddingBottom:2,
        backgroundColor:'#FFFFFF'
    },
    leftTipStyle: {
        marginLeft: 15,
        paddingTop:5,
        fontSize:15,
        color:'#323232',
        width:70,
    },
    rightViewStyle: {
        marginRight: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex : 1

    },

    rightRowViewStyle: {
        flexDirection: 'row',
        height: 35,
        backgroundColor:'white',
        // justifyContent:'center',
        alignItems:'center',


    },

    selectBtnStyle: {

        width : 35,
        height : 45,
        backgroundColor:'white',

        justifyContent: 'center',
        alignItems:'center',
    },
    leftdownDrapViewStyle: {
        flexDirection: 'row-reverse',
        alignItems:'center',
        // width : 105.5,
        flex : 1,
        marginLeft : 4.5,
        marginRight : 0,
        height : 30,
        borderRadius: 2.5,
        borderWidth: 1,
        borderColor : '#e6e6e6',
        backgroundColor: 'white',
    },

    rightdownDrapViewStyle: {
        flexDirection: 'row-reverse',
        alignItems:'center',
        marginLeft : 0,
        marginRight : 0,
        // width : 105.5,
        flex : 1,
        height : 30,
        borderWidth: 1,
        borderRadius: 2.5,
        borderColor : '#e6e6e6',
        backgroundColor: 'white',
    },



});

export default class BusinessTimeView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            allTimePressBtnSelected : this.props.allTimePressBtnSelected,
            firstDate:this.props.firstDate,
            lastDate:this.props.lastDate,
            isFocus:this.props.isFocus,//是否可编辑
        }

        this._selectTimePress = this._selectTimePress.bind(this);
        this._allTimePress = this._allTimePress.bind(this);
        this._leftTimePress = this._leftTimePress.bind(this);
        this._hideAlert = this._hideAlert.bind(this);


    }

    static propTypes = {
        firstDate: PropTypes.string,
        lastDate:PropTypes.string,
        isFocus:PropTypes.bool,
        allTimePressBtnSelected:PropTypes.string,
    };


    _selectTimePress(allTimePressBtnSelected){
        console.log("false有限，TRUE无限s="+this.state.allTimePressBtnSelected);

        this.setState({
            allTimePressBtnSelected : 'false',
        });
        this.props.callbackAll(allTimePressBtnSelected);
    };

    _leftTimePress(){

    };

    _rightTimePress(){

    };

    _allTimePress(allTimePressBtnSelected){
        console.log("false有限，TRUE无限a="+this.state.allTimePressBtnSelected);

        this.setState({
            allTimePressBtnSelected : 'true',
        });
        this.props.callbackAll(allTimePressBtnSelected);
    };

    renderselectTimeBtn(){

        console.log("false有限，TRUE无限time="+this.state.allTimePressBtnSelected);
        if (this.state.allTimePressBtnSelected==='false') {
            return(
                <View  style={{height:8, width:8, borderRadius:4,backgroundColor:'#e5151d'}}>
                </View>
            );
        }else {
            return(
                <View  style={{height:8, width:8, borderRadius:4,backgroundColor:'#ffffff',borderWidth:1,borderColor:'#E6E6E6'}}>
                </View>
            );

        }

    }

    renderallTimeBtn(){
        console.log("false有限，TRUE无限all="+this.state.allTimePressBtnSelected);

        if (this.state.allTimePressBtnSelected==='true') {
            return(
                <View  style={{height:8, width:8, borderRadius:4,backgroundColor:'#e5151d'}}>
                </View>
            );
        }else {
            return(
                <View  style={{height:8, width:8, borderRadius:4,backgroundColor:'#ffffff',borderWidth:1,borderColor:'#E6E6E6'}}>
                </View>
            );

        }

    }

    _hideAlert(timeData){
        console.log("传值====="+timeData);

        this.props.callback(timeData);
    }

    render() {
        console.log("false有限，TRUE无限render="+this.state.allTimePressBtnSelected);
        return (
            <View
                style = {styles.container}>
                <Text style = {styles.leftTipStyle}>{'营业期限'}</Text>

                <View style={styles.rightViewStyle}>

                    <View style={ styles.rightRowViewStyle}>
                        {this.props.isFocus === true ?
                        <TouchableOpacity onPress={() => {this._selectTimePress(false)}}>
                            <View style={ styles.selectBtnStyle}>
                                {this.renderselectTimeBtn()}
                            </View>

                        </TouchableOpacity>:
                            <View style={ styles.selectBtnStyle}>
                            {this.renderselectTimeBtn()}
                            </View>}
                        {this.state.allTimePressBtnSelected === 'false' &&this.props.isFocus === true ?
                            <TouchableOpacity style={ styles.leftdownDrapViewStyle} onPress={() => {
                                this._hideAlert("firstTime")
                            }}>

                                <Image source={require('../../../img/down.png')}/>
                                <Text numberOfLines={1} style={[{
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    color: '#323232',
                                    fontSize:15
                                }]}>{this.props.firstDate==='0001-01-01'?'无期限':this.props.firstDate  + ""}</Text>

                            </TouchableOpacity>:
                            <View style={ styles.leftdownDrapViewStyle}>
                                <Text numberOfLines={1} style={[{
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    color: '#323232',
                                    fontSize:15
                                }]}>{this.props.firstDate==='0001-01-01'?'无期限':this.props.firstDate + ""}</Text>

                            </View>
                        }
                        <View style={[{height: 1, backgroundColor:'#e6e6e6',marginLeft: 0, marginRight:3,width:8}]}></View>
                        {this.state.allTimePressBtnSelected ==='false' &&this.props.isFocus === true?
                        <TouchableOpacity style={ styles.rightdownDrapViewStyle} onPress={() => {
                            this._hideAlert("lastTime")
                        }}>
                            <Image source={require('../../../img/down.png')}/>
                            <Text numberOfLines={1} style={[{
                                textAlign: 'center',
                                justifyContent: 'center',
                                flex: 1,
                                color: '#323232',
                                fontSize:15
                            }]}>{this.props.lastDate==='0001-01-01'?'无期限':this.props.lastDate + ""}</Text>
                        </TouchableOpacity>:
                            <View style={ styles.rightdownDrapViewStyle}>
                                <Text numberOfLines={1} style={[{
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    color: '#323232',
                                    fontSize:15
                                }]}>{this.props.lastDate==='0001-01-01'?'无期限':this.props.lastDate + ""}</Text>
                            </View>
                        }
                    </View>


                    <View style={ styles.rightRowViewStyle}>
                        {this.props.isFocus === true ?
                        <TouchableOpacity onPress={() => {
                            this._allTimePress(true)
                        }}>
                            <View style={ styles.selectBtnStyle}>
                                {this.renderallTimeBtn()}

                            </View>
                        </TouchableOpacity>:<View style={ styles.selectBtnStyle}>
                                {this.renderallTimeBtn()}

                            </View>
                        }

                        <Text style={[{ marginLeft : 4.5,color:'#e6e6e6',minHeight: 14.5,maxHeight:20,fontSize:15}]}>{'无期限'}</Text>
                    </View>
                </View>



            </View>
        );
    }
}

