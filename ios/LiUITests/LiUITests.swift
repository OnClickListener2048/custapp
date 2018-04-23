//
//  LiUITests.swift
//  LiUITests
//
//  Created by beansoft on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

import XCTest

class LiUITests: XCTestCase {
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        XCUIApplication().launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testExample() {
        // Use recording to get started writing UI tests.
      
      let app = XCUIApplication()
      app.tabBars.buttons["我的"].tap()
      
      let mobilePasswordElement = app.children(matching: .window).element(boundBy: 0).children(matching: .other).element.children(matching: .other).element.children(matching: .other).element.children(matching: .other).element.children(matching: .other).element.children(matching: .other)["mobile password 点击登录即视为同意 《用户注册和使用协议》 登录"].children(matching: .other)["mobile password 点击登录即视为同意 《用户注册和使用协议》 登录"].children(matching: .other)["mobile password 点击登录即视为同意 《用户注册和使用协议》 登录"].children(matching: .other)["mobile password 点击登录即视为同意 《用户注册和使用协议》 登录"].children(matching: .other)["mobile password 点击登录即视为同意 《用户注册和使用协议》 登录"]
      mobilePasswordElement.tap()
      app.typeText("13810397064")
      mobilePasswordElement.tap()
      app.typeText("123456")
      mobilePasswordElement.tap()
      app.alerts["对不起"].buttons["确定"]/*@START_MENU_TOKEN@*/.press(forDuration: 0.6);/*[[".tap()",".press(forDuration: 0.6);"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/
        // Use XCTAssert and related functions to verify your tests produce the correct results.
    }
    
}
