/**
 * Created by liufei on 2017/9/14.
 */

var Dimensions = require('Dimensions');
const BASE_WIN_HEIGHT = 667;//以iphone 6s手机为基准，按比例进行适配
const BASE_WIN_WIDTH = 375;

export default class AdapterUI {
    static getHeight(h) {
        if (!this.height) {
            var {height, width} = Dimensions.get('window');
            this.height = height;
            this.width = width;
        }
        return h / 2 * (this.height / BASE_WIN_HEIGHT);
    }

    /** 根据实际屏幕尺寸转换对应的像素宽度 */
    static getWidth(w) {
        if (!this.width) {
            var {height, width} = Dimensions.get('window');
            this.height = height;
            this.width = width;
        }
        return w / 2 * (this.width / BASE_WIN_WIDTH);
    }


}