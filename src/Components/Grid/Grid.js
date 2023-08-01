import React from "react";
import { useState, useEffect } from "react";
import Node from "../Node/Node.js";
import classes from "./grid.module.css";
import run from "../../algorithms/bfs.js";

let START_ROW = 8;
let START_COL = 7;
let END_ROW = 3;
let END_COL = 22;
const ROW_LIMIT = 15;
const COL_LIMIT = 40;
let shouldRender = 0;
const visitedNodeCount = 0;
let visitedNodeLength = -1;

const intilizationFunction = () => {
    let iterator = 1;
    let tmpMatrix = [];
     for(let i=0; i<ROW_LIMIT; i++) {
         let rowArray = [];
         for(let j=0; j<COL_LIMIT; j++) {
             const nodeObj = {
                 id: iterator++,
                 row: i,
                 col: j,
                 isStart: i === START_ROW && j === START_COL,
                 isFinish: i === END_ROW && j === END_COL,
                 visited: false,
                 distance: i === START_ROW && j === START_COL ? 0 : Number.MAX_SAFE_INTEGER,
                 previousNode: {},
                 isPathNode: false,
                 isWall: false
             }
             rowArray.push(nodeObj);
         }
         tmpMatrix.push(rowArray);
     }
     return tmpMatrix;
}

function startDragHandler(event) {
    // Store the dragged item's data in the "text/plain" format
    event.dataTransfer.setData('text/plain', event?.srcElement?.attributes?.id?.nodeValue);   
  }

function startDragEndHandler(event) {
    // Remove any visual feedback when the dragging ends
    event.dataTransfer.setData('text/plain', event?.srcElement?.attributes?.id?.nodeValue); 
  }
  
  function startDragOverHandler(event) {
    // Prevent default behavior to allow drop
    event.stopPropagation();
    event.preventDefault();
  }
  
  function startDragEnterHandler(event) {
    // Add visual feedback when a draggable item enters the drop area
    event.stopPropagation();
    event.preventDefault();
  }
  
  function startDragLeaveHandler(event) {
    // Remove the visual feedback when a draggable item leaves the drop area
    event.stopPropagation();
    event.preventDefault();
  }

  const getNodeFromMatrix = (matrix, nodeId) => {
        for(let i=0; i<matrix.length; i++) {
            for(let j=0; j<matrix[i].length; j++) {
                let node = matrix[i][j];
                if(node.id === nodeId)
                    return node;
            }
        }
        return {};
  } 

