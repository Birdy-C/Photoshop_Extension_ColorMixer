/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
// Birdy 18.6.12


var csInterface = new CSInterface();
var gExtensionID = csInterface.getExtensionID();

// some events we are interested in
var eventMake = 1298866208;     // "Mk  "
var eventDelete = 1147958304;   // "Dlt " 
var eventClose = 1131180832;    // "Cls " 
var eventSelect = 1936483188;   // "slct" 
var eventSet = 1936028772;      // "setd" 

//  Register Events 
var gRegisteredEvents = [eventMake, eventDelete, eventClose, eventSelect, eventSet];

// all callbacks need to be unique so only your panel gets them
// for Photoshop specific add on the id of your extension
csInterface.addEventListener("com.adobe.PhotoshopJSONCallback" + gExtensionID, PSCallbackEvent);
csInterface.addEventListener("com.HCI.ColorMixer.colorsys", ColorSychronizeCallbackEvent);

//  UI items 
// create new layer
//
var UIxAxis = window.document.getElementById("xAxis");
var UIyAxis = window.document.getElementById("yAxis");
var UIradius = window.document.getElementById("radius");
var UICreateColor = window.document.getElementById("CreateColor");
var UICanvas = window.document.getElementById("maincanvas");
var UICanvasContext = window.document.getElementById("maincanvas").getContext("2d");
//console.log(UICanvas);
//console.log(UICanvasContext);
var forgroundColor = "FFFFFF";
var canvasColor = "#FFFFFF"
// Place for Recording 
var RecordedBlob = new Array();     // record the color ball
var ColorPercent = new Array();    // record the percent of each selected ball  within [0,100]
//var usedColor = new Array();       // record used Color
var selectedBlob = -1;               // record the index of ball being choosen

// Place for parameter
//MARK  may need slighty change it for a bettr effect
var falloff = 5;
var Threshold = 0.1;



function Blob(Color, x, y, radius) {
    this.color = Color;
    this.center = new Point(x, y);
    this.radius = radius;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Color(init)
{
    this.red = init;
    this.green = init;
    this.blue = init;

    this.ColorToHexString = function () {
        var s = "";
        try {
            s += this.red.toString(16);
            s += this.green.toString(16);
            s += this.blue.toString(16);
        } catch (e) {
            s = e.toString();
        }
        return s;
    }

    this.add = function(newcolor, per) {
        this.red += newcolor.red * per;
        this.green += newcolor.green * per;
        this.blue += newcolor.blue * per;    
    }

    this.divid = function(per){
        this.red /= per;
        this.green /= per;
        this.blue /= per;
 
    }

}

// ============= Synchronize the color =============
function CreateNewLayer() {
    console.log("Create");
    //TODO
    //numOfAllBlob++;
    csInterface.evalScript("addNewColor('" + forgroundColor + "')");//who could tell me why the lack of ' makes such a strange error!!
}

// TODO no use
function CreateNewLayerSetIDCallbackEvent() {
    console.log("Create");
    //WARNING wander whether synchronize will meet error

    //csInterface.evalScript("CreateNewLayer('" + +")'");
}


// Synchronize the color 
function ColorSychronizeCallbackEvent(csEvent)
{
    //TODO
    console.log("ColorSychronizeCallbackEvent");
    console.log(csEvent);
    UICreateColor.style.backgroundColor = '#' + csEvent.data;
    forgroundColor = csEvent.data;
}


// Handle the Event got From PS
function PSCallbackEvent(csEvent) {
    // TODO .. More detailed treatment
    console.log("PSCallbackEvent");
    try {
        if (typeof csEvent.data === "string") {
            var eventData = csEvent.data.replace("ver1,{", "{");
            var eventDataParse = JSON.parse(eventData);
            var jsonStringBack = JSON.stringify(eventDataParse);
            //SetResultLabel("PhotoshopCallbackUnique: " + jsonStringBack);

            JSLogIt("PSCallbackEvent: " + jsonStringBack);  // Output

            // Synchronize the color
            // TODO select the information
            csInterface.evalScript("getForgroudColor()");
        } else {
            JSLogIt("PhotoshopCallbackUnique expecting string for csEvent.data!");
        }
    } catch (e) {
        JSLogIt("PhotoshopCallbackUnique catch:" + e);
    }
}

// ============= Choose the color =============
function ChangeSelectedColor() {
    console.log("ChangeSelectedColor");



    csInterface.evalScript("ChangeSelectedColor('" + ColorPercent + "')");
    
}

function redrawCanvas() {
    console.log("redrawCanvas");
    height = UICanvas.getAttribute("height");
    width = UICanvas.getAttribute("width");
    console.log(RecordedBlob.length);

    var data = UICanvasContext.createImageData(width, height);
    for (var x = 0; x < data.width; x++) {
        for (var y = 0; y < data.height; y++) {
            var point = new Point();
            point.x = x;
            point.y = y;
            var getcolor = calPercentage(point, false);
            //console.log(getcolor);

            var index = (y * data.width + x) * 4;  //calculate index
            data.data[index] = getcolor.red;   // red
            data.data[index + 1] = getcolor.green; // green
            data.data[index + 2] = getcolor.blue; // blue
            data.data[index + 3] = 255; // force alpha to 100%
        }
    }
    //set the data back
    UICanvasContext.putImageData(data, 0, 0);
}


// ==================================================================
// 功能函数
// ==================================================================
function distance2(pointA, pointB)
{
    return Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2);
}

