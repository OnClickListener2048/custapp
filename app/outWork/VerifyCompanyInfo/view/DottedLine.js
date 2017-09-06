/**
 * Created by jinglan on 2017/6/14.
 */
import React, {PropTypes,Component} from 'react';
import {View, Text,Image,Dimensions,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Alert,} from 'react-native';

const window = Dimensions.get('window');
const screenWidth = window.width;


export default class DottedLine extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dottedLineWidth: this.props.dottedLineWidth,
            grayWidth: this.props.grayWidth,
            whiteWidth: this.props.whiteWidth


        }
    }

    static propTypes = {
        dottedLineWidth: PropTypes.number,
        grayWidth: PropTypes.number,
        whiteWidth: PropTypes.number
    };




    render() {
        const { dottedLineWidth,grayWidth,whiteWidth} = this.state

        var arr = [];
        for (let i = 0; i * (grayWidth + whiteWidth) < this.props.dottedLineWidth; i++) {
            arr.push(i);
        }


        return <View style={{flexDirection: 'row',height: 1,flex: 1,backgroundColor:'#FFFFFF'}}>

            {
                arr.map((item, index) => {
                    return <View key = {index} style={{width: this.props.grayWidth ,width:this.props.grayWidth , marginRight:this.props.whiteWidth,backgroundColor:'#c8c8c8'}}>
                    </View>
                })
            }
        </View>

    }
}
module.exports = DottedLine;

