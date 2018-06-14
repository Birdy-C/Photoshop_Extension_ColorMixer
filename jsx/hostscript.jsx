// Birdy 18.6.12
// some events we are interested in
var eventMake = 1298866208;   // "Mk  "
var eventDelete = 1147958304; // "Dlt "
var eventClose = 1131180832;  // "Cls "
var eventSelect = 1936483188; // "slct" 
var eventSet = 1936028772;    // "setd" 


var worklayer; 
// Init Set for dispatch
try {
    var loadSuccess = new ExternalObject("lib:\PlugPlugExternalObject"); //载入所需对象，loadSuccess 记录是否成功载入
} catch (e) {
    alert(e);// 如果载入失败，输出错误信息
}


function addNewColor(inColor) {
    // 新建图层
    //var myLayer = active
    try {
        var layerRef = app.activeDocument.artLayers.add();
        layerRef.name = "ColorMixer";
        var layerRefMask = app.activeDocument.artLayers.add();
        layerRefMask.name = "CM mask";
        // layerRefMask.blendMode = BlendMode.NORMAL; // auto

        worklayer.move(layerRef, ElementPlacement.PLACEBEFORE);
        worklayer.move(layerRefMask, ElementPlacement.PLACEBEFORE);

        app.activeDocument.selection.selectAll;
        layerRefMask.grouped = true;

        var colorRef = new SolidColor;
        colorRef.rgb.hexValue = inColor;
        app.activeDocument.selection.fill(colorRef);


        alert("create");
    } catch (e) {
        alert(e);
    }

}



function changChoosedColor() {
    // 先把工作图层的内容合到前几个图层之内
    // 把所有图层被绘制涉及到的部分清空


    //接着合并到其他的图层里


    //清空工作图层


    //修改工作图层的颜色

}

function unwanttedOperation() {
    alert("Warning: Unwanted Treatment Towards The Layer Preserved For ColorMixer May Course ERROR!");
}




function getForgroudColor() {
    //alert(loadSuccess);
    try {
        if (loadSuccess) {
            var eventJAX = new CSXSEvent();                     //创建事件对象
            eventJAX.type = "com.HCI.ColorMixer.colorsys";      //设定一个类型名称
            eventJAX.data = app.foregroundColor.rgb.hexValue;   // 事件要传递的信息
            eventJAX.dispatch();                                // GO ! 发送事件
            //alert("Already Diapatch")
        }
        else {
            alert("Unable to Synchronize Color")
        }
    } catch (e) {
        alert(e);// 如果载入失败，输出错误信息
    }

    return app.foregroundColor;
}



// =============================================================
// Function For Output

function LogIt(inMessage) {
    try {
        var a = new Logger();
        var b = decodeURIComponent(inMessage);
        //a.log(b + "\n");
        a.showalert(b);
    }
    catch (e) {
        alert("LogIt catch : " + e + ":" + e.line);
    }
}

///////////////////////////////////////////////////////////////////////////////
// Object: Logger
// Usage: Log information to a text file
// Input: String to full path of file to create or append, if no file is given
//        then output file Logger.log is created on the users desktop
// Return: Logger object
// Example:
//
//   var a = new Logger();
//   a.print( 'hello' );
//   a.print( 'hello2\n\n\nHi\n' ) ;
//   a.remove();
//   a.log( Date() );
//   a.print( Date() );
//   a.display();
//
///////////////////////////////////////////////////////////////////////////////

function Logger(inFile) {

    // member properties

    // the file we are currently logging to
    if (undefined == inFile) {
        this.file = new File(Folder.desktop + "/PhotoshopEvents.log");
    } else {
        this.file = new File(inFile);
    }

    // member methods

    // output to the ESTK console
    // note that it behaves a bit differently 
    // when using the BridgeTalk section
    this.print = function (inMessage) {
        if (app.name == "ExtendScript Toolkit") {
            print(inMessage);
        } else {
            var btMessage = new BridgeTalk();
            btMessage.target = "estoolkit";
            btMessage.body = "print(" + inMessage.toSource() + ")";
            btMessage.send();
        }
    }

    // write out a message to the log file
    this.log = function (inMessage) {
        if (this.file.exists) {
            this.file.open('e');
            this.file.seek(0, 2); // end of file
        } else {
            this.file.open('w');
        }
        this.file.write(inMessage);
        this.file.close();
    }

    // show the contents with the execute method
    this.display = function () {
        this.file.execute();
    }

    // remove the file
    this.remove = function () {
        this.file.remove();
    }

    this.showalert = function (inMessage) {
        alert(inMessage);    
    }
}


function init() {
    worklayer = app.activeDocument.artLayers.add();
    worklayer.name = "CM Workspace";
    //getForgroudColor();
}

init();

// end ps.jsx
