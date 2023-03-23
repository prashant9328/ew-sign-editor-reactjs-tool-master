import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { Rnd } from "react-rnd";
import { RiBallPenLine } from "react-icons/ri";

const style = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  paddingLeft: "10px",
  border: "solid 1px #000000",
  background: "rgb(28,95,156, 0.5)",
};

const SignDragTool = ({
  eleId,
  pageId,
  x,
  y,
  width,
  height,
  handleDragStart,
  handleDragStop,
  handleResize,
}) => {
  const currentElementref = useRef(null);
  const [currentState, setCurrentState] = useState({
    id: eleId,
    pageId: pageId,
    x: x,
    y: y,
    width: width,
    height: height,
  });

 

  return (
    <Rnd
      bounds=".document"
      style={style}
      size={{ width: currentState.width, height: currentState.height }}
      position={{ x: currentState.x, y: currentState.y }}
      minWidth={75}
      minHeight={38}
      onDragStart={(e, d) => {
        handleDragStart("Signature", e);
      }}
      onDragStop={(e, d) => {
        setCurrentState({ ...currentState, x: d.x, y: d.y });
        handleDragStop({ x: d.x, y: d.y }, e);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setCurrentState({
          ...currentState,
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });

        handleResize(
          {
            width: ref.style.width,
            height: ref.style.height,
          },
          e
        );
      }}
    >
      <div className="resize-circle tl-resize"></div>
      <div className="resize-circle tr-resize"></div>
      <div className="resize-circle br-resize"></div>
      <div className="resize-circle bl-resize"></div>
      <RiBallPenLine className="tool-icon-position" />
    </Rnd>
  );
};

export default SignDragTool;

// class SignDragTool extends React.Component {

//   constructor({id: eleId, pageId: pageId, x: x, y: y, width: width, height: height}) {
//     super();
//     this.state = {
//       width: width,
//       height: height,
//       x: x,
//       y: y
//     };
//   }

//   componentDidUpdate() {
//     console.log('@@@ componentDidUpdate: '+ this.ref);
//   }

//   render() {
//     return (
//       <Rnd
//         ref={(r) => {
//           this.ref = r
//         }}
//         bounds='.document'
//         style={style}
//         size={{ width: this.state.width, height: this.state.height }}
//         position={{ x: this.state.x, y: this.state.y }}
//         minWidth={75}
//         minHeight={38}
//         onDragStart={(e, d) => {
//           this.props.handleDragStart('Signature', e);
//         }}
//         onDragStop={(e, d) => {
//           this.setState({ x: d.x, y: d.y });
//           this.props.handleDragStop({ x: d.x, y: d.y }, e);
//         }}
//         onResizeStop={(e, direction, ref, delta, position) => {
//           this.setState({
//             width: ref.style.width,
//             height: ref.style.height,
//             ...position
//           });
//           this.props.handleResize({
//             width: ref.style.width,
//             height: ref.style.height}, e);
//         }}
//       >
//         <div className="resize-circle tl-resize"></div>
//         <div className="resize-circle tr-resize"></div>
//         <div className="resize-circle br-resize"></div>
//         <div className="resize-circle bl-resize"></div>
//        <RiBallPenLine className="tool-icon-position"/>
//       </Rnd>
//     );
//   }
// }
