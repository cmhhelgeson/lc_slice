import "./controller.css"
import { FormEvent } from "react"

type BasicControllerButtonOverrideProps = {
  buttonLabels: string[],
  buttonActions: (() => void)[]
}

type BasicControllerInputOverrideProps = Required<Pick<BasicControllerProps, "exInputs">>

type BasicControllerProps = {
  label: string,
  setup: () => void,
  step: () => void,
  pause: () => void,
  play: () => void,
  exButtons?: {
    labels: string[]
    actions: (() => void)[],
  }
  exInputs?: {
    labels: string[],
    actions: ((e: FormEvent<HTMLInputElement>) => void)[]
  }
}

export const BasicController = ({
  label, setup, step, pause, play,
  exButtons, exInputs
}: BasicControllerProps) => {
  return (
    <div className={"controller"}>
      <div className={"controller_contents_container"}>
        <b>{label}</b>
        <ControllerButtons 
          buttonLabels={["Set Up", "Step", "Pause", "Play"]}
          buttonActions={[setup, step, pause, play]}
        />
        {exButtons ? 
          <ControllerButtons 
            buttonLabels={exButtons.labels} 
            buttonActions={exButtons.actions}
          /> : 
          null 
        }
        {exInputs ? <ControllerInputs exInputs={exInputs}/> : null}
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

export const ControllerInputs = ({exInputs}: BasicControllerInputOverrideProps) => {
  const {labels, actions} = exInputs;
  return (
    <div className={"controller_buttons_container"}>
      {actions.map( ( action, idx ) => (
        <div>
          {labels[idx] ? labels[idx] : "Input: "}
          <input 
            key={labels[idx] ? labels[idx] : idx}
            className={"controller_button"}
            style={{"marginLeft": "5px", "width": "40px", "marginRight": "5px"}}
          />
        </div> 
      ))}  
    </div>  
  );        
}


With: 
                    <input 
                        type="number"
                        min={0}
                        max={9}
                        step={1}
                        value={replaceWith}
                        onChange={onChangeReplaceWith}
                        style={{"width": "40px", "marginLeft": "5px"}}
                    />
