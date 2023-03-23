import React from "react";
import { Rnd } from "react-rnd";
import {RiBallPenLine} from 'react-icons/ri'

const style = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  paddingLeft: '10px',
  border: "solid 1px #000000",
  background: "rgb(28,95,156, 0.5)"
};

class TextDragTool extends React.Component {
  constructor({id: eleId, pageId: pageId, x: x, y: y, width: width, height: height}) {
    super();
    this.state = {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  render() {
    return (
      <Rnd
        bounds='.document'
        style={style}
        size={{ width: this.state.width, height: this.state.height }}
        position={{ x: this.state.x, y: this.state.y }}
        minWidth={75}
        minHeight={38}
        onDragStop={(e, d) => {
          console.log("X: "+d.x);
          console.log("Y: "+d.y);
          this.setState({ x: d.x, y: d.y });
          this.props.handleDragStop({ x: d.x, y: d.y }, e);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.setState({
            width: ref.style.width,
            height: ref.style.height,
            ...position
          });
          this.props.handleResize({
            width: ref.style.width,
            height: ref.style.height}, e);
        }}
      >
        <div className="resize-circle tl-resize"></div>
        <div className="resize-circle tr-resize"></div>
        <div className="resize-circle br-resize"></div>
        <div className="resize-circle bl-resize"></div>
       <RiBallPenLine className="tool-icon-position"/>
      </Rnd>
    );
  }
}

export default TextDragTool