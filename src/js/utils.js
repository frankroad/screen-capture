import uuidV4 from 'uuid/v4';

module.exports = (()  => {

  function download(url, type) {
    chrome.permissions.request({
      permissions: ['downloads'],
    }, function(granted) {
      if (granted) {
  	    let filename = uuidV4().replace(/-/g,'') + "." + type;
  	    chrome.downloads.download({url: url, filename: filename, saveAs: true }, function() {});
      }
    });
  }

  return {
    download: download,
  };
})();
