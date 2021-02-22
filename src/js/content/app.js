import capture from './capture/entire/app';

(function () {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
      case "capture-entire-scroll-start":
        capture.scrollStart(sendResponse);
        break;
      case "capture-entire-scroll":
        capture.scroll(sendResponse);
        break;
    }
  });
})();
