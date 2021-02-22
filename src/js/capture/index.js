import React, {Component} from 'react';
import Capture from './capture';

export default class Index extends Component {

  constructor() {
    super();
    this.state = {
      capture_status: false,
    };
  }

  componentWillMount() {
    let _this = this;
    let capture_status = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let tab = tabs[0];
      let url = tab.url;
      let page = url.split('?')[1]
      if(page.includes("capture")) {
        capture_status = true;
      }
      _this.setState({
        capture_status: capture_status,
      });
    });
  }

  render() {
    return (
      <div className="capture-index">
        <Capture visible={this.state.capture_status} />
      </div>
    )
  }
}
