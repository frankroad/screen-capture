require('./../../css/popup.less');
import React, {Component} from 'react';
import ToolIndex from './toolIndex';

export default class Index extends Component {

  constructor() {
    super();
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="popup">
        <ToolIndex visible={true} />
      </div>
    )
  }
}
