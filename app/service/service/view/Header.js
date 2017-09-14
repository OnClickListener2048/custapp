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


// const deviceWidth = Dimensions.get('window').width;
// const col = 5
//
// const itemWidth = deviceWidth/col
// const itemHeight = 80
export default class Header extends Component {

    static defaultProps = {
        processIndx:2,
        selectIndex:2,
        btnArr:['抄税','发票数据','财务处理','申报纳税','清卡']
    };

    btnClick(index){
        this.props.btnClick(index)
    }

    render(){
        return(
            <View style={{width:DeviceInfo.width,flexDirection:'row'}}>
                {
                    this.props.btnArr.map((item,index)=>{
                        return(
                            <TouchableOpacity activeOpacity={0.8} key={index} onPress = {this.btnClick.bind(this,index)} disabled ={index>this.props.processIndx}>
                                <Button selectIndex={this.props.selectIndex} processIndx={this.props.processIndx} index={index} btnArr={this.props.btnArr} />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

class Button extends Component{


    constructor(props) {
        super(props);
        this.deviceWidth = DeviceInfo.width;
        this.col = props.btnArr.length
        this.itemWidth = this.deviceWidth/this.col
        this.itemHeight = 80
    }

    static defaultProps = {
        index:0,
        processIndx:0,
        selectIndex:0,
        btnArr:[]
    };

    render(){

        let backgroundColor = {}
        let textColor = {}
        if (this.props.processIndx < this.props.index){
            backgroundColor = {
                backgroundColor:'gray',
            }
            textColor = {
                color:'black'
            }
        } else  {
            backgroundColor = {
                backgroundColor:'green',
            }
            textColor = {
                color:'white'
            }
        }

        if(this.props.selectIndex == this.props.index){
            backgroundColor = {
                backgroundColor:'orange',
            }
            textColor = {
                color:'black'
            }
        }

        return(
                <View style={{width:this.itemWidth,height:this.itemHeight,alignItems:'center',position:'relative'}}>
                    <View style={[{width:30,height:30,borderRadius:15,marginTop:10,justifyContent:'center',alignItems:'center'},backgroundColor]}>
                        <Text style={[textColor]}>
                            {this.props.index+1}
                        </Text>
                    </View>
                    <View style={[{width:this.itemWidth-10,height:30,marginTop:10,justifyContent:'center',alignItems:'center'},backgroundColor]}>
                        <Text style={[textColor]}>
                            {this.props.btnArr[this.props.index]}
                        </Text>
                    </View>
                    {this.renderLeftLine()}
                    {this.renderRightLine()}

                </View>

        )
    }
    renderLeftLine(){

        let backgroundColor = {
            backgroundColor:'gray'
        }

        if(this.props.index > this.props.processIndx){
            backgroundColor = {
                backgroundColor:'gray'
            }
        }else{
            backgroundColor = {
                backgroundColor:'green'
            }
        }

        if (this.props.index != 0){
            return(
                <View style={[{height:4,width:this.itemWidth/2-15,position:'absolute',left:0,top:25-2},backgroundColor]}/>
            )
        }else{
            return null
        }
    }
    renderRightLine(){
        let backgroundColor = {
            backgroundColor:'gray'
        }
        if(this.props.index < this.props.processIndx){
            backgroundColor = {
                backgroundColor:'green'
            }
        }else{
            backgroundColor = {
                backgroundColor:'gray'
            }
        }
        if (this.props.index != this.props.btnArr.length-1){
            return(
                <View style={[{height:4,width:this.itemWidth/2-15,position:'absolute',right:0,top:25-2},backgroundColor]}/>
            )
        }else{
            return null
        }
    }

}