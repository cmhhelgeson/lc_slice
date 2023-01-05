import React, {useState, useEffect} from "react"
import { ControllerProps } from "../../controllerUtils";
import { useAppDispatch, useAppSelector } from "../../../../../features/hooks";
import { clearState } from "../../../../../utils/clearState";
import { QUESTIONS_ENUM } from "../../../../../utils/questionEnum";
import { Exact, GetGridFromProblemExampleQuery, GridInterpreter, InputMaybe, useGetGridFromProblemExampleLazyQuery } from "../../../../../__generated__/resolvers-types";
import { handleServerGrid } from "../gridControllerUtils";
import { changeGridCellStatus } from "../../../../../features/grids/gridsSlice";
import { BasicController } from "../../BasicController";
import { ComponentType } from "react";
import { QueryResult } from "@apollo/client";
import { Cell } from "../../../../../utils/types";


type Base = {
  animationOn: boolean,
  play: () => void,
  pause: () => void,
  animationSpeed: number,
  problemNumber: number, 
}

type WithBasicGridClientInjectedProps = {
  animationOn: boolean,
  play: () => void,
  pause: () => void,
  animationSpeed: number,
  problemNumber: number,
  gridClient: QueryResult<GetGridFromProblemExampleQuery, Exact<{
    number?: InputMaybe<number> | undefined;
    example?: InputMaybe<number> | undefined;
  }>>
  setup: () => Promise<void>
}

type WithBasicGridClientProviderProps = {
  animationOn: boolean,
  play: () => void,
  pause: () => void,
  animationSpeed: number,
  problemNumber: number,
}

const withBasicGridDispatch = (
  WrappedComponent: ComponentType<WithBasicGridClientInjectedProps>
) => {
  return (props: WithBasicGridClientProviderProps) => {
    const dispatch = useAppDispatch();
    const [getGrid, gridClient] = useGetGridFromProblemExampleLazyQuery(); 
    const [example, setExample] = useState<number>(0);

    const clickSetUp = async () => {
      clearState(dispatch, props.problemNumber);
      await getGrid({
        variables: {
          number: props.problemNumber,
          example: 0,
        }
      })
      setExample(example + 1);
    }
    return <WrappedComponent {...props} 
      setup={clickSetUp} 
      gridClient={gridClient}
    />
  } 
}

const TEMPLATE_SearchA2DMatrixI = ({
  animationOn, play, pause, animationSpeed,
  problemNumber, gridClient, setup
}: WithBasicGridClientInjectedProps) => {
  const dispatch = useAppDispatch();
  const grid = useAppSelector(state => state.grids[0] ? state.grids[0].cells : [])
  /* Client State Variables */
  const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0]);
  const [complete, setComplete] = useState<boolean>(false);


  const clickSetUp = async () => {
    setup();
  }

  useEffect(() => {
    if (gridClient.data && gridClient.data.problem && gridClient.data.problem.grids && gridClient.data.problem.grids[0]) {
      const {interpretAs, gridData, label} = gridClient.data.problem.grids[0];
      handleServerGrid(dispatch, gridData as number[][], label as string, interpretAs as GridInterpreter);
      dispatch(changeGridCellStatus({gridIndex: 0, row: 0, col: 0, status: "CURRENT"}))
      setCurrentCell([0, 0]);
      setComplete(false);
    }
  }, [gridClient]);

  const clickStep = () => {
    console.log("step");
    console.log(grid);
  }

  useEffect(() => {
    if (animationOn && problemNumber === QUESTIONS_ENUM.SEARCH_A_2D_MATRIX) {
      setTimeout(() => clickStep(), animationSpeed);
    }
  }, [currentCell, animationOn]);

  return (
    <BasicController
      label={"Search a 2D Matrix"}
      setup={clickSetUp}
      step={clickStep}
      pause={pause}
      play={() => {
          if (problemNumber !== QUESTIONS_ENUM.SEARCH_A_2D_MATRIX) {
              clickSetUp();
          }
          play();
      }}
    />
  );
}

export const SearchA2DMatrixI = 
  withBasicGridDispatch(TEMPLATE_SearchA2DMatrixI)

