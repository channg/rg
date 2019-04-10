const editJsonFile = require("edit-json-file");
const Path = require("path")
const spawn = require('cross-spawn');
module.exports = function (answer, tags) {
  let tag;
  let version = require("./utils").packageJsonVersion()
  if (!version) {
    console.log("\u001b[31m请创建package.json用于版本控制\u001b[39m")
    return;
  }
  if (tags.length === 0) {
    //git上没有tag 直接提交当前package.json version tag
    tag = version
  } else {
    if (answer.type === "work") {
      let myV = splitVersion(version)
      let last = myV[2]
      tags.forEach((remoteTag) => {
        if (splitVersion(remoteTag)[0] === myV[0] && splitVersion(remoteTag)[1] === myV[1]&&splitVersion(remoteTag)[2]>myV[2]) {
          last = splitVersion(remoteTag)[2]
        }
        //work tag末尾 要比当前git remote 上的tag 大1
        tag = `${myV[0]}.${myV[1]}.${last+1}`
      })
    } else if(answer.type === "fix"){
      let myV = splitVersion(version)
      let last = myV[1]
      tags.forEach((remoteTag) => {
        if (splitVersion(remoteTag)[0] === myV[0] && splitVersion(remoteTag)[1] > myV[1]) {
          last = splitVersion(remoteTag)[1]
        }
        //fix tag 中位要比当前git remote 上的tag 大1 末位归零
        tag = `${myV[0]}.${last+1}.0`
      })
    } else if(answer.type === "feature"){
      let myV = splitVersion(version)
      let last = myV[0]
      tags.forEach((remoteTag) => {
        if (splitVersion(remoteTag)[0] > myV[0]) {
          last = splitVersion(remoteTag)[1]
        }
        //fix tag 中位要比当前git remote 上的tag 大1 末位归零
        tag = `${last+1}.0.0`
      })
    }
    console.log("tag is :"+ tag)
    let file = editJsonFile(Path.resolve(process.cwd(),'package.json'));
    file.set("version",tag)
    file.save();
    require('./version')(function () {
      spawn.sync("git",["add","version.md"], { stdio: 'inherit' })
      spawn.sync("git",["add","package.json"], { stdio: 'inherit' })
      spawn.sync("git",["commit","package.json","version.md","-m","rg commit version "+tag], { stdio: 'inherit' })
      spawn.sync("git",["tag","-a",tag,"-m",answer.msg], { stdio: 'inherit' })
      spawn.sync("git",["push","origin","--tags"], { stdio: 'inherit' })
      spawn.sync("git",["push"], { stdio: 'inherit' })
    })
  }
}


function splitVersion(str) {
  if (/[0-9]\.[0-9]\.[0-9]/.test(str)) {
    return str.split(".").map((x) => {
      return parseInt(x)
    })
  }
}
