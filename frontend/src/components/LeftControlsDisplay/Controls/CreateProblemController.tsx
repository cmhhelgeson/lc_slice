import React from "react"
import {PacificAtlanticWaterflowController, FloodFillController} from "../Controllers/GridControllers"
import { AllPathsFromSourceToTargetController } from "../Controllers/GraphControllers/AllPathsFromSourceToTargetController"
import { QUESTIONS_ENUM } from "../../../utils/questionEnum"
import { ShortestBridgeController } from "../Controllers/GridControllers/ShortestBridge/ShortestBridgeController"
import { UniquePathsOneController, UniquePathsTwoController} from "../Controllers/GridControllers/UniquePaths/"
import { SearchA2DMatrixIController } from "../Controllers/GridControllers/SearchA2DMatrix"

type CreateProblemControllerProps = {
    problemNumber: number,
    animationOn: boolean,
    play: () => void,
    pause: () => void,
    animationSpeed: number,
}

export const CreateProblemController = ({
    problemNumber, 
    animationOn,
    play,
    pause,
    animationSpeed
}: CreateProblemControllerProps) => {
  const initProps = {animationOn, play, pause, animationSpeed, problemNumber}
  switch(problemNumber) {
    case QUESTIONS_ENUM.UNIQUE_PATHS: {
      return (
        <UniquePathsOneController {...initProps}/>
      )
    }
    case QUESTIONS_ENUM.UNIQUE_PATHS_II: {
      return (
        <UniquePathsTwoController {...initProps}/>
      );
    }
    case QUESTIONS_ENUM.SEARCH_A_2D_MATRIX: {
      //TODO: 
      return (
        <SearchA2DMatrixIController {...initProps} />
      )
    }
    case QUESTIONS_ENUM.SEARCH_A_2D_MATRIX_II: {
      //TODO:
      return (
        <h1>Invalid problem selected!</h1>
      )
    }
    case QUESTIONS_ENUM.PACIFIC_ATLANTIC_WATER_FLOW: {
      return (
        <PacificAtlanticWaterflowController {...initProps} />
      );
    }
    case QUESTIONS_ENUM.SHORTEST_BRIDGE: {
      return (
        <ShortestBridgeController {...initProps} />
      )
    }
    case QUESTIONS_ENUM.FLOOD_FILL: {
      return (
        <FloodFillController {...initProps}/>
      );
    }
    case QUESTIONS_ENUM.ALL_PATHS_FROM_SOURCE_TO_TARGET: {
      return (
        <AllPathsFromSourceToTargetController  
          animationOn={animationOn}
          animationSpeed={animationSpeed}
          play={play}
          pause={pause}
        />
      )
    }

    case QUESTIONS_ENUM.MINIMUM_SWAPS_TO_ARRANGE_A_BINARY_GRID: {
      //TODO:!
      return (
        <h1>Invalid Problem selected!</h1>
      )
    }
    case QUESTIONS_ENUM.DETECT_CYCLES_IN_2D_GRID: {
      //TODO: !
      return (
        <h1>Invalid Problem Selected!</h1>
      )
    }
    case QUESTIONS_ENUM.SHIFT_2D_GRID: {
      return (
        <h1>Invalid Problem Selected!</h1>
      )
    }
    default: {
      return (
        <h1>Invalid Problem Selected</h1>
      )
    }
  }
}