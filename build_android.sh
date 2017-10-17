rm -f android/app/src/main/assets/index.android.bundle
/usr/local/bin/yarn
echo make android bundle
/usr/local/bin/node /usr/local/lib/node_modules/react-native-cli bundle --platform android --entry-file index.android.js --reset-cache --bundle-output android/app/src/main/assets/index.android.bundle --dev false --assets-dest android/app/src/main/res/
rm -f android/app/build/outputs/apk/*.apk
echo Building APK
rm -rf node_modules/jpush-react-native/android/build
cd android && ./gradlew assemble