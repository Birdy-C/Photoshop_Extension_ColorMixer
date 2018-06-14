/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/


var csInterface = new CSInterface();
var gExtensionID = csInterface.getExtensionID();

var eventMake = 1298866208; // "Mk  "
var eventDelete = 1147958304; // "Dlt " 
var eventClose = 1131180832; // "Cls " 
var eventSelect = 1936483188; // "slct" 
var eventSet = 1936028772; // "setd" 

var gRegisteredEvents = [eventMake, eventDelete, eventClose, eventSelect, eventSet];

// all callbacks need to be unique so only your panel gets them
// for Photoshop specific add on the id of your extension
csInterface.addEventListener("com.adobe.PhotoshopJSONCallback" + gExtensionID, PSCallbackEvent);

function init() {

    // 初始化
    themeManager.init();

    $("#btn_test").click(function () {
        csInterface.evalScript('sayHello()');
    });


    try {    
        Register(true, gRegisteredEvents.toString());
    } catch (e) {
        JSLogIt("InitializeCallback catch: " + e);
    }

}



function PSCallbackEvent(csEvent) {
    console.log("PSCallbackEvent");
    try {
        if (typeof csEvent.data === "string") {
            var eventData = csEvent.data.replace("ver1,{", "{");
            var eventDataParse = JSON.parse(eventData);
            var jsonStringBack = JSON.stringify(eventDataParse);
            //SetResultLabel("PhotoshopCallbackUnique: " + jsonStringBack);
            JSLogIt("PSCallbackEvent: " + jsonStringBack);
            console.log("3 event");

        } else {
            JSLogIt("PhotoshopCallbackUnique expecting string for csEvent.data!");
        }
    } catch (e) {
        JSLogIt("PhotoshopCallbackUnique catch:" + e);
    }
}

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
    console.log("Log" + inMessage);
    csInterface.evalScript("LogIt('" + inMessage + "')");
}

init();

