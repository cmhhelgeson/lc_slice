import React from "react"
import { QueryResult } from "@apollo/client";
import { GetGridFromProblemExampleQuery, Exact, InputMaybe} from "../../../../__generated__/resolvers-types";
import { ComponentType, useState, useEffect} from "react";
import { useAppDispatch } from "../../../../features/hooks";
import { useGetProblemNumExamplesLazyQuery, useGetGridFromProblemExampleLazyQuery } from "../../../../__generated__/resolvers-types";
import { clearState } from "../../../../utils/clearState";
import { convertArrayToGrid, convertArrayToFalse} from "./gridControllerUtils";
import { copyGrids } from "../../../../features/grids/gridsSlice";
import { GridCreationLog } from "./logUtils";
import { pushJSXToLog } from "../../../../features/problemInfo/problemSlice";


export type WithBasicGridClientInjectedProps = {
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
  setComplete: (b: boolean) => void
  complete: boolean
}

export type WithBasicGridClientProviderProps = {
  animationOn: boolean,
  play: () => void,
  pause: () => void,
  animationSpeed: number,
  problemNumber: number,
}

export const withBasicGridClient = (
  WrappedComponent: ComponentType<WithBasicGridClientInjectedProps>
) => {
  return (props: WithBasicGridClientProviderProps) => {
    const dispatch = useAppDispatch();
    const [getGrid, gridClient] = useGetGridFromProblemExampleLazyQuery(); 
    const [example, setExample] = useState<number>(0);
    const [complete, setCompleteTemplate] = useState<boolean>(false);

    const setComplete = (b: boolean) => {
      setCompleteTemplate(b)
    }

    const clickSetUp = async () => {
      props.pause();
      clearState(dispatch, props.problemNumber);
      await getGrid({
        variables: {
          number: props.problemNumber,
          example: example,
        }
      })
    }

    useEffect(() => {
      console.log(gridClient);
      if (gridClient.data && gridClient.data.problem && gridClient.data.problem.grids && gridClient.data.problem.grids[0]) {
        const {interpretAs, gridData} = gridClient.data.problem.grids[0];
        //TODO: This is also bad
        const grid = convertArrayToGrid(gridData as number[][], interpretAs as "NUMBER" | "BOOLEAN" | "NORMALIZED");
        dispatch(copyGrids([grid]));
        setExample((example + 1) % gridClient.data.problem.numExamples);
        const element = (
          <GridCreationLog
            dispatch={dispatch}
            numStructs={1}
            labels={["Grid #1"]}
          />
        );
        dispatch(pushJSXToLog({element: element}));
        setCompleteTemplate(false);
      }
    }, [gridClient])

    return <WrappedComponent {...props} 
      setup={clickSetUp} 
      setComplete={setComplete}
      complete={complete}
      gridClient={gridClient}
    />
  } 
}