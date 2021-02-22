require('./../../css/capture.less');
import CryptoJS from "crypto-js";
import axios from 'axios';
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import utils from '../utils';
import constant from '../constant';

export default class Capture extends Component {

  constructor() {
    super();
    this.state = {
      data: '',
      url: ""
    };
  }

  componentWillMount() {
    let _this = this;
    let background = chrome.extension.getBackgroundPage();
    let img = new Image();
    img.src = background.data;
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let width = 2880;
      let height = 2720;
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      let imgData = context.getImageData(600, 180, 1680, 2400);
      _this.get_data(imgData);
    }
  }

  get_data(imgData) {
    let canvas = document.createElement('canvas');
    canvas.width = 1680;
    canvas.height = 2400;
    let context = canvas.getContext('2d');
    context.putImageData(imgData, 0, 0);
    this.setState({
      data: canvas.toDataURL()
    });
  }

  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  handleClick() {
    let _this = this;
    let file = this.dataURLtoBlob(this.state.data);
    let form = new FormData()
    let config = {
      headers:{'Content-Type':'multipart/form-data'}
    };
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      let md5 = CryptoJS.MD5(reader.result).toString();
      form.append('file', file);
      form.append('id', md5);
      axios.post(constant.host + "api/v1/file", form, config).then((response) => {
        _this.setState({
          url: response.data.url
        })
      }).catch(function(error){;
      });
    };
  }

  render() {
    if (this.props.visible) {
      return (
        <div className="capture">
          <div className="header">
            <div className="left">
              <img src="./../../img/icon128.png" />
              <span>收藏猫</span>
            </div>
            <div className="right">
              <span onClick={this.handleClick.bind(this)} className="download"></span>
            </div>
          </div>
          <div className="content">
            <Grid>
              <Row>
                <Col lg={2}></Col>
                <Col lg={8}>
                  <input type="text" value={this.state.url} />
                  <img src={this.state.data} />
                </Col>
                <Col lg={2}></Col>
              </Row>
            </Grid>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}
