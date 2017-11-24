/**
 * Created by zhuangzihao on 2017/10/25.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';

export default class PLPActivityIndicator extends React.Component {

    static defaultProps = {
        message: '加载中...',
        isShow:false
    };

    render() {


        if(this.props.isShow){
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.container} >
                        <View style={[styles.activeBg]}>
                            <ActivityIndicator
                                animating={true}
                                size="large"
                            />
                            <Text style={styles.message}>
                                {this.props.message}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            )
        }
        return null;
    }
}

PLPActivityIndicator.propTypes = {
    message:React.PropTypes.string,
    isShow: React.PropTypes.boolean
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:888
    },
    activeBg:{
        padding:15,
        backgroundColor:'rgba(0,0,0,0.8)',
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center'
    },
    message:{
        color:'white',
        fontSize:15,
        marginTop:5,
        opacity:0.8
    }
})