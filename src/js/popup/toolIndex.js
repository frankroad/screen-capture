import React, {Component} from 'react';

export default class ToolIndex extends Component {

  constructor() {
    super();
  }

  componentWillMount() {
  }

  checkUrl(url) {
    return url.startsWith("http") && !url.startsWith("https://chrome.google.com")
  }

  handleCaptureClick(item) {
    let _this = this;
    if (item === "capture_entire") {
      chrome.tabs.query({active: true}, function(tabs) {
        let tab = tabs[0];
        if (_this.checkUrl(tab.url)) {
          chrome.tabs.insertCSS(tab.id, {file: 'css/capture_select_content.css', runAt: 'document_start'})
          chrome.runtime.sendMessage({type: "capture-entire-start", data: tab}, function(response) {
          });
        }
      });
      window.close();
    } else if (item === "capture_visible") {
      chrome.tabs.query({active: true}, function(tabs) {
        let tab = tabs[0];
        if (_this.checkUrl(tab.url)) {
          chrome.tabs.insertCSS(tab.id, {file: 'css/capture_select_content.css', runAt: 'document_start'})
          setTimeout(() => {
            chrome.runtime.sendMessage({type: "capture"}, function(dataURI) {
              let background = chrome.extension.getBackgroundPage();
              background.data = dataURI;
              let url = "/capture.html?" + item;
              chrome.tabs.create({url: url});
            });
          }, 20);
        } else {
          window.close();
        }
      });
    } else if (item === "capture_select") {
      chrome.tabs.query({active: true}, function(tabs) {
        let tab = tabs[0];
        if (_this.checkUrl(tab.url)) {
          chrome.tabs.insertCSS(tab.id, {file: 'css/capture_select_content.css', runAt: 'document_start'})
          chrome.tabs.executeScript(tab.id, {file: 'js/init.js', runAt: 'document_start'});
          chrome.tabs.executeScript(tab.id, {file: 'js/capture_select_content.js', runAt: 'document_start'});
        }
      });
      window.close();
    }
  }

  handleTabClick(url) {
    chrome.tabs.create({url: url});
  }

  render() {
    if (this.props.visible) {
      return (
        <div className="tool">
          <div className="items" style={{height: "90px"}}>
            <div onClick={this.handleCaptureClick.bind(this, "capture_entire")} className="item">
              <div className="info">
                <img src="./../../img/capture_entire.svg" />
                <p>全屏截图</p>
              </div>
            </div>
            <div onClick={this.handleCaptureClick.bind(this, "capture_visible")} className="item">
              <div className="info">
                <img src="./../../img/capture_visible.svg" />
                <p>可视截图</p>
              </div>
            </div>
            <div onClick={this.handleCaptureClick.bind(this, "capture_select")} className="item">
              <div className="info">
                <img src="./../../img/capture_select.svg" />
                <p>部分截图</p>
              </div>
            </div>
            <div onClick={this.handleTabClick.bind(this, "https://pictureknow.com")} className="item">
              <div className="info">
                <img src="./../../img/pictureknow.png" />
                <p>插件官网</p>
              </div>
            </div>
            <div onClick={this.handleTabClick.bind(this, "https://pictureknow.com/#/extension")} className="item">
              <div className="info">
                <img src="./../../img/navigation.svg" />
                <p>推荐插件</p>
              </div>
            </div>
            <div onClick={this.handleTabClick.bind(this, "https://chrome.google.com/webstore/detail/" + chrome.i18n.getMessage("@@extension_id"))} className="item">
              <div className="info">
                <img src="./../../img/store.png" />
                <p>商店</p>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}
