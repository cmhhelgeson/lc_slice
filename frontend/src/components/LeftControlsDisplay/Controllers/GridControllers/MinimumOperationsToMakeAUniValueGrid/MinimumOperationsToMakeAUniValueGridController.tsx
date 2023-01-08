import { withBasicGridClient, WithBasicGridClientInjectedProps } from "../withBasicGridClient"

const TEMPLATE_MinimumOperationsToMakeAUniValueGridController = ({
  animationOn, play, pause, animationSpeed,
  gridClient, setup, problemNumber
}: WithBasicGridClientInjectedProps ) => {

  const clickSetup = () => {
    setup();
  }


  return <div></div>

}

export const MinimumOperationsToMakeAUniValueGridController = 
  withBasicGridClient(TEMPLATE_MinimumOperationsToMakeAUniValueGridController);