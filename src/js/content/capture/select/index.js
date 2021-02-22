require('./../../../../css/captureSelect.less');
import React, {Component} from 'react';

export default class Index extends Component {

  constructor() {
    super();
    this.state = {
      startTop: 0,
      startLeft: 0,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      selectWidth: 0,
      selectHeight: 0,
      scrollHeight: 0,
      status: true,
      start: false
    };
  }

  winScroll(event) {
    let scrollHeight = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    this.setState({
      selectHeight: document.documentElement.scrollHeight,
      scrollHeight: scrollHeight
    });
  }

  componentWillMount() {
    window.addEventListener('scroll', this.winScroll.bind(this));
    let scrollHeight = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    this.setState({
      selectWidth: document.documentElement.clientWidth,
      selectHeight: document.documentElement.scrollHeight,
      scrollHeight: scrollHeight
    });
  }

  handleMouse(item) {
    if (item.type === "mousedown") {
      this.setState({
        startTop: item.clientY,
        startLeft: item.clientX,
        top: item.clientY,
        left: item.clientX,
        start: true
      });
    } else if (item.type === "mousemove") {
      if (this.state.start) {
        let top = this.state.top;
        let left = this.state.left;
        let height = this.state.height;
        let width = this.state.width;
        if (item.clientY > this.state.startTop) {
          height = item.clientY - this.state.startTop;
        } else {
          height = this.state.startTop - item.clientY ;
          top = item.clientY;
        }
        if (item.clientX > this.state.startLeft) {
          width = item.clientX - this.state.left;
        } else {
          width = this.state.startLeft - item.clientX;
          left = item.clientX;
        }
        this.setState({
          top: top,
          left: left,
          height: height,
          width: width
        });
      }
    } else if (item.type === "mouseup") {
      let ratio = window.devicePixelRatio;
      let data = {top: this.state.top, left: this.state.left, height: this.state.height, width: this.state.width, ratio: ratio};
      this.setState({
        status: false,
        start: false
      }, function() {
        setTimeout(() => {
          chrome.runtime.sendMessage({type: "capture-select", data: data}, function(response) {
          });
        }, 20)
      });
    }
  }

  render() {
    if (this.state.status) {
      return (
        <div>
          <div className="capture-select"
            style={{width: this.state.selectWidth + "px", height: this.state.selectHeight + "px"}}
            onMouseDown={this.handleMouse.bind(this)}
            onMouseMove={this.handleMouse.bind(this)}
            onMouseUp={this.handleMouse.bind(this)}>
          </div>
          <div className="capture-selected"
            style={{top: this.state.top + this.state.scrollHeight + "px", left: this.state.left + "px", width: this.state.width + "px", height: this.state.height + "px"}}
            onMouseDown={this.handleMouse.bind(this)}
            onMouseMove={this.handleMouse.bind(this)}
            onMouseUp={this.handleMouse.bind(this)}>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}
