### react-native-alert

https://github.com/uyson/react-native-alert

Node: 修改样式以适应内部App.
修复了message为空时的crash问题.

#### Features
1. Pure javascript solution.


thanks to https://github.com/magicismight/react-native-root-toast.git
### Install 
`npm install rn-alert`

### How to use

``` js
import Alert from 'rn-alert';
#set custom text style , is just need to set font
# not require
var styles = StyleSheet.create({
	alertTextStyle : {
		fontFamily: "Arial",//just set global fontFamily
	},
})
Alert.setTextStyle(styles.alertTextStyle);

# call alert
let toast = Alert.alert('title', 'message', [
            {
                text: "OK",
                onPress: ()=>{}
            },
            {
                text: "cancel",
                onPress: ()=>{}
            }
        ]);
```
	
	
	
	
