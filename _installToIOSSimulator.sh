# 一键安装ios编译好的模拟器 App 到模拟器
# https://www.quora.com/Is-it-possible-to-install-an-app-in-an-iOS-simulator
#!/usr/bin/env bash
xcrun simctl install booted ios/build/Build/Products/Debug-iphonesimulator/corpapp.app