var inquirer = require('inquirer');
var gitSemverTags = require('git-semver-tags', []);


module.exports = function () {
  if(!require('./src/utils').existsGit()){
    console.log("\u001b[31m这不是一个git仓库\u001b[39m")
    return;
  }
  inquirer.prompt([
    {
      type: "list",
      message: "选择发布type:",
      name: "type",
      choices: [
        {
          name: "work"
        },
        {
          name: "fix",
        },
        {
          name: "feature"
        },
      ]
    },
    {
      type: 'input',
      message: '版本更新内容',
      name: 'msg',
      validate: function(val) {
        if(val.length!==0){
          return true
        }
        return "请填写版本更新内容";
      }
    }
  ]).then((answers) => {
    //找到所有tag
    gitSemverTags(function(err, tags) {
      require("./src/main")(answers,tags)
    });
  })
}


