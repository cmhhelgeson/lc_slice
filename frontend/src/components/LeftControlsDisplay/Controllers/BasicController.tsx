import "./controller.css"

type BasicControllerDivProps = {
    label: string,
    setup: () => void,
    step: () => void,
    pause: () => void,
    play: () => void,
}

type BasicControllerButtonOverrideProps = {
  buttonLabels: string[],
  buttonActions: (() => void)[]
}

type BasicControllerInputOverrideProps = {
  inputLabels: string[],
  inputActions: (() => void)[]
}

export const BasicController = ({
  label,
  setup,
  step,
  pause,
  play,
}: BasicControllerDivProps) => {
  return (
    <div className={"controller"}>
      <div className={"controller_contents_container"}>
        <b>{label}</b>
        <ControllerButtons 
          buttonLabels={["Set Up", "Step", "Pause", "Play"]}
          buttonActions={[setup, step, pause, play]}
        />
      </div>
    </div>     
  ) 
}

export const BasicControllerWithInput = ({
  label, 
  setup, 
  step,
  pause,
  play,
  inputLabels,
  inputActions,
}: BasicControllerDivProps & BasicControllerInputOverrideProps) => {
  return (
    <div className={"controller"}>
      <div className={"controller_contents_container"}>
        <b>{label}</b>
          <ControllerButtons 
            buttonLabels={["Set Up", "Step", "Pause", "Play"]}
            buttonActions={[setup, step, pause, play]}
          />
          <ControllerInputs 
            inputLabels={inputLabels}
            inputActions={inputActions}
          />
      </div>
    </div>     
  ) 
}

export const ControllerButtons = ({buttonLabels, buttonActions} : BasicControllerButtonOverrideProps) => {
  return (
    <div className={"controller_buttons_container"}>
      {buttonActions.map((action, idx) => (
        <button key={idx} className={"controller_button"} onClick={() => action()}>{buttonLabels[idx]}</button>
      ))}
    </div>
  )
}

export const ControllerInputs = ({inputLabels, inputActions}: BasicControllerInputOverrideProps) => {
  return (
    <div className={"controller_buttons_container"}>
      {inputActions.map( ( action, idx ) => (
        <div>
          {inputLabels[idx] ? inputLabels[idx] : "Input: "}
          <input 
            key={inputLabels[idx] ? inputLabels[idx] : idx}
            className={"controller_button"}
            onClick={() => action()}
            style={{"marginLeft": "5px", "width": "40px", "marginRight": "5px"}}
          />
        </div> 
      ))}  
    </div>  
  );        
}



