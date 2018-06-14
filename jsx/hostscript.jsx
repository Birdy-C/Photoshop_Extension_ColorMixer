/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/
// some events we are interested in
var eventMake = 1298866208;   // "Mk  "
var eventDelete = 1147958304; // "Dlt "
var eventClose = 1131180832;  // "Cls "
var eventSelect = 1936483188; // "slct" 
var eventSet = 1936028772;    // "setd" 

function sayHello(){
    //alert("hello from ExtendScript");
    var idmodalStateChanged = stringIDToTypeID("setd");
    alert(idmodalStateChanged + " 1");
}

function openDocument(){
    //var fileRef = new File("~/Downloads/myFile.jpg");
    //var docRef = app.open(fileRef);
    app.documents.add();// 新建一个文档
}


function addNewColor() {
    // https://wwwimages2.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2015.pdf 
    // P 34
    // 新建图层
    //var myLayer = active


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


var dodo = function (info) {
    alert("Debug:" + info);
}

function getForgroudColor() {
    return app.foregroundColor;
}

function PSCallbackEvent()
{
    event.data = event.data.replace("ver1,{", "{"); //去掉前缀 “ver1,”
    var esEvent = JSON.parse(event.data); //把  JSON 字符串转换成对象
    alert(esEvent.eventID + "\n" + esEvent.eventData); //使用 eventID 属性判断事件类型，eventData 为事件数据
}

// =============================================================
// Function For Output

function LogIt(inMessage) {
    try {
        var a = new Logger();
        var b = decodeURIComponent(inMessage);
        //a.log(b + "\n");
        a.show(b);
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

    this.show = function (inMessage) {
        alert(inMessage);    
    }
}

// end ps.jsx
