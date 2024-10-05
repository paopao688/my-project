//解码
//vs 函数无空格
const gameName = "ttt"
var save = function () {
    var data = {
        set: {
            //设置
        },
        files: {
            //存档
            111: {
                a: 1,
                b: 2
            }
        }
    }
    var key = 222
    //设置存档名不能特殊符号
    let value = JSON.stringify(data)
    localStorage.setItem(gameName, value)
}
var get = function () {
    var key = 222
    let value = localStorage.getItem(gameName)
    value = JSON.parse(value)
    return value
}
var getfile = function(){
    let value = localStorage.getItem(gameName)
    value = JSON.parse(value)
    
    //展示全部存档
    var filesName = value.files.keys()
    var q = 1
    //选择自己的
    //鼠标滚轮 左右上下选择
    //菜单 ui 
}






var pages = []
//打开暂停时间
//菜单 ui
class Page {
    constructor(x, y, width, height){
        //绘制在最上层 单独层
        //id
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        pages.push(this)
    }
    x = 0
    y = 0
    width = 0
    height = 0
    moving = false
    scaling = false
    backgroundColor = "pink"
    backgroundImage = null

    addOption(x, y, width, height){
        //详细设置 能更进一步页面 自定义输入编写
        var option = new Option(x, y, width, height)

    }
    addSelection(){
        //多个可选项 下拉框
    }
    addChoice(){
        //单选 开关
    }
    addClose(x, y, width, height){
        //添加关闭键
    }

}

var a = new Page(50, 50, 200, 300)


class Option extends Page{
    constructor(x, y, width, height){
        super(x, y, width, height)
        
    }
}