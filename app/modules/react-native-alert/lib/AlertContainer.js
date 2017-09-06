var React = require('react');
var ReactNative = require('react-native');

import {
	Component,
	PropTypes,
} from 'react';

import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableWithoutFeedback,
	PixelRatio,
} from 'react-native';

const DIMENSION = Dimensions.get('window');
const WINDOW_WIDTH = DIMENSION.width;
const WINDOW_HEIGHT = DIMENSION.height;
const BORDER_WIDTH = 1 / PixelRatio.get();
const BORDER_COLOR = '#dbdbdf';
const textStyle  = {
	fontFamily: "Arial",
}
let styles = StyleSheet.create({
	defaultStyle: {
		position: 'absolute',
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		left: 0,
		top: 0,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: 'rgba(0,0,0, 0.3)'
	},
	containerStyle: {
		marginHorizontal: 40,
		paddingTop: 20,
		backgroundColor: '#fff',
        // height: 256/2,
		// width: 540/2,
        flex: 1,
		borderRadius: 12,
	},
	// 标题
	title: {
		textAlign: 'center',
		marginHorizontal: 20,
		fontSize: 17,
		// fontWeight: 'bold',
		// lineHeight: 22,
		backgroundColor: 'transparent',
		marginBottom: 10,
	},
	// 消息内容
	message: {
		textAlign: 'center',
		fontSize: 17,
		marginHorizontal: 16,
		marginBottom: 25,
	},
	button: {
		height: 44,
		borderColor: BORDER_COLOR,
		justifyContent: 'center',
		// backgroundColor: 'red',
		backgroundColor: 'transparent',
	},
	buttonText: {
		textAlign: 'center',
		backgroundColor: 'transparent',
		fontSize: 17,
		color: '#969696',
		fontWeight: 'bold',
	},
	doubleButton: {
		flex: 1,
	},
	textStyle: {},
});

class AlertContainer extends Component {
	static displayName = 'AlertContainer';

	static propTypes = {
		...View.propTypes,
		children: PropTypes.string.isRequired,
		message: PropTypes.string,
		buttons: PropTypes.array,
		textStyle: Text.propTypes.style,
	};

	static defaultProps = {
		message: null,
		buttons: [],
		textStyle: styles.textStyle
	};

	constructor() {
		super(...arguments);
	}

	_root = null;
    // 渲染一个按钮
	_renderSigleButton(button) {
		return (
			<TouchableWithoutFeedback onPress={() => {
				if(button.onPress)
					button.onPress()
				this.props.close && this.props.close()
			} }>
				<View style={[styles.button, {
					borderTopWidth: BORDER_WIDTH,
				}]}>
					<Text style={[styles.buttonText, this.props.textStyle, {color: '#ef0c35'}]}>{button.text}</Text>
				</View>
			</TouchableWithoutFeedback>
				)
	}
	// 渲染两个按钮
	_renderDoubleButton(buttons) {
		return (
			<View style={{
				borderTopWidth: BORDER_WIDTH,
				borderColor: BORDER_COLOR,
				flexDirection: 'row',
			}}>
				<TouchableWithoutFeedback onPress={() => {
					if(buttons[0].onPress)
						buttons[0].onPress()
					this.props.close && this.props.close()
				} }>
					<View style={[styles.button, { flex: 1 }]}>
						<Text style={[styles.buttonText, this.props.textStyle]}>{buttons[0].text}</Text>
					</View>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => {
					if(buttons[1].onPress)
						buttons[1].onPress()
					this.props.close && this.props.close()
				} }>
					<View style={[styles.button, {
						borderLeftWidth: BORDER_WIDTH,
						flex: 1,
					}]}>
						<Text style={[styles.buttonText, this.props.textStyle, {color: '#ef0c35'}]}>{buttons[1].text}</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
		)
	}
	_renderMoreThan2Buttons(buttons) {
		return buttons.map((button, i) => {
			return (
				<TouchableWithoutFeedback key={i} onPress={() => {
					if(button.onPress)
						button.onPress()
					this.props.close && this.props.close()
				} }>
					<View style={[styles.button, {
						borderTopWidth: BORDER_WIDTH,
					}]}>
						<Text style={[styles.buttonText,this.props.textStyle, this.props.textStyle]}>{button.text}</Text>
					</View>
				</TouchableWithoutFeedback>
			)
				})
	}
	_renderButtons(buttons) {
		console.log(buttons, 'buttons')
        console.log(buttons.length, 'buttons.length')
		switch (buttons.length) {
			case 0:
				return this._renderSigleButton({
					text: "OK",
					onPress: () => { }
				})
			case 1:
				return this._renderSigleButton(buttons[0])
			case 2:
				return this._renderDoubleButton(buttons)
			default:
				return this._renderMoreThan2Buttons(buttons)
		}
	}
	render() {
		let {props} = this;
		return <View
			style={[
				styles.defaultStyle,
			]}
			>

			<View
				style={[
					styles.containerStyle,
				]}

				ref={ele => this._root = ele}
				>
				<Text style={[
					styles.title,
					props.textStyle,
                    , {color: '#323232'}
				]}>
					{props.children}
				</Text>

				{props.message !== null && props.message.length > 0 && <Text style={[styles.message, props.textStyle,]}>{props.message}</Text>}
                { (props.message === null || props.message.length === 0) && <Text style={[styles.message, props.textStyle,]}> </Text>}

				{this._renderButtons(props.buttons) }
			</View>
		</View>;
	}
}

export default AlertContainer;
