import React, { useRef, useEffect, useMemo} from "react";
import * as d3 from "d3";

export const useD3 = (renderChartFn: any, dependencies: any) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => {};
  }, dependencies)
  return ref;
}

type DataType = {
  x: number, y: number
}

type SDGProps = {
  mean: number, 
  standardDeviation: number,
  fidelity: number,
}


//https://www.probabilitycourse.com/chapter4/4_2_3_normal.php

const generateProbabilityDensityData = (
  lowEnd: number,
  highEnd: number,
  meanValue: number, 
  standardDeviation: number,
  fidelity: number,
) => {
  const data: DataType[] = [];
  const span = highEnd - lowEnd;
  for (let i = 0; i < fidelity; i++) {
    const xStep = lowEnd + (span * i/fidelity);
    //Using JSTAT implementation, which seems to employ magic math,
    //Will put alternate formulas above as I understand more about problem
    const yStep = Math.exp(-0.5 * Math.log(2 * Math.PI) - Math.log(standardDeviation) - Math.pow(xStep - meanValue, 2) / (2 * standardDeviation * standardDeviation));
    data.push({x: xStep, y: yStep});
  }
  return data;
}


const StandardDistributionGraph = ({mean, standardDeviation, fidelity}: SDGProps) => {
  const cachedData: DataType[] = useMemo(() => {
    const low = mean - (4 * standardDeviation);
    const high = mean + (4 * standardDeviation);
    return generateProbabilityDensityData(low, high, mean, standardDeviation, fidelity);
  }, [mean, standardDeviation]);

  const ref = useD3(
    (svg: SVGSVGElement) => {
      const height = 500;
      const width = 500;
      const margin = {top: 20, right: 30, bottom: 30, left: 40 }
      

      const x = d3
        .scaleLinear()
        .domain(cachedData.map(data => data.x))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain(cachedData.map(data => data.y))
        .range([0, height]);

      const xAxis = (g) => {
        g.attr("transform", `translate`)

      }
      
      


    }, [cachedData.length]
  );


  )


  return (
    <svg style={{height: 500, width: "100%", marginRight: "0px", marginLeft: "0px"}}>
      <g className="graph_plot"/>
      <g className="x-axis"/>
      <g className="y-axis"/>
    </svg>
  )
}