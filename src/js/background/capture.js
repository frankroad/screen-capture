module.exports = (()  => {

  function capture(callback) {
    chrome.tabs.captureVisibleTab(null, {format: 'png', quality: 100}, callback);
  }

  function pageCapture(tab) {
    chrome.tabs.sendMessage(tab.id, {type: "capture-entire-scroll-start"}, function(response) {
      let canvas = document.createElement('canvas');
      let data = response.data;
      let ratio = data.ratio;
      let visibleWidth = data.visibleWidth;
      let visibleHeight = data.visibleHeight;
      canvas.width = visibleWidth * ratio;
      canvas.height = (data.finishScrollHeight + visibleHeight) * ratio;
      let context = canvas.getContext('2d');
      setTimeout(() => {
        capture(function(dataURI) {
          let img = new Image();
          img.src = dataURI;
          img.onload = () => {
            context.drawImage(img, 0, 0, visibleWidth * ratio, visibleHeight * ratio)
            captureing(tab, data, canvas, context)
          }
        });
      }, 20);
    });
  }

  function captureing(tab, data, canvas, context) {
    let ratio = data.ratio;
    let visibleWidth = data.visibleWidth;
    let visibleHeight = data.visibleHeight;
    let currentScrollTop = data.currentScrollTop;
    let finishScrollHeight = data.finishScrollHeight;
    let img = new Image();
    if (currentScrollTop < finishScrollHeight - visibleHeight) {
      chrome.tabs.sendMessage(tab.id, {type: "capture-entire-scroll"}, function(response) {
        setTimeout(() => {
          capture(function(dataURI) {
            img.src = dataURI;
            img.onload = () => {
              context.drawImage(img, 0, (currentScrollTop + visibleHeight) * ratio, visibleWidth * ratio, visibleHeight * ratio)
              captureing(tab, response.data, canvas, context);
            }
          });
        }, 100);
      });
    } else {
      chrome.tabs.sendMessage(tab.id, {type: "capture-entire-scroll"}, function(response) {
        setTimeout(() => {
          capture(function(dataURI) {
            img.src = dataURI;
            img.onload = () => {
              let wholeHeight = finishScrollHeight + visibleHeight;
              let width = visibleWidth * ratio;
              let counter = Math.floor(wholeHeight / visibleHeight);
              let height = (wholeHeight - counter * visibleHeight) * ratio;
              context.drawImage(img, 0, img.height - height, width, height, 0, (currentScrollTop + visibleHeight) * ratio, width, height)
              let background = chrome.extension.getBackgroundPage();
              background.data = canvas.toDataURL();
              let url = "/capture.html?capture_entire";
              chrome.tabs.create({url: url});
            }
          });
        }, 100);
      });
    }
  }

  function selectCapture(data) {
    let ratio = data.ratio;
    let left = data.left * ratio;
    let top = data.top * ratio;
    let width = data.width * ratio;
    let height = data.height * ratio;
    if (width === 0 || height === 0) {
      return true;
    }
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let img = new Image();
    capture(function(dataURI) {
      img.src = dataURI;
      img.onload = () => {
        let context = canvas.getContext('2d');
        context.drawImage(img, left, top, width, height, 0, 0, width, height)
        let background = chrome.extension.getBackgroundPage();
        background.data = canvas.toDataURL();
        let url = "/capture.html?capture_select";
        chrome.tabs.create({url: url});
      }
    });
  }

  return {
    capture: capture,
    pageCapture: pageCapture,
    selectCapture: selectCapture
  };
})();
