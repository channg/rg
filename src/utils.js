let fs = require('fs')
let Path = require("path")
module.exports = {
  existsGit() {
    return fs.existsSync(Path.resolve(process.cwd(), '.git'))
  },
  packageJsonVersion(){
    return require(Path.resolve(process.cwd(),'package.json')).version
  }
}
