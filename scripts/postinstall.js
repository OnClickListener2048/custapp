const cp = require('child_process');
cp.execSync(`rm -rf node_modules/jpush-react-native/android/build`);
//cp.execSync(`react-native bundle --platform android --entry-file index.android.js --reset-cache --bundle-output android/app/src/main/assets/index.android.bundle --dev false --assets-dest android/app/src/main/res/`);