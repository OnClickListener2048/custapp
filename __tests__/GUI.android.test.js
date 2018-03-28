import Helper from "./Helper";

const helper = new Helper();
describe('--> Greet Button <--', () => {
    beforeEach(() => helper.setup());
    afterEach(() => helper.teardown());
    it('should find an element', async() => {
        let driver = helper.driver;
        try {
            await driver.waitForElementByAccessibilityId('update_cancel_button', 10000).click().sleep(2000);
        } catch (e) {
            console.log("未找到升级提示框");
        }
        // 点击第三个Tab
        let tab = await driver.waitForElementsById("cn.pilipa.custapp:id/bottom_navigation_container", 15000);
        tab[3].click();
        let text = await driver.elementByAccessibilityId('mobile').sendKeys("18777777777")
            .elementByAccessibilityId('password').sendKeys("123456")
            .elementByAccessibilityId('phoneLoginSubmit').click()
            // 登录
            .waitForElementByAccessibilityId('mine_MyOrders', 20000)// 等待我的订单
            .elementByAccessibilityId('left_text')// 获取我的订单左侧文案
            .text();
        console.log(text);
        expect(text).toEqual('我的公司');
        let leftTexts = await driver.elementsByAccessibilityId('left_text');
        console.log(leftTexts);
        text = await leftTexts[1].text();
        console.log(text);
        expect(text).toEqual('我的订单');
    });

    it('should find an element', async() => {
        let driver = helper.driver;
        try {
            await driver.waitForElementByAccessibilityId('update_cancel_button', 10000).click().sleep(2000);
        } catch (e) {
            console.log("未找到升级提示框");
        }
        // 点击第三个Tab
        let tab = await driver.waitForElementsById("cn.pilipa.custapp:id/bottom_navigation_container", 15000);
        tab[3].click();
        let text = await driver.elementByAccessibilityId('mobile').sendKeys("18777777777")
            .elementByAccessibilityId('password').sendKeys("123456")
            .elementByAccessibilityId('phoneLoginSubmit').click()
            // 登录
            .waitForElementByAccessibilityId('mine_MyOrders', 20000)// 等待我的订单
            .elementByAccessibilityId('left_text')// 获取我的订单左侧文案
            .text();
        console.log(text);
        expect(text).toEqual('我的公司');
        let leftTexts = await driver.elementsByAccessibilityId('left_text');
        console.log(leftTexts);
        text = await leftTexts[1].text();
        console.log(text);
        expect(text).toEqual('我的订单');
    });


});