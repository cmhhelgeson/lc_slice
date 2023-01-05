import React, { useEffect, useState, useRef} from 'react';
import './App.css';
import { 
  Main,
} from './styles';

import {Container as ResizeContainer, Bar, Section} from "react-simple-resizer"
import { Controls } from './components/LeftControlsDisplay/Controls'
import { useDispatch } from 'react-redux';
import { useAppSelector } from './features/hooks';
import Navbar from 'react-bootstrap/Navbar';
import { clearState } from './utils/clearState';
import { DataStructureDisplay } from './components/RightDSDisplay';
import FormControl from '@mui/material/FormControl';
import {InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';

export type ProblemDropdownType = {
  title: string,
  action: () => void,
  problemNumber: number,
}

export const constructProblemDropdown = (
  problems: string[], 
  dispatch: any
): ProblemDropdownType[] => {
  return problems.map((problem, idx) => {
    let number = parseInt(problem.split(".")[0]);
    return {
      title: problem, 
      problemNumber: number,
      action: () => {
        clearState(dispatch, number);
      }
    }
  })
}

/**
 * Layout of the application 
 * @Header Contains navigation elements for each problem.
 * @Left Contains controls and action log for each problem.
 * @Right Contains the actual data structures and a legend.
 */
function App() {
  //# Selectors #//
  const problemLog = useAppSelector(state => state.problem.problemLog);

  //# Local State Values #//
  const [height, setHeight] = useState<number>(window.innerHeight - 44);
  const [rightWidth, setRightWidth] = useState<number>(0);
  //Need this to prevent scroll on each save
  const [logLength, setLogLength] = useState<number>(0);
  const [currentGridProblem, setCurrentGridProblem] = useState<string>('');
  const [currentGraphProblem, setCurrentGraphProblem] = useState<string>('')

  //# Ref Values #/
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight - 44);
    });
  }, []);

  useEffect(() => {
    if (rightSectionRef.current !== null) {
      console.log(rightSectionRef.current.clientWidth)
      setRightWidth(rightSectionRef.current.clientWidth);
    }

  }, [rightSectionRef]);


  const GridProblems = constructProblemDropdown(
    [
      "62. Unique Paths",
      "63. Unique Paths II",
      "74. Search a 2D Matrix",
      "417. Pacific Atlantic Waterflow", 
      "733. Flood Fill", 
      "934. Shortest Bridge",
    ],
    dispatch
  );
  //

  const GraphProblems = constructProblemDropdown(
    [
      "797. All Paths from Source to Target",
      "1129. Shortest Path with Alternating Colors"
    ],
    dispatch
  );

  const handleGridProblemChange = (
    event: SelectChangeEvent
  ) => {
    setCurrentGridProblem(event.target.value);
    let num = parseInt(event.target.value);
    clearState(dispatch, num);
  }

  const handleGraphProblemChange = (
    event: SelectChangeEvent
  ) => {
    setCurrentGraphProblem(event.target.value);
    let num = parseInt(event.target.value)
    clearState(dispatch, num);
  }

  return (
    <div className="App">
      <div id="navBarDiv">
        <Navbar style={{"backgroundColor": "rgb(200, 200, 200)"}}>
          <FormControl sx={{m: 1, minWidth: 200}} className="problems_form_control">
            <InputLabel id="grid_dropdown_select">Grid Problems</InputLabel>
            <Select labelId="grid_dropdown_select"
              defaultValue=''
              id="grid_dropdown"
              value={currentGridProblem}
              label={"Grid Problems"}
              onChange={handleGridProblemChange}
            >
              {GridProblems.map((problem, idx) => (
                <MenuItem key={problem.title} value={problem.problemNumber}>{problem.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{m: 1, minWidth: 200}} className="problems_form_control">
            <InputLabel id="graph_dropdown_select">Graph Problems</InputLabel>
            <Select labelId="graph_dropdown_select"
              id="graph_dropdown"
              value={currentGraphProblem}
              label={"Graph Problems"}
              onChange={handleGraphProblemChange}
            >
              {GraphProblems.map((problem, idx) => (
                <MenuItem key={problem.title} value={problem.problemNumber}>{problem.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Navbar>
      </div>
      <Main> {/*sdfsdfsfs*/}
        <ResizeContainer style={{overflow: "auto", position: "relative", height: `${height}px`}}>
          <Section 
            innerRef={leftSectionRef} 
            className={"left_section"} 
            minSize={100}
          >
            <Controls />
          </Section>
          <Bar size={10} style={{ background: '#738228', cursor: 'col-resize' }} />
          <Section innerRef={rightSectionRef} 
            onSizeChanged={() => {
              if (rightSectionRef.current) {
                setRightWidth(rightSectionRef.current?.clientWidth);
              }
            }}
            style={{ 
              background: 'rgb(240, 240, 240)', 
              overflow: "auto",
            }} 
            minSize={100}
          >
            <DataStructureDisplay rightWidth={rightWidth}/>
          </Section>
        </ResizeContainer>
      </Main>    
    </div>
  );
}

export default App;