function Percentage(pointA, pointB, r) {
    var temp = distance2(pointA, pointB) / Math.pow(r + falloff, 2);
    if (temp > 1) {
        return 0;
    }
    else {
        return 1 - 4 / 9 * Math.pow(temp, 3) + 17 / 9 * Math.pow(temp, 2) - 22 / 9 * temp;
    } 
}

function calPercentage(point, set) {
    var ColorPercentTemp = new Array();
    var i;
    var sum = 0;
    colortmp = new Color(0);

    for (i = 0; i < RecordedBlob.length; i++) {
        ColorPercentTemp[i] = Percentage(point, RecordedBlob[i].center, RecordedBlob[i].radius);
        sum += ColorPercentTemp[i];
        colortmp.add(RecordedBlob[i].color, ColorPercentTemp[i]);
    }

    if (sum < Threshold) {
        var colorred = new Color(255);
        colorred.blue = 0;
        return colorred;
    }
    colortmp.divid(sum);
    return colortmp;

}


// register events
// Tell Photoshop the events we want to listen for
function Register(inOn, inEvents) {
    // gStartDate = new Date();
    var event;
    if (inOn) {
        event = new CSEvent("com.adobe.PhotoshopRegisterEvent", "APPLICATION");
    } else {
        event = new CSEvent("com.adobe.PhotoshopUnRegisterEvent", "APPLICATION");
    }
    event.extensionId = gExtensionID;
    event.data = inEvents;
    csInterface.dispatchEvent(event);
    console.log("Register:" + inOn);
}


// For output
function JSLogIt(inMessage) {
    console.log("Log " + inMessage);
    //csInterface.evalScript("LogIt('" + inMessage + "')");
}


function init() {
    // 初始化界面
    themeManager.init();

    try {
        $("#btn_create").click(function () {
            CreateNewLayer();
        });

        $("#btn_change").click(function () {
            ChangeSelectedColor();
            //redrawCanvas();
        });
        $("#maincanvas").click(function () {
            //ChangeSelectedColor();
            redrawCanvas();
            //drawtest();

        });
        Register(true, gRegisteredEvents.toString());
    } catch (e) {
        JSLogIt("InitializeCallback catch: " + e);
    }

    csInterface.evalScript("getForgroudColor()");

    // Test
    newblob = new Blob(new Color(150), 100, 50, 70);
    console.log(newblob);
    RecordedBlob.push(newblob);
    
    newblob = new Blob(new Color(40), 100, 150, 50);
    RecordedBlob.push(newblob);
}

init();

