/* Copyright (c) 2020, ARTCOMPILER INC */
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
import {EditorState, EditorView, basicSetup} from "@codemirror/next/basic-setup"
import {javascript} from "@codemirror/next/lang-javascript"
const FitParser = require('../node_modules/fit-file-parser/dist/fit-parser.js').default;
function loadScript(src, resume) {
  var script = document.createElement("script");
  script.onload = resume;
  script.src = src;
  script.type = "text/javascript";
  script.async = true;
  document.getElementsByTagName("head")[0].appendChild(script);
}
function loadStyle(src, resume) {
  var link = document.createElement("link");
  link.onload = resume;
    link.href = src;
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}
class JSONViewer extends React.Component {
  componentDidMount() {
    const state = EditorState.create({
      doc: this.props.data,
      extensions: [basicSetup, javascript()],
    });
    this.view = new EditorView({
      state: state,
      parent: document.getElementById("form"),
    });
  }
  componentDidUpdate() {
    const state = EditorState.create({
      doc: this.props.data,
      extensions: [basicSetup, javascript()],
    });
    this.view.setState(state);
  }
  render() {
    return <div id="form" />;
  }
}
class Viewer extends React.Component {
  componentDidMount() {
  }
  render () {
    let props = this.props;
    var data = props.obj.data;
    return (
      data !== undefined ? <div>
        <link rel="stylesheet" href="/L134/style.css" />
        <div className="L134">
          <input id="fileupload" name="myfile" type="file" onChange={handleChange} />
          <br/> <br />
        <JSONViewer data={JSON.stringify(data,null,2)}/>
        </div>
      </div>
      : <div>
          <input id="fileupload" name="myfile" type="file" onChange={handleChange} />
        </div>
    );
  }
}

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
    data = filterData(data);
    window.gcexports.dispatcher.dispatch({
      [window.gcexports.id]: {
        data: data,
        recompileCode: true,
      }
    });
  });
}

function filterData(data) {
  // FIXME get filter from obj.
  return data;
  // const activity = data.activity;
  // const session = activity.sessions[0];
  // const lap = session.laps[0];
  // const records = lap.records;
  // const dataFiltered = [["hr"]];
  // records.forEach(r => {
  //   dataFiltered.push([r.heart_rate]);
  // });
  // return dataFiltered;
}

function handleChange(e) {
  const inputElement = e.target;
  const file = inputElement.files[0];
  const reader = new FileReader;
  reader.readAsArrayBuffer(file);
  reader.onload = (e) => {
    parseFile(e.target.result);
  };
}

window.gcexports.viewer = (function () {
  return {
    Viewer: Viewer,
  };
})();
