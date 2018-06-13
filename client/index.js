/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();

/* 2) Make a reference to your HTML button and add a click handler. */
var openButton = document.querySelector("#open-button");
openButton.addEventListener("click", openDoc);// event from the HTML

/* 3) Write a helper function to pass instructions to the ExtendScript side. */
function openDoc() {
  csInterface.evalScript("openDocument()");
}


/* Get the frontground Color */
var ColorPicker = document.querySelector("#html5colorpicker");
//openButton.addEventListener("click", openDoc);
var idmodalStateChanged = stringIDToTypeID("modalStateChanged");// event From the Ps

function ColorChanged() {
    csInterface.evalScript("openDocument()");

}