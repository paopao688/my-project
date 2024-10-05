var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var myObject = window.myObject;
var createAABB
var createCircle
var testNumber = 10
var warn = console.warn;

//warn(111);
//暂停按钮
//collider 删除自身
//球体碰撞√
//增加碰撞持续时间 (待)
//选择框
//选中物体加深描边 
//默认颜色
//shift锁定坐标轴滑动
//拖拽一个或是全部选择
(function () {
    function checkLine(amin, amax, bmin, bmax) {
        if (amax < bmin || amin > bmax) {
            return false
        } else {
            return true
        }
    }
    function checkBox(a, b) {
        return (checkLine(a.x, a.x + a.width, b.x, b.x + b.width) && checkLine(a.y, a.y + a.height, b.y, b.y + b.height))
    }
    //AABB包围盒碰撞优化
    //https://blog.csdn.net/qq_35516360/article/details/122064793

    function checkAABBandCircle(AABB, Circle) {
        let r = Circle.radius
        let a = Math.pow(AABB.x - Circle.x, 2)
        let b = Math.pow(AABB.x + AABB.width - Circle.x, 2)
        let c = a > b ? b : a
        let d = Math.pow(AABB.y - Circle.y, 2)
        let e = Math.pow(AABB.y + AABB.height - Circle.y, 2)
        let f = d > e ? e : d
        let g = c + f
        let h = Math.pow(r, 2)
        let i = (h > g)

        // if (AABB.x < Circle.x && AABB.x + AABB.width > Circle.x) {
        //     if (Circle.y - Circle.radius < AABB.y + AABB.height && Circle.y + Circle.radius > AABB.y) {
        //         //接触
        //         return true
        //     }
        // }
        // if (AABB.y < Circle.y && AABB.y + AABB.height > Circle.y) {
        //     if (Circle.x - Circle.radius < AABB.x + AABB.width && Circle.x + Circle.radius > AABB.x) {
        //         //接触
        //         return true
        //     }
        // }

        if (AABB.x < Circle.x && AABB.x + AABB.width > Circle.x && Circle.y - Circle.radius < AABB.y + AABB.height && Circle.y + Circle.radius > AABB.y) {
            return true
        }
        if (AABB.y < Circle.y && AABB.y + AABB.height > Circle.y && Circle.x - Circle.radius < AABB.x + AABB.width && Circle.x + Circle.radius > AABB.x) {
            return true
        }
        return i
        //接触

    }
    //js绝对值
    //https://cn.bing.com/search?q=js+%E7%BB%9D%E5%AF%B9%E5%80%BC&qs=n&form=QBRE&sp=-1&lq=0&pq=js+%E7%BB%9D%E5%AF%B9%E5%80%BC&sc=10-6&sk=&cvid=27121148484E4600BDB965ACA08DC0BF&ghsh=0&ghacc=0&ghpl=
    //jspow求平方
    //https://www.runoob.com/python/func-number-pow.html
    //AABB和圆碰撞
    //https://busyogg.github.io/article/09bda077a263/#:~:text=%E5%9C%86%E4%B8%8E%20AABB%20%E8%BF%9B%E8%A1%8C

    function checkCircle(CircleA, CircleB) {
        // let a = Math.pow(CircleA.x - CircleB.x, 2)
        // let b = Math.pow(CircleA.y - CircleB.y, 2)
        // var jj = (Math.pow(CircleA.radius + CircleB.radius, 2) > a + b)
        //return jj
        return (Math.pow(CircleA.radius + CircleB.radius, 2) > Math.pow(CircleA.x - CircleB.x, 2) + Math.pow(CircleA.y - CircleB.y, 2))
    }
    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
    var id = 0
    function getID() {
        id++
        return id
    }
    const Colliders = []
    myObject.Colliders = Colliders
    class Collider {
        constructor (x, y) {
            Colliders.push(this)
            this.id = getID()
            this.x = x
            this.y = y
            //log(this)
        }
        x = 0
        y = 0
        id = null
        ColliderType = null
        touch = []
        type = {
            static: false,
            stay: 1,
            //静止后1帧内不再运动设为静态

        }

        isTouching(targetCollider) {
            /*
            switch(this.ColliderType){
                case "AABB":

                break;
                case "Circle":

                break;
            }
                */
            let typeA = this.ColliderType
            let typeB = targetCollider.ColliderType
            if (typeA == "AABB") {
                if (typeB == "AABB") {
                    return checkBox(this, targetCollider)
                } else if (typeB == "Circle") {
                    return checkAABBandCircle(this, targetCollider)
                }
            } else if (typeA == "Circle") {
                if (typeB == "AABB") {
                    return checkAABBandCircle(targetCollider, this)
                } else if (typeB == "Circle") {
                    return checkCircle(this, targetCollider)
                }
            }
            warn(10001)

        }

        fillStyle = null;
        ontouch = 0

        move(x, y) {
            this.x = x
            this.y = y
            this.type.stay++
        }

    }
    class AABB extends Collider {
        constructor (x, y, width, height) {
            super(x, y)
            this.width = width
            this.height = height
            this.ColliderType = "AABB"
        }
        width = 0
        height = 0
    }
    class Circle extends Collider {
        constructor (x, y, radius) {
            super(x, y)
            this.radius = radius
            this.ColliderType = "Circle"
        }
        radius = 0
    }
    /*
    class Collider {
        constructor (x, y, width, height) {
            Colliders.push(this)
            this.id = getID()
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            log(this)
        }
        x = 0
        y = 0
        width = 0
        height = 0
        id = null
        touch = []
        type = {
            static: false,
            stay: 1,
            //静止后1帧内不再运动设为静态

        }
        isTouching(targetCollider) {
            return checkBox(this, targetCollider)
        }
        fillStyle = null;
        ontouch = 0
        move(x, y) {
            this.x = x
            this.y = y
            this.type.stay++
        }
    }
        */
    function createColliderAABB() {
        return new AABB(random(100, 500), random(100, 500), random(10, 100), random(10, 100))
    }
    createAABB = function (x, y, width, height) {
        return new AABB(x, y, width, height)
    }
    function createColiderCircle() {
        return new Circle(random(100, 500), random(100, 500), random(10, 100))
    }
    createCircle = function (x, y, radius) {
        return new Circle(x, y, radius)

    }

    //测试
    for (let i = 0; i < testNumber; i++) {
        createColliderAABB()
        createColiderCircle()

    }





    //判断碰撞
    var colliderF = function () {

        var dynamic = []
        //动态
        var static = []
        //静态
        //var canSelect = []

        Colliders.forEach(value => {
            if (value.type.stay <= 0) {
                value.type.static = true
            } else {
                value.type.stay -= 1
                value.type.static = false
            }
            if (value.type.static == true) {
                static.push(value)
            } else {
                dynamic.push(value)
            }
        })
        //改成for循环
        Colliders.forEach(v => {
            v.done = [v.id]
            //不和自身碰撞
        })
        Colliders.forEach(v => {
            //先和之前碰撞的碰撞
            var v_touch = v.touch
            v.touch = []
            for (let i = 0; i < v_touch.length; i++) {
                var v2 = v_touch[i]
                if (v.done.includes(v2.id)) {
                    //跳过
                    continue
                }
                v.done.push(v2.id)
                //v2.done.push(v.id)
                if (v.isTouching(v2)) {
                    v.ontouch++
                    //v2.ontouch ++
                    v.touch.push(v2)
                }
            }

            //再和动态碰撞
            for (let i = 0; i < dynamic.length; i++) {
                var v2 = dynamic[i]
                if (v.done.includes(v2.id)) {
                    //跳过
                    continue
                }
                v.done.push(v2.id)
                //v2.done.push(v.id)
                if (v.isTouching(v2)) {
                    v.ontouch++
                    //v2.ontouch ++
                    v.touch.push(v2)
                    //v2.touch.push(v)
                }
            }

        })
        //动态和静态碰撞
        dynamic.forEach(v => {
            for (let i = 0; i < static.length; i++) {
                var v2 = static[i]
                if (v.done.includes(v2.id)) {
                    //跳过
                    continue
                }
                v.done.push(v2.id)
                //v2.done.push(v.id)
                if (v.isTouching(v2)) {
                    v.ontouch++
                    //v2.ontouch ++
                    v.touch.push(v2)
                    //v2.touch.push(v)
                }
            }
        })






        /*
        Colliders.forEach(v => {
            for(let i = 0; i < Colliders.length; i++){
                var v2 = Colliders[i]
                //第二个物体
                if(v.done.includes(v2.id)){
                    //跳过
                }else{
                    v.done.push(v2.id)
                    v2.done.push(v.id)

                    if(v.isTouching(v2)){
                        v.ontouch ++
                        v2.ontouch ++
                        v.touch.push(v2)
                        v2.touch.push(v)
                    }
                }
            }
            
        })
        */




        Colliders.forEach(v => {
            // if (v.ontouch > 0) {
            //     v.fillStyle = "orange"
            //     var r = v.ontouch == 1 ? 255 : 128
            //     var g = v.ontouch == 2 ? 255 : 128
            //     var b = v.ontouch >= 3 ? 255 : 128
            //     v.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
            //     v.ontouch = 0
            //     //接触个数
            // } else {
            //     v.fillStyle = "blue"
            // }
            v.fillStyle = v.ontouch == 1 ? "yellow" : v.ontouch == 2 ? "pink" : v.ontouch >= 3 ? "purple" : "blue"
            v.ontouch = 0
            //接触个数
        })
        //随机移动
        var randomMove = function () {
            Colliders.forEach(v => {
                v.move(v.x + random(-4, 5), v.y + random(-4, 5), v.width + random(-4, 5), v.height + random(-4, 5))
            })
        }
        //randomMove()

    }
    var IntervalTimer = 1000 / 60
    //IntervalTimer = 100
    var stop = false
    // setInterval(function(){
    //     log(777)
    // },1000)
    setInterval(function () {
        //log(333)
        if (stop === false) {
            colliderF()
        } else if (stop === true) {
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }


        canvas.width = canvas.width
        //清空画布

        //绘制图形
        Colliders.forEach(value => {
            switch (value.ColliderType) {
                case "AABB":
                    ctx.beginPath()
                    ctx.fillStyle = value.fillStyle || "orange"
                    ctx.fillRect(value.x, value.y, value.width, value.height)

                    break;
                case "Circle":
                    ctx.beginPath()
                    ctx.fillStyle = value.fillStyle || "orange"
                    ctx.strokeStyle = value.strokeStyle || value.fillStyle || "orange"
                    ctx.arc(value.x, value.y, value.radius, 0, 2 * Math.PI)
                    ctx.fill()
                    ctx.stroke()
                    //https://blog.csdn.net/Jacgu/article/details/106378627
                    //canvas画圆
                    break;
            }

        })
    }, IntervalTimer)


})();

