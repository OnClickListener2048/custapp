# 打UI自动化测试包
echo -e "// 本文件内容在 Jenkins 自动打包时会被覆盖, release 模式会自动设置为 false, dev 会设置为true, 修改仅对本地环境生效, 请勿提交\nexport const DEBUG = true;\nexport const GUI_TEST = true;" > app/flags.js