import wd from 'wd';
export default class Helper {
    setup() {
        const capabilities = {
            platformName: 'Android',
            deviceName: 'Android Test',
            // platformVersion: '10.2',
            app: "/Users/liufei/Desktop/li-armeabi-v7a-release.apk"
        };
        this.driver = wd.promiseChainRemote('0.0.0.0', 4723);
        jest.setTimeout(600*1000);
        return this.driver.init(capabilities);
    }

    // login(){
    //    var test= async() => {
    //         let driver = helper.driver;
    //         try {
    //             await driver.waitForElementByAccessibilityId('update_cancel_button', 10000).click().sleep(2000);
    //         } catch (e) {
    //             console.log("未找到升级提示框");
    //         }
    //         // 点击第三个Tab
    //         let tab = await driver.waitForElementsById("cn.pilipa.custapp:id/bottom_navigation_container", 15000);
    //         tab[3].click();
    //         await driver.elementByAccessibilityId('mobile').sendKeys("18777777777")
    //             .elementByAccessibilityId('password').sendKeys("123456")
    //             .elementByAccessibilityId('phoneLoginSubmit').click()
    //         // 登录
    //     };
    //     test();
    // }

    async login (){
        let driver = this.driver;
        try {
            await driver.waitForElementByAccessibilityId('update_cancel_button', 10000).click().sleep(2000);
        } catch (e) {
            console.log("未找到升级提示框");
        }
        // 点击第三个Tab
        let tab = await driver.waitForElementsById("cn.pilipa.custapp:id/bottom_navigation_container", 15000);
        tab[3].click();
        await driver.elementByAccessibilityId('mobile').sendKeys("18777777777")
            .elementByAccessibilityId('password').sendKeys("123456")
            .elementByAccessibilityId('phoneLoginSubmit').click()
    }
    teardown() {
        return this.driver.quit();
    }
}