import $ from 'jquery'
import Update from './update';
import capture from './capture';

(function () {

  let update = new Update();
  update.init();

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      switch (request.type) {
        case "capture":
          capture.capture((dataURI) => {
            sendResponse(dataURI);
          });
          break;
        case "capture-select":
          capture.selectCapture(request.data);
          break;
        case "capture-entire-start":
          capture.pageCapture(request.data);
          break;
      }
      return true;
    }
  );

})();
