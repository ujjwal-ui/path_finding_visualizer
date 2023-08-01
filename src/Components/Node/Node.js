import classes from "./node.module.css";
import React from "react";
import { useState } from "react";

const Node = (props) => {
    const [nodeState, setNodeState] = useState({});
    const  {id, isStart, isEnd, visited,
         isPathNode , isFinish, isDraggable, wall, nodeClickHandler, isWall } = props;

    return (
        <div onClick={wall ? (e)=> nodeClickHandler(e) : () => {}} draggable={isDraggable} id={id}
         className={isStart ? classes.start : isEnd ? classes.end : visited ? classes.visited : isPathNode
            ? classes.isPathNode : isWall ? classes.isWall : classes.node}  ></div>
    );
}
export default Node;