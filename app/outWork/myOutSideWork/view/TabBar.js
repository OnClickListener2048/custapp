'use strict';
// https://github.com/Slowyn/react-native-underline-tabbar
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    ScrollView,
    Dimensions
} from 'react-native';

const window = Dimensions.get('window');
export const height = window.height;
export const width = window.width;
let naviButtonWidth = width / 3;    //计算导航条每个宽度
let naviButtonHeight = width * 0.75;   // 导航条每个高度

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height:46,
    width: naviButtonWidth,

  },
  scrollContainer: {
    paddingRight: 0,
  },
  tabs: {
    height:46.7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.7,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#e6e6e6'
  },

  badgeBubble: {
    width: 15,
      height:15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    top: -0.5
  }
});

class TabBar extends Component {

  static propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    underlineColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    tabBarTextStyle:PropTypes.object,
    scrollContainerStyle: PropTypes.object,
    tabStyles: PropTypes.object
  };

  static defaultProps = {
    tabStyles: {}
  };
  constructor(props) {
    super(props);
  }
  renderTab = (tab, page) => {
      // this.props.callback(page);
      const {activeTab, tabBadgeColor} = this.props;
    const {label,  badge,badgeColor,theLast} = tab;
    const isTabActive = activeTab === page;
    const activeTextColor = this.props.activeTextColor || "navy";
    const inactiveTextColor = this.props.inactiveTextColor || "black";
    const textStyle = this.props.tabBarTextStyle || {};
    return (
        <TouchableOpacity key={page}
                          onPress={() => this.props.goToPage(page)}
                          >
          <View style={[styles.tab, this.props.tabStyles.tab]}>
            <View style={{
                justifyContent:'space-between',
                flexDirection:'row',
                alignItems:'center',
                width:naviButtonWidth-2,
                height:46,
            }}>
              <View style={{width:theLast,height:20,backgroundColor:'#e6e6e6'}}/>
              <Text style={[{color: isTabActive ? activeTextColor : inactiveTextColor, alignSelf:'center',fontWeight: isTabActive ? '400' : '400'}, textStyle]}>{label}</Text>
              <View style={{width:theLast,height:20,backgroundColor:'#e6e6e6'}}/>
              <View style={{position: 'absolute',
                  marginLeft:naviButtonWidth-35,
                  paddingTop:8,
                  width: 15,
                  height:46,}}>
                {badge != null && badge > 0 && badge<100&&
                <View style={[styles.badgeBubble,
                    this.props.tabStyles.badgeBubble,
                    {backgroundColor: badgeColor || activeTextColor},{width:10+5*(badge+"").length}]}>
                  <Text style={[styles.badgeText, this.props.tabStyles.badgeText]}>{badge || 0}</Text>
                </View>}

                {badge != null && badge > 99&&
                <View style={[styles.badgeBubble,
                    this.props.tabStyles.badgeBubble,
                    {backgroundColor: badgeColor || activeTextColor},{width:10+5*(badge+"").length}]}>
                  <Text style={[styles.badgeText, this.props.tabStyles.badgeText]}>99+</Text>
                </View>}
              </View>
            </View>

            </View>
        </TouchableOpacity>

    );
  }

  renderUnderline() {
      const containerWidth = this.props.containerWidth;
      const numberOfTabs = this.props.tabs.length;

    var tabUnderlineStyle = {
      position: 'absolute',
      backgroundColor: this.props.underlineColor || "navy",
      height: 2,
      bottom: 0,
        width: containerWidth / numberOfTabs,
    };
      const left = this.props.scrollValue.interpolate({
          inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
      });
    return <Animated.View style={[tabUnderlineStyle, {left}]}/>
  }

  render() {
    return (
        <View style={[styles.tabs, {backgroundColor : this.props.backgroundColor}, this.props.style, this.props.tabBarStyle]}>
            {this.props.tabs.map(this.renderTab)}
            {this.renderUnderline()}
        </View>
    );
  }
}

module.exports = TabBar; 
