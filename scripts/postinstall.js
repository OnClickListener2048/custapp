const cp = require('child_process');
cp.execSync(`rm -rf node_modules/jpush-react-native/android/build`);
// 修复错误: node_modules/vargs/lib/vargs.js: arguments is a reserved word in strict mode (24:37)
cp.execSync(`cp scripts/vargs.js node_modules/vargs/lib/vargs.js`);
//cp.execSync(`react-native bundle --platform android --entry-file index.android.js --reset-cache --bundle-output android/app/src/main/assets/index.android.bundle --dev false --assets-dest android/app/src/main/res/`);