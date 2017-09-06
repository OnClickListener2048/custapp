/**
 * Created by jinglan on 2017/6/8.
 */

import React, {PropTypes} from 'react';
import {View, Text,Image,StyleSheet} from 'react-native';
export default class TopcenterImgBottomTitleView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            applicationImg: this.props.applicationImg,
            applicationTitle: this.props.applicationTitle,
            badge:this.props.badge,
        }
        this._setBageNum = this._setBageNum.bind(this);

    }

    static propTypes = {
        style: PropTypes.object,
        applicationTitle: PropTypes.string,
        applicationImg: PropTypes.number,
        badge:PropTypes.number,
    };

    _setBageNum(num){
        this.setState({badge : num});
    }

    render() {
        const { style} = this.props
        const {applicationTitle, applicationImg,badge} = this.state
        return (
                <View
                    style={[{width: 70, height: 44, justifyContent: 'center'}, style]}>
                    <Image
                        source={require('../img/bigk.png')}
                        style={[{resizeMode: "stretch", justifyContent: 'center'},style]}>
                    <Image
                        source={applicationImg}
                        style={[{
                            resizeMode: "contain",
                            marginBottom: 2,
                            alignSelf: 'center',
                        }
                        ]
                        }

                    />
                    <View style={{position: 'absolute',width: 130, height: 70, backgroundColor: 'transparent'
                    }}>

                        {badge != null && badge > 0 && badge<100&&
                        <View style={[styles.badgeBubble,{width:10+5*(badge+"").length}]}>
                            <Text style={styles.badgeText}>{badge || 0}</Text>
                        </View>}

                        {badge != null && badge > 99&&
                        <View style={[styles.badgeBubble,{width:10+5*(200+"").length}]}>
                            <Text style={styles.badgeText}>{'99+'}</Text>
                        </View>}

                    </View>
                    <Text
                        textAlign='center'
                        style={[{fontSize: 12,marginTop: 10,alignSelf:'center'}] }>{applicationTitle}</Text>
                    </Image>
                </View>
        )
    }
}

//textStyle, {color: textStyle.color}]
const styles = StyleSheet.create({
    badgeBubble: {
        width: 15,
        height:15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#e5151d',
        marginLeft:88,
    },
    badgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        top: -0.5
    }

});
