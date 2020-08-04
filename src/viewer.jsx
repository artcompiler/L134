/* Copyright (c) 2020, Art Compiler LLC */
import {
  assert,
  message,
  messages,
  reserveCodeRange,
  decodeID,
  encodeID,
} from "./share.js";
import * as React from "react";
import * as d3 from "d3";
const FitParser = require('../node_modules/fit-file-parser/dist/fit-parser.js').default;

class Viewer extends React.Component {
  componentDidMount() {
    d3.select("#graff-view").append("div").classed("done-rendering", true);
  }

  render() {
    // If you have nested components, make sure you send the props down to the
    // owned components.
    let props = this.props;
    let obj = props.obj ? [].concat(props.obj) : [];
    let elts = [];
    obj.forEach(function (d, i) {
      let style = {};
      if (d.style) {
        Object.keys(d.style).forEach(function (k) {
          style[k] = d.style[k];
        });
      }
      let val = d.value ? d.value : d;
      if (val instanceof Array) {
        val = val.join(" ");
      } else if (typeof val !== "string" &&
                 typeof val !== "number" &&
                 typeof val !== "boolean") {
        val = JSON.stringify(val);
      }
      elts.push(<span key={i} style={style}>{val}</span>);
    });

    return (
      elts.length > 0 ? <div>
        <link rel="stylesheet" href="/L117/style.css" />
        <div className="L117">
          {elts}
          <br/> <br />
          <input id="fileupload" name="myfile" type="file" onChange={handleChange} />
        </div>
      </div> : <div/>
    );
  }
};

function parseFile(file) {
  var fitParser = new FitParser({
    force: true,
    speedUnit: 'km/h',
    lengthUnit: 'km',
    temperatureUnit: 'fahrenheit',
    elapsedRecordField: true,
    mode: 'cascade',
  });
  // Parse your file
  const content = new Uint8Array(file);
  fitParser.parse(content, function (error, data) {
    window.gcexports.dispatcher.dispatch({
      [window.gcexports.id]: {
        data: data,
        recompileCode: true,
      }
    });
  });
}

function handleChange(e) {
  const inputElement = e.target;
  const file = inputElement.files[0];
  const reader = new FileReader;
  reader.readAsArrayBuffer(file);
  reader.onload = (e) => {
    console.log(e.target.result);
    parseFile(e.target.result);
  };
}

window.gcexports.viewer = (function () {
  return {
    Viewer: Viewer,
  };
})();
