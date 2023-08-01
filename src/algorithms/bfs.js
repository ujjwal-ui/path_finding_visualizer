

function traverse(i, row, col, dis, graph, n, m) {
    if(i === 0)
        row--;
    else if(i === 1)
        col++;
    else if(i === 2) 
        row++;
    else
        col--;
    if(row >= 0 && row < n && col >= 0 && col < m && graph[row][col].visited !== true) {
        return {row: row, col: col};
    }
    return {};
}

function bfs(graph, startNode, n, m, start_row, start_col, end_row, end_col, set_graph) {
    const queue = []; // Queue for BFS
    let visited_nodes = [];
    let tmp_mtx = graph.map((row) => [...row.map(obj => ({...obj}) )]);
    tmp_mtx[start_row][start_col]={...tmp_mtx[start_row][start_col], visited: true};
    queue.push({...tmp_mtx[start_row][start_col], visited: true});
    let destinationFound = false;

    while (queue.length > 0) {
      const currentNode = queue.shift();
      console.log(currentNode);

      let row = Number(currentNode.row);
      let col = Number(currentNode.col);
      let dis = Number(currentNode.distance); 
      let isWall = currentNode.isWall;

        for(let i=0; i<4; i++) {
            let node_visited = traverse(i, row, col ,dis, tmp_mtx, n, m);

            if(Object.keys(node_visited).length) {
                if(tmp_mtx[node_visited.row][node_visited.col].isWall)
                    continue;
                tmp_mtx[node_visited.row][node_visited.col]={
                    ...tmp_mtx[node_visited.row][node_visited.col],
                     visited: true
                    };
                queue.push({...tmp_mtx[node_visited.row][node_visited.col], distance: dis+1});
                visited_nodes.push({...node_visited, previousNode: {row: row, col: col}, isWall: isWall});
                if(node_visited.row === end_row && node_visited.col === end_col) {
                    destinationFound = true;
                    return visited_nodes;
                }
            }
        }
  }
  return visited_nodes;
} 

  function run (start_row, start_col, matrix, max_rows, max_cols, end_row, end_col, set_graph) {
    let startNode = {...matrix[start_row][start_col]};
    let visited_nodes = bfs(matrix, startNode, max_rows, max_cols, start_row, start_col, end_row, end_col, set_graph);
    return visited_nodes;
  }
  export default run;