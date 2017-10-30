/**
 * Created by jiaxueting on 2017/7/3.
 */
import React, { PropTypes } from 'react';
import { Image, ActivityIndicator,Dimensions, } from 'react-native';
import  TimerMixin from "react-timer-mixin";
const window = Dimensions.get('window');
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

class ImageLoad extends React.Component {
    static propTypes = {
        isShowActivity: PropTypes.bool,
        isWatch:PropTypes.bool,
    };

    static defaultProps = {
        isShowActivity: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isError: false,
            isWatch:this.props.isWatch,
            animating: true,
        };
    }

    onLoadEnd(){
        this.setState({
            isLoaded: true
        });
    }

    //图片加载超时（暂定5秒）
    setToggleTimeout() {
        TimerMixin.setTimeout(() => {
            this.setState({animating:false});
            // this.setState({animating: !this.state.animating});
            this.setToggleTimeout();
        }, 5000);
    }

    componentDidMount() {
        this.setToggleTimeout();
    }

    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写

        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    onError(){
        this.setState({
            isError: true
        });
    }

    render() {
        return(
            <Image
                onLoadEnd={this.onLoadEnd.bind(this)}
                onError={this.onError.bind(this)}
                style={[this.props.style, { alignItems: 'center' }]}
                source={this.props.source}
                fadeDuration={0}
                resizeMode={this.props.resizeMode}
            >
                {
                    this.state.isLoaded && !this.state.isError ? null :
                        <Image
                            fadeDuration={0}
                            style={[this.props.isWatch===false?this.props.placeholderStyle ? this.props.placeholderStyle : styles.imagePlaceholderStyles:styles.imagePlaceholderStyle]}
                            source={require('../img/empty-image.png')}
                            resizeMode={'contain'}
                        >
                            {
                                this.props.children  ? this.props.children :
                                    this.props.isShowActivity ?
                                        <ActivityIndicator
                                            animating={this.state.animating}
                                            size={this.props.loadingStyle ? this.props.loadingStyle.size : 'small'}
                                            color={this.props.loadingStyle ? this.props.loadingStyle.color : 'black'}
                                        /> :
                                        null
                            }
                        </Image>
                }
            </Image>
        );
    }
}

const styles = {
    imagePlaceholderStyles: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT,
    },
    imagePlaceholderStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT,
    }
}

export default ImageLoad;
