# 前端开发工具

该仓库不再维护，新仓库：http://git.jtjr.com/jfet/workflow

插件化，具备项目初始化，构建，调试，文档等功能

## 插件

- jfet-init 初始化项目
- jfet-build 构建打包
- jfet-server 调试服务
- jfet-pack 离线包
- jfet-doc 生成发布文档
- jfet-image 图片处理插件

## 发布

发布前，需要先`把本地的修改都提交`，并且需要先切换npm registry为`http://npm.jyblife.com/`

```shell
npm run publish
```

## 测试

```shell
npm test
```

## 文档

```shell
npm run doc
```

