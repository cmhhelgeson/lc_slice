import React, {useState, useEffect} from "react"
import { useAppDispatch, useAppSelector } from "../../../../../features/hooks";
import { QUESTIONS_ENUM } from "../../../../../utils/questionEnum";
import { changeGridCell, changeGridCellData, changeGridCellStatus } from "../../../../../features/grids/gridsSlice";
import { BasicController } from "../../BasicController";
import { ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL, ARRAY_2D_GET_NEXT_INDEX, ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL } from "../../../../../features/grids/gridUtils";
import { pushJSXToLog } from "../../../../../features/problemInfo/problemSlice";
import { CellHighlighter } from "../../CellHighlighter";
import { UniquePathsInitialCellSetup } from "./uniquePathsHelpers";
import { withBasicGridClient, WithBasicGridClientInjectedProps } from "../withBasicGridClient";

const TEMPLATE_UniquePathsOneController = ({
  animationOn, play, pause, animationSpeed,
  gridClient, setComplete, complete, problemNumber, setup,
}: WithBasicGridClientInjectedProps) => {
  /* Global State Variables */
  const dispatch = useAppDispatch();
  const grid = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
  /* Local State Variables */
  const [example, setExample] = useState<number>(0);
  /* Client State Variables */
  const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0]);

  const clickSetUp = async () => {
    setup();
    setCurrentCell([0, 0])
  }

  const clickStep = () => {
    if (complete) {
      return;
    }
    dispatch(changeGridCellStatus({
      gridIndex: 0,
      row: currentCell[0], 
      col: currentCell[1],
      status: "UNEXPLORED",
    }));
    //Store current row and column values
    const row = currentCell[0];
    const col = currentCell[1];
    //Default value for first cell;
    if (row === 0 && col === 0) {
      const nextCell = UniquePathsInitialCellSetup(dispatch, currentCell, grid);
      setCurrentCell(nextCell);
      return;
    }
    let sum = 0;
    let prevCells = ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL(currentCell, "BEHIND", grid);
    for (let i = 0; i < prevCells.length; i++) {
        //Look at behind cells and clear status
        let prevCellRow = prevCells[i][0];
        let prevCellCol = prevCells[i][1];
        sum += grid[prevCellRow][prevCellCol].data;
        dispatch(changeGridCellStatus({
          gridIndex: 0,
          row: prevCellRow,
          col: prevCellCol,
          status: "UNEXPLORED"
        }))
    }
    dispatch(changeGridCellData({
      gridIndex: 0,
      row: currentCell[0],
      col: currentCell[1],
      data: sum,
    }))
    //set current cell to next cell in the grid
    const [nextRow, nextCol] = ARRAY_2D_GET_NEXT_INDEX(grid, row, col);
    dispatch(changeGridCell({
        gridIndex: 0,
        row: nextRow, 
        col: nextCol,
        data: 0,
        status: "CURRENT",
    }));
    let element: JSX.Element = (
      <p>
        {`Added values above and to the left of cell`}
        <CellHighlighter dispatch={dispatch} cell={currentCell}/>
      </p>
    )
    dispatch(pushJSXToLog({element: element}));
    element = (
      <p>
        {`Iterated to cell`}
        <CellHighlighter dispatch={dispatch} cell={[nextRow, nextCol]} />
      </p>
    )
    dispatch(pushJSXToLog({element: element}));
    if (nextRow === 0 && nextCol === 0) {
      setComplete(true);
      pause();
      const element: JSX.Element = (
        <p>{`Last element reached. Final number of paths is `}<b>{`${sum}`}</b></p>
      )
      dispatch(pushJSXToLog({element: element}));
      return;
    }

    const prevOfNextCells = ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL([nextRow, nextCol], "BEHIND", grid);
    for (let i = 0; i < prevOfNextCells.length; i++) {
      dispatch(changeGridCellStatus({
        gridIndex: 0,
        row: prevOfNextCells[i][0],
        col: prevOfNextCells[i][1],
        status: "PREV_EVALUATE"
      }))
    }
    setCurrentCell([nextRow, nextCol]);
  }

  useEffect(() => {
    if (animationOn && problemNumber === QUESTIONS_ENUM.UNIQUE_PATHS) {
      setTimeout(() => clickStep(), animationSpeed);
    }
  }, [currentCell, animationOn]);




  return (
    <div>
    <BasicController
      label={"Unique Paths I"}
      setup={clickSetUp}
      step={clickStep}
      pause={pause}
      play={() => {
          if (problemNumber !== QUESTIONS_ENUM.UNIQUE_PATHS) {
              clickSetUp();
          }
          play();
      }}
    />
    </div>
  )
}

export const UniquePathsOneController = 
  withBasicGridClient(TEMPLATE_UniquePathsOneController)