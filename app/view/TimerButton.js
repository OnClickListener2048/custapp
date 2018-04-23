/**
 *  原始代码和文章来自: http://www.jianshu.com/p/51736baead49
 *  有改动.
 *
 *  使用说明

 <TimerButton enable={phoneNumber.length}
 style={{width: 110,marginRight: 10}}
 textStyle={{color: StaticColor.COLOR_MAIN}}
 timerCount={10}
 onClick={(shouldStartCountting)=>{
    this._requestSMSCode(shouldStartCountting)
    // 注意回调这里不要调用shouldStartCountting(true/false)启停倒计时,
     // 否则会造成死循环
  }}/>

 onClick：触发后按钮selfEnable会立即被置为false
 通过onClick中的一系列逻辑处理之后需要调用回调函数结束倒计时
 shouldStartCountting：回调函数，接受一个Bool类型的参数
 shouldStartCountting(true)，开始倒计时，倒计时结束时自动恢复初始状态
 shouldStartCountting(false)， 按钮的selfEnable会立即被置为true

 * Created by beansoft on 2017/5/22.
 */
import React, {PropTypes} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
export default class TimerButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timerCount: this.props.timerCount || 90,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            selfEnable: true,
        };
        this._shouldStartCountting = this._shouldStartCountting.bind(this)
        this._countDownAction = this._countDownAction.bind(this)
    }

    static propTypes = {
        style: PropTypes.object,
        textStyle: Text.propTypes.style,
        onClick: PropTypes.func,
        disableColor: PropTypes.string,
        timerTitle: PropTypes.string,
        enable: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number])// 组件是否可用
    };

    _countDownAction() {
        const codeTime = this.state.timerCount;
        this.interval = setInterval(() => {
            const timer = this.state.timerCount - 1
            if (timer === 0) {
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: this.props.timerTitle || '获取验证码',
                    counting: false,
                    selfEnable: true
                })
            } else {
                console.log("---- timer ", timer);
                this.setState({
                    timerCount: timer,
                    timerTitle: `剩余(${timer}s)`,
                })
            }
        }, 1000)
    }

    // 重置状态
    reset() {
        clearInterval(this.interval);
        this.setState({
            timerCount: this.props.timerCount || 90,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            selfEnable: true,
        })
    }


    _shouldStartCountting(shouldStart) {
        console.log('_shouldStartCountting(', shouldStart, ')')

        if (this.state.counting) {
            return
        }

        if (shouldStart) {
            this._countDownAction()
            this.setState({counting: true, selfEnable: false})
        } else {
            this.setState({selfEnable: true})
        }
    }

    componentWillUnmount() {
        console.log("TimerButton.js componentWillUnmount()");
        clearInterval(this.interval)
    }

    render() {
        const {onClick, style, textStyle, enable, disableColor} = this.props
        const {counting, timerTitle, selfEnable} = this.state
        return (
            <TouchableOpacity
                {...this.props}
                activeOpacity={counting ? 1 : 0.8} onPress={() => {
                if (!counting && enable && selfEnable) {
                    this.setState({selfEnable: false})
                    this.props.onClick(this._shouldStartCountting)
                }
            }}>
                <View
                    style={[{width: 70, height: 44,  justifyContent: 'center', alignItems: 'flex-end'}, style]}>
                    <Text
                        textAlign='right'
                        style={[{fontSize: 12}, textStyle, {color: ((!counting && enable && selfEnable) ? textStyle.color : disableColor || '#c8c8c8')}]}>{timerTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}