var domainInput = document.getElementById("domainInput");
var buttonGenerate = document.getElementById("buttonGenerate");
buttonGenerate.addEventListener("click", handleButtonClick);

function handleButtonClick(event) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(`tabs: ${tabs}`)
    chrome.tabs.sendMessage(tabs[0].id, {msg: domainInput.value}, function(response) {
      console.log(response);
    });
  });
}