//鼠标键盘
(function () {
    var mouseState = {
        currentState: null,
        currentFunctionName: null,
        //显示目前函数功能 （列表）
        selectTarget: null,
    }
    document, addEventListener("click", function (e) {
        log(e)
        mouseState.currentState = "click"
    })
    var mousedownEvent
    document.addEventListener("mousedown", function (e) {
        //选择盒子移动
        log(e)
        //log(e.pageX, e.pageY)
        if (e.target.id == "canvas") {
            //鼠标按下位置在canvas内
            mouseState.currentState = "mousedown"
            let left = e.target.offsetLeft
            let top = e.target.offsetTop
            let obj = {
                x: e.pageX - left,
                y: e.pageY - top,
                width: 1,
                height: 1,
                radius: 1,
                left: left,
                top: top
            }
            //obj.name = "鼠标"
            mousedownEvent = obj
            var list = []

            myObject.Colliders.forEach(v => {
                let istouch = false
                switch (v.ColliderType) {
                    case "AABB":
                        //点击面积大小不确定 默认1 不计算宽高
                        if (v.x < obj.x && v.x + v.width > obj.x && v.y < obj.y && v.y + v.height > obj.y) {
                            istouch = true
                        }
                        break;

                    case "Circle":
                        if (Math.pow(v.radius + obj.radius, 2) > Math.pow(v.x - obj.x, 2) + Math.pow(v.y - obj.y, 2)) {
                            istouch = true
                        }
                        break;
                }
                if (istouch === true) {
                    log(v)
                    log(obj)
                    //v.type.stay ++
                    list.push(v)
                    v.fillStyle = "green"
                }
            })
            log(list)
            if (list[0]) {
                mouseState.selectTarget = list[0]
                log(mouseState)
            }
        } else {
            return
        }


    })
    var mousemoveEvent = null
    document.addEventListener("mousemove", function (e) {
        //log(e)
        mouseState.currentState = "mousemove"
        let down = mousedownEvent
        if (mouseState.selectTarget) {
            let left
            let top
            if (mousemoveEvent == null) {
                left = down.x - mouseState.selectTarget.x
                top = down.y - mouseState.selectTarget.y
                mousemoveEvent = {
                    left: left,
                    top: top
                }
            } else {
                left = mousemoveEvent?.left
                top = mousemoveEvent?.top
            }
            mouseState.selectTarget.move(e.pageX - down.left - left, e.pageY - down.top - top)
            //mouseState.selectTarget.type.stay ++
            mouseState.selectTarget.ontouch = 0
        }
    })
    document.addEventListener("mouseup", function (e) {
        log(e)
        mouseState.currentState = "mouseup"
        mouseState.selectTarget = null
        mousedownEvent = null
        mousemoveEvent = null
    })
    //鼠标相关函数
    //https://blog.csdn.net/qq_26722321/article/details/111190415
    //有限状态机 阮一峰
    //https://www.ruanyifeng.com/blog/2013/09/finite-state_machine_for_javascript.html
})();

document.addEventListener('keydown', function (e) {
    var event = e || window.event
    console.log(event)
}, false)
try {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        console.log("PE")
    } else {
        console.log("PC")
        var jsonObj = {}
        var keyboard = {
            "w": 87,
            "a": 65,
            "s": 83,
            "d": 68
        }
        //鼠标滚轮 
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case keyboard["w"]:
                    break;
                case keyboard["a"]:
                    break;
                case keyboard["s"]:
                    break;
                case keyboard["d"]:
                    break;
            }
        })
    }
} catch (e) { }