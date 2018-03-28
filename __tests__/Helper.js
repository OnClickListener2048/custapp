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

    teardown() {
        return this.driver.quit();
    }
}