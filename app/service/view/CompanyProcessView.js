
import React, {PropTypes,Component} from 'react';
import {View, Text,Image,Dimensions,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Alert,} from 'react-native';
// import styles from '../style/SubViewStyle'

// import DottedLine from './DottedLine'
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;


class CompanyProcessView extends Component{


    constructor(props) {
        super(props)
        this.state = {
            currentNum: this.props.currentNum,
            titleArr :['1','2','3','4','5']


        }
        this.setCurrentNum = this.setCurrentNum.bind(this);

    }

    setCurrentNum(num) {
        this.setState({currentNum : num});
    }


    static propTypes = {
        currentNum: PropTypes.number
    };

    _circleNormalView(i){
        return  <View style={{height:16,width:16,borderRadius:8 ,backgroundColor:'#E8E8E8',alignItems:'center', justifyContent:'center'}}>
                <Text style={{
                    color: '#999999',
                    textAlign: 'center',
                    borderRadius:8,
                    fontSize: 12
                }}>{this.state.titleArr[i]}</Text>
            </View>


    }

    _circleYellowView(i){
        return <View style={{height:16,width:16,borderRadius:8,backgroundColor:'#D8C095',alignItems:'center', justifyContent:'center'}}>

                {this.state.currentNum === 0 && i === 0 && <Image resizeMode = "center" source={require('../../img/companyProcess_end.png')}/>}
                {this.state.currentNum === 4 && i === 4 && <Image resizeMode = "center" source={require('../../img/companyProcess_end.png')}/>}

                {!(this.state.currentNum === 4 && i === 4) && !(this.state.currentNum === 0 && i === 0) && <Text style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    borderRadius:8,
                    fontSize: 12
                }}>{this.state.titleArr[i]}</Text>}

            </View>


    }

    _renderCircleTipView(i,currentNum) {

        if (i > currentNum){
            return <View>{this._circleNormalView(i)}</View>


        }else {
            return <View>{this._circleYellowView(i)}</View>



        }


    }

    _renderLineView(i){


        if (i < this.state.currentNum){
            return <View style = {{height:1,width:(SCREEN_WIDTH - 28 - 16 * 5 - 80)/4,backgroundColor:'#D8C095'}}/>
        }else if(i === this.state.currentNum){
            return <View style = {{height:1,width:(SCREEN_WIDTH - 28 - 16 * 5 - 80)/4,flexDirection: 'row'}}>
                <View style = {{height:1,flex:4.3,marginRight:4,backgroundColor:'#D8C095'}}/>
                <View style = {{height:1,flex:2.1,marginRight:3,backgroundColor:'#D8C095'}}/>
                <View style = {{height:1,flex:1.1,marginRight:2,backgroundColor:'#D8C095'}}/>
                <View style = {{height:1,flex:0.3,marginRight:4,backgroundColor:'#D8C095'}}/>
                <View style = {{height:1,flex:2,backgroundColor:'#E8E8E8'}}/>
            </View>
        }else{
            return <View style = {{height:1,width:(SCREEN_WIDTH - 28 - 16 * 5 - 80)/4,backgroundColor:'#E8E8E8'}}/>

        }




    }

    renderSubView(){
        // console.log("renderSubView");

        return   <View style={styles.processImgTipView}>
            {this._renderCircleTipView(0,this.state.currentNum)}
            {this._renderLineView(0)}
            {this._renderCircleTipView(1,this.state.currentNum)}
            {this._renderLineView(1)}
            {this._renderCircleTipView(2,this.state.currentNum)}
            {this._renderLineView(2)}
            {this._renderCircleTipView(3,this.state.currentNum)}
            {this._renderLineView(3)}
            {this._renderCircleTipView(4,this.state.currentNum)}
        </View>

    }



    render(){
        const {currentNum} = this.state

        return(

            <View style = {{justifyContent: 'center',alignItems:'center',marginTop:-12}}>
                <Image
                    source={require('../../img/rectangle_service.png')}
                    style={[styles.rectangleStyle]}>

                    {this.renderSubView()}

                    <View style={styles.titleContainer}>

                        <Text style={{fontSize:12,textAlign:'center', justifyContent: 'center',color:this.state.currentNum >= 0 ? '#D8C095' : '#999999'}}>{'开始'}</Text>
                        <Text style={{fontSize:12,textAlign:'center', justifyContent: 'center',color:this.state.currentNum >= 1 ? '#D8C095' : '#999999'}}>{'发票'}</Text>
                        <Text style={{fontSize:12,textAlign:'center', justifyContent: 'center',color:this.state.currentNum >= 2 ? '#D8C095' : '#999999'}}>{'记账'}</Text>
                        <Text style={{fontSize:12,textAlign:'center', justifyContent: 'center',color:this.state.currentNum >= 3 ? '#D8C095' : '#999999'}}>{'报税'}</Text>
                        <Text style={{fontSize:12,textAlign:'center', justifyContent: 'center',color:this.state.currentNum >= 4 ? '#D8C095' : '#999999'}}>{'完成'}</Text>

                    </View>
                </Image>
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
        height:50,
        marginTop: 5,

        backgroundColor:'#FFFFFF',
        flexDirection:'row'
    },
    rectangleStyle: {
        resizeMode: "stretch",
        width: SCREEN_WIDTH - 28,
        height : 78,
        flexDirection: 'column',
        alignItems:'center',
       // justifyContent:'center'
    },


    processImgTipView:{
        height:30,
        marginTop: 12,
        marginLeft: 43,
        marginRight: 43,
        flexDirection:'row',
        alignItems:'center'
    },
    titleContainer:{
        // marginLeft: 40,
        // marginRight: 34,
        marginTop:0,
        width:SCREEN_WIDTH - 28 - 70,
        justifyContent:'space-between',
        flexDirection:'row',
        backgroundColor:'#ffffff'
    }
});

module.exports = CompanyProcessView;