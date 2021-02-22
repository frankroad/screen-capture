import React from 'react';
import ReactDOM from 'react-dom';
import Index from './index';

let id = "screen-capture-d485a4649c81419389d43954591f41de";
if (!document.getElementById(id)) {
  let container = document.createElement("div");
  container.id = id;
  document.body.append(container);
}

ReactDOM.render(
  (<Index />),
  document.getElementById(id)
);
