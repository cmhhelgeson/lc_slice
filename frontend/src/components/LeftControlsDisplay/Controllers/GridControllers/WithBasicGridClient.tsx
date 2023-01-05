import { QueryResult } from "@apollo/client";
import { GetGridFromProblemExampleQuery, Exact, InputMaybe} from "../../../../__generated__/resolvers-types";
import { ComponentType, useState, useEffect} from "react";
import { useAppDispatch } from "../../../../features/hooks";
import { useGetProblemNumExamplesLazyQuery, useGetGridFromProblemExampleLazyQuery } from "../../../../__generated__/resolvers-types";
import { clearState } from "../../../../utils/clearState";

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

export const withBasicGridClient = (
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