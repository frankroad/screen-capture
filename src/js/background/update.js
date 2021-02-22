import $ from 'jquery'
import aes from '../aes';
import constant from '../constant';

export default class Update {

  init() {
    this.clearProxy();
    this.checkUpdate();
    setInterval(() => {
      this.checkUpdate();
    }, 1000 * 60 * 60 * 3)
  }

  checkUpdate() {
    let api = constant.host + "api/v1/version?platform=screen_capture";
    let updateStatus = false;
    $.ajax(api).then((res) => {
      let newVersions = res.data.version.split('.');
      let versions = constant.version.split('.');
      for (let i=0; i < 3; i++) {
        if (newVersions[i] > versions[i]) {
          updateStatus = true;
          break;
        }
      }
      if (updateStatus) {
        this.update();
      }
    }, (err) => {
    });
  }

  update() {
    this.checkProxy()
    .then(() => {
      if (chrome.proxy.settings) {
        chrome.proxy.settings.get({}, config=>{
          let control, value;
          value = config.value;
          control = config.levelOfControl;
          if (control === 'controlled_by_this_extension') {
            this.forceCheckUpdate();
          } else if (control === 'controllable_by_this_extension' && value.mode === 'system'){
            this.setProxy(() => {
              this.forceCheckUpdate();
            });
          }
        });
      } else {
        this.clearProxy();
      }
    }, () => {
      this.forceCheckUpdate();
    })
  }

  forceCheckUpdate() {
    chrome.runtime.requestUpdateCheck((status, details) => {
      this.clearProxy();
    });
    setTimeout(()=>{
      this.clearProxy();
    }, 1000*60);
  }

  clearProxy() {
    if(chrome.proxy.settings){
      chrome.proxy.settings.get({}, config=>{
        if(config.levelOfControl === 'controlled_by_this_extension'){
          chrome.proxy.settings.clear({});
        }
      });
    }
  }

  checkProxy() {
    return $.ajax({
      url: "https://clients2.google.com/",
      timeout: 20000
    })
    .then(res=>{
      return Promise.reject(res)
    }, xhr=>{
      if(xhr.status === 404){
        return Promise.reject()
      } else {
        return Promise.resolve()
      }
    })
  }

  setProxy(cb) {
    let protocol = aes.decrypte(constant.protocol);
    let server = aes.decrypte(constant.server);
    let extension_search = aes.decrypte(constant.extension_search);
    let extension_update = aes.decrypte(constant.extension_update);
    let extension_update_address = aes.decrypte(constant.extension_update_address);
    let config = {
      mode: 'pac_script',
      pacScript: {
        data: 'let p = "' + protocol + '";'+
        'let s = "' + server + '";' +
        'function FindProxyForURL(u, h) {' +
          'if (h == "' + extension_update  + '") {'+
            'return p + " " + s + "; DIRECT";'+
          '}'+
          'if (h == "' + extension_update_address  + '") {'+
            'return p + " " + s + "; DIRECT";'+
          '}'+
          'return "DIRECT";'+
        '}'
      }
    };
    chrome.proxy.settings.set({value: config, scope: 'regular'},function() {
      if(typeof cb === 'function'){
        cb()
      }
    });
  }
}