const Grid = React.memo(() => {
    const [matrix, setMatrix] = useState([]);
    const [isFirstTimeChange, setIsFirstTimeChange] = useState(true);
    const [wall, setWall] = useState(false);


    useEffect(() => {
        let tmp_mtx = intilizationFunction();
        setMatrix(tmp_mtx);
    },[]);

    useEffect(() => {
        if(shouldRender === 1 || matrix.length === 0)
            return;

        const startDropHandler = (event) => {
            event.stopPropagation(); event.preventDefault();
            let dragStartNodeId = Number(event.dataTransfer.getData('text/plain'));
            let dragStartNode = getNodeFromMatrix(matrix, dragStartNodeId);

            if(dragStartNodeId === 0 || Object.keys(dragStartNode).length === 0)
                return;

            const nodeId = Number(event?.srcElement?.attributes?.id?.nodeValue);
            const newPlaceToMove = getNodeFromMatrix(matrix, nodeId);

            if( (newPlaceToMove.row === START_ROW && newPlaceToMove.col === START_COL) || 
                (newPlaceToMove.row === END_ROW && newPlaceToMove.col === END_COL) )
                    return;

            if(dragStartNode.row === END_ROW && dragStartNode.col === END_COL) {
                let newEndRow = newPlaceToMove.row, newEndCol = newPlaceToMove.col;
                let prevEndRow = END_ROW, prevEndCol = END_COL;

                setMatrix(prevMatrix => {
                    let tmp_mtx = prevMatrix.map(row => [...row.map(obj => ({...obj}))]);
                    tmp_mtx[newEndRow][newEndCol] = {...tmp_mtx[newEndRow][newEndCol], isFinish: true};
                    tmp_mtx[prevEndRow][prevEndCol] = {...tmp_mtx[prevEndRow][prevEndCol], isFinish: false};
                    END_ROW = newEndRow; END_COL = newEndCol;
                    return tmp_mtx;
                });
                return;
            }

            let newStartRow = newPlaceToMove.row, newStartCol = newPlaceToMove.col;
            let prevStartRow = START_ROW, prevStartCol = START_COL;
                setMatrix(prevMatrix => {
                    let tmp_mtx = prevMatrix.map(row => [...row.map(obj => ({...obj}))]);
                    tmp_mtx[newStartRow][newStartCol] = {...tmp_mtx[newStartRow][newStartCol], isStart: true};
                    tmp_mtx[prevStartRow][prevStartCol] = {...tmp_mtx[prevStartRow][prevStartCol], isStart: false};
                    START_ROW = newStartRow; START_COL = newStartCol;
                    return tmp_mtx;
                });
        }

        if(isFirstTimeChange) {
            setIsFirstTimeChange(false);
            const allNodes = document.querySelectorAll(".node_node__slf4X");
    
            allNodes.forEach(element => {
                element.addEventListener('drop', startDropHandler);
                element.addEventListener('dragover', startDragOverHandler);
                element.addEventListener('dragleave', startDragLeaveHandler);
                element.addEventListener('dragenter', startDragEnterHandler);
                element.addEventListener('dragenter', startDragEndHandler);
            });
        }
        const startNodeElement = document.querySelector(".node_start__UQ8eE");
        const endNodeElement = document.querySelector(".node_end__jLaz7");

        startNodeElement?.addEventListener("dragstart", startDragHandler);
        endNodeElement?.addEventListener("dragstart", startDragEndHandler);


        if(Object.keys(matrix[END_ROW][END_COL].previousNode).length > 0) {
            setTimeout(() => {
                visualizePathHanlder(matrix);
            },500);
        }
        // setVisitedNodeCount(prevCount => prevCount+1);
    },[matrix, isFirstTimeChange]);


    const visualizePathHanlder = (matrix) => {
        let tmp_mtx = matrix.map(row => [...row.map(obj => ({...obj}))]);
        const pathNodes = [];
        let row = tmp_mtx[END_ROW][END_COL].previousNode.row, col=tmp_mtx[END_ROW][END_COL].previousNode.col;

        while(row !== START_ROW || col !== START_COL) {
            pathNodes.push({row: row,col: col});
            let prevNodeRow = tmp_mtx[row][col].previousNode.row;
            let prevNodeCol = tmp_mtx[row][col].previousNode.col;
            row = prevNodeRow; col=prevNodeCol;
        }
        shouldRender = 1;

        let len = pathNodes.length;
        for(let i=0; i<len; i++) {
            setTimeout(() => {
                const row = pathNodes[len-i-1].row, col = pathNodes[len-i-1].col;
                let id = matrix[row][col].id;
                const element = document.getElementById(id);
                element.classList.add(classes.isPathNode);
            }, 70*i);
        }
    };

    const visualizeHandler = () => {
        let start_row = START_ROW;
        let start_col = START_COL;
        let visited_nodes = run(start_row, start_col, matrix, ROW_LIMIT, COL_LIMIT, END_ROW, END_COL, setMatrix);
        visitedNodeLength = visited_nodes.length;

        for(let i=0; i<visited_nodes.length; i++) {
            setTimeout(() => {
                setMatrix(prevMatrix => {
                    let tmp_mtx = prevMatrix.map(row => [...row.map(obj => ({...obj}))]);
                    let row = visited_nodes[i].row, col = visited_nodes[i].col;
                    let previous_row = visited_nodes[i].previousNode.row, previous_col = visited_nodes[i].previousNode.col;
                    tmp_mtx[row][col].visited = true;
                    tmp_mtx[row][col].previousNode = {
                        row: previous_row,
                        col: previous_col
                    };
                    return tmp_mtx;
                });
            }, i*50);
        }
    }


    const resetButtonHandler = () => {
        let tmp_mtx = intilizationFunction();
        shouldRender = 0;
        setMatrix(tmp_mtx);
        setWall(false);
    }

    const wallButtonHandler = () => {
        setWall(prevState => !prevState);
    }

    const nodeClickHandler = (e) => {
       const nodeId = Number(e?.nativeEvent?.srcElement?.attributes?.id?.nodeValue);
       const nodeObject = getNodeFromMatrix(matrix, nodeId);
       console.log(nodeObject);
       if(Object.keys(nodeObject).length  === 0)
            return;

        if(nodeObject.isWall) {
            setMatrix(prevMatrix => {
                let tmp_mtx = prevMatrix.map(row => [...row.map(obj => ({...obj}))]);
                let row = nodeObject.row, col = nodeObject.col;
                tmp_mtx[row][col] = {...tmp_mtx[row][col], isWall: false};
                return tmp_mtx;
            });
            return;
        }
        setMatrix(prevMatrix => {
            let tmp_mtx = prevMatrix.map(row => [...row.map(obj => ({...obj}))]);
            let row = nodeObject.row, col = nodeObject.col;
            tmp_mtx[row][col] = {...tmp_mtx[row][col], isWall: true};
            return tmp_mtx;
        });
    }

    return (
             <>
            <div className={classes.cover}>
            <div>{wall && "You can add walls now"}</div>
            <div className={classes.buttonBlock}>
                <button className={classes.visualize_button} onClick={visualizeHandler}>Visualize</button>
                <button className={classes.reset_button} onClick={resetButtonHandler}>Reset</button>
                <button className={classes.walls_button} onClick={wallButtonHandler}>Walls</button>
            </div>
            <div className={classes.grid}>
                {
                    matrix.map((row, rowIdx) => {
                        return (
                            <div className={classes.rowBlock} key={rowIdx}>
                                {
                                    row.map((item, colIdx) => {
                                        return <Node isDraggable={item.isStart ? true : item.isFinish ? true : false} isFinish={item.isFinish} 
                                        id={item.id} isPathNode={item.isPathNode}
                                         key={item.id} visited={item.visited} 
                                         isStart={item.isStart} isEnd={item.isFinish}
                                         nodeClickHandler={nodeClickHandler} wall={wall}
                                         isWall={item.isWall}
                                         />
                                    })
                                }
                            </div>
                            )
                    })
                }
            </div>
            </div>
            </>
        
    );
});

export default Grid;
