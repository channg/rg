let Path = require("path")
let fse = require("fs-extra")
const simpleGit = require('simple-git')(process.cwd());


module.exports = function (func) {
  fse.removeSync(Path.resolve(process.cwd(),'version.md'))

  simpleGit.tags({"-n":true},(err,tags)=>{
    fse.outputFileSync(Path.resolve(process.cwd(),'version.md'), tags.all.map((str)=>{
      return `* ${str}`
    }).join("\n"))
    func()
  })
}
