/**
 * Created by jiaxueting on 2018/4/3.
 */
import Helper from "./Helper";

const helper = new Helper();
describe('--> Greet Button <--', () => {
    beforeEach(() => helper.setup());
    beforeEach(() => helper.login());
    it('公司页面数据检测', async() => {

        let driver = helper.driver;
        //点击我的公司页面
        // await driver.waitForElementByAccessibilityId('mine_MyCompany',20000).click();




    });
});