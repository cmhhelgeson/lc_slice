import { useAppDispatch, useAppSelector } from "../../../../../features/hooks";
import React, {useState, useEffect} from "react"
import { ControllerProps } from "../../controllerUtils";
import { useGetGridFromProblemExampleLazyQuery } from "../../../../../__generated__/resolvers-types";
import { BasicController } from "../../BasicController";
import { clearState } from "../../../../../utils/clearState";
import { QUESTIONS_ENUM } from "../../../../../utils/questionEnum";
import { handleServerGrid } from "../gridControllerUtils";
import { changeGridCellData, changeGridCellStatus } from "../../../../../features/grids/gridsSlice";
import { GridInterpreter } from "../../../../../__generated__/resolvers-types";
import { UniquePathsInitialCellSetup } from "./uniquePathsHelpers";
import { ARRAY_2D_GET_NEXT_INDEX, ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL } from "../../../../../features/grids/gridUtils";
import { pushJSXToLog } from "../../../../../features/problemInfo/problemSlice";
import { CellHighlighter } from "../../CellHighlighter";
import { withBasicGridClient, WithBasicGridClientInjectedProps } from "../withBasicGridClient";


const TEMPLATE_UniquePathsTwoController = ({
  animationOn, play, pause, animationSpeed,
  gridClient, complete, setComplete, problemNumber, setup
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
    setCurrentCell([0, 0]);
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
    
    //Compute value of current cell
    let sum = 0;
    let prevOfCurrent = ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL(
      currentCell, "BEHIND", grid);
    if (grid[row][col].data === 1) {
      for (let i = 0; i < prevOfCurrent.length; i++) {
        dispatch(changeGridCellStatus({
          gridIndex: 0,
          row: prevOfCurrent[i][0],
          col: prevOfCurrent[i][1],
          status: "UNEXPLORED"
        }));
      }
      dispatch(changeGridCellData({
        gridIndex: 0,
        row: row,
        col: col,
        data: sum
      }));
      const element = (
        <p>
          {`Encountered obstacle at cell`}
          <CellHighlighter dispatch={dispatch} cell={currentCell}/>
          {`and set it's value to 0.`}
        </p>
      );
      dispatch(pushJSXToLog({element: element}));
    } else {
      for (let i = 0; i < prevOfCurrent.length; i++) {
        //Look at behind cells and clear status
        let prevCellRow = prevOfCurrent[i][0];
        let prevCellCol = prevOfCurrent[i][1];
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
        row: row,
        col: col,
        data: sum
      }))
      const element = (
        <p>
          {`Added values from above and left to current cell.`}
          <CellHighlighter dispatch={dispatch} cell={currentCell}/>
        </p>
      );
      dispatch(pushJSXToLog({element: element}));
    }
    const nextCell = ARRAY_2D_GET_NEXT_INDEX(grid, row, col);
    setCurrentCell(nextCell);
    dispatch(changeGridCellStatus({
      gridIndex: 0,
      row: nextCell[0],
      col: nextCell[1],
      status: "CURRENT"
    }));
    const element = (
      <p>
        {`Iterated to cell`}
        <CellHighlighter dispatch={dispatch} cell={nextCell} />
      </p>
    );
    dispatch(pushJSXToLog({element: element}));
    if (nextCell[0] === 0 && nextCell[1] === 0) {
      setComplete(true);
      pause();
      const element = (
        <p>
          {`Finished grid search. Final number of paths is ${sum}`}
        </p>
      )
      dispatch(pushJSXToLog({element: element}));
      return;
    }
    const prevOfNext = ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL(nextCell, "BEHIND", grid);
    for (let i = 0; i < prevOfNext.length; i++) {
      dispatch(changeGridCellStatus({
        gridIndex: 0,
        row: prevOfNext[i][0],
        col: prevOfNext[i][1],
        status: "PREV_EVALUATE"
      }))
    }
  }

  useEffect(() => {
    if (animationOn && problemNumber === QUESTIONS_ENUM.UNIQUE_PATHS_II) {
      setTimeout(() => clickStep(), animationSpeed);
    }
  }, [currentCell, animationOn]);

  return (
    <BasicController
      label={"Unique Paths II"}
      setup={clickSetUp}
      step={clickStep}
      pause={pause}
      play={() => {
          if (problemNumber !== QUESTIONS_ENUM.UNIQUE_PATHS_II) {
              clickSetUp();
          }
          play();
      }}
    />
  );
}

export const UniquePathsTwoController = 
  withBasicGridClient(TEMPLATE_UniquePathsTwoController);