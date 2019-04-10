# rg

* 版本控制工具

```
npm i -g node-rg
```

使用`rg`命令代替`push`操作

`rg`会自动帮你提交版本信息，生成`version.md`版本文件

自动打git tag。自动递增`packag.json`版本

```
rg
```

>使用rg可以生成changefile，并且规范化tag，并自动防止tag冲突

* `work`
普通版本提升，正常升级
* `fix`
修复版本
* `feature`
大版本更新
