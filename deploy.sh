#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
 # 生成静态文件
 npm run docs:build

 # 进入生成的文件夹
 cd docs/.vuepress/dist

# 移动资源目录并删除无关文件
cp -a 1970/01/01/. ./
cp docs/index.html ./
rm -rf docs
rm -rf 1970
rm -rf public

# git 提交准备
git init
git add -A
git commit -m "deploy"

# 发布到 https://king-peach.github.io
git push -f git@github.com:king-peach/king-peach.github.io.git master

cd -
