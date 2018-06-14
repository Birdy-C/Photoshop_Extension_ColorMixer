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



// ============= Register Events =============
var gRegisteredEvents = [eventMake, eventDelete, eventClose, eventSelect, eventSet];

// all callbacks need to be unique so only your panel gets them
// for Photoshop specific add on the id of your extension
csInterface.addEventListener("com.adobe.PhotoshopJSONCallback" + gExtensionID, PSCallbackEvent);
csInterface.addEventListener("com.HCI.ColorMixer.colorsys", ColorSychronizeCallbackEvent);

// ============= UI items =============
// create new layer
//
var xAxis = window.document.getElementById("xAxis");
var yAxis = window.document.getElementById("yAxis");
var radius = window.document.getElementById("radius");
var CreateColor = window.document.getElementById("CreateColor");

var forgroundColor = "FFFFFF";

//============= Place for Recording =============
var RecordedBall = new Array();     // record the color ball
var selectedColor = new Array();    // record the percent of each selected ball
var usedColor = new Array();        // record used Color
var selectedBall;                   // record the ball being choosen
var numOfSettedBall = 0;
var numOfAllBall = 0;


function Point(Color, x, y, radius) {
    this.color = Color;
    //this.MainlayerID = MainlayerID;
    //this.MasklayerID = MasklayerID;   
    this.MainlayerID;
    this.MasklayerID;
    this.x = x;
    this.y = y;
    this.radius = radius;
}

// ============= Synchronize the color =============
function CreateNewLayer() {
    console.log("Create");
    //TODO
    numOfAllBall++;
    csInterface.evalScript("addNewColor('" + forgroundColor + "')");//who could tell me why the lack of ' makes such a strange error!!
}


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
    CreateColor.style.backgroundColor = '#' + csEvent.data;
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
    csInterface.evalScript("ChangeSelectedColor()");
}


// ==================================================================
//
// ==================================================================

// register events
// Tell Photoshop the events we want to listen for
function Register(inOn, inEvents) {
    gStartDate = new Date();
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
        });

        Register(true, gRegisteredEvents.toString());
    } catch (e) {
        JSLogIt("InitializeCallback catch: " + e);
    }

    csInterface.evalScript("getForgroudColor()");

}

init();

