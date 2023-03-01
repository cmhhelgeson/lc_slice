import React, { useRef, useEffect, useMemo, useState} from "react";
import * as d3 from "d3";
import { curveMonotoneX } from "d3";
import { extent } from "d3";
import "./sdg.scss"



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
  xLabel: string,
}


//https://www.probabilitycourse.com/chapter4/4_2_3_normal.php

const generateProbabilityDensityData = (
  lowEnd: number,
  highEnd: number,
  meanValue: number, 
  standardDeviation: number,
  fidelity: number,
): [number, number][] => {
  const span = highEnd - lowEnd;
  console.log(`span is ${span}`)
  const data: [number, number][] = [];
  for (let i = 0; i < fidelity; i++) {
    const xStep = lowEnd + (span * i/fidelity);
    // Espoused formula for PDF
    //const eExponent = ((xStep - meanValue) ** 2) * -1;
    //const numerator = (Math.E ** eExponent) / (2 * (standardDeviation **2));
    //const denominator = standardDeviation * Math.sqrt(2 * Math.PI);
    //const yStep = numerator/denominator;
    // Espoused Formula for CDF
    const eExponent = ((xStep ** 2) / 2) * - 1;
    const yStep = (Math.E ** eExponent) / Math.sqrt(2 * Math.PI);
    data.push([xStep, yStep]);
  }
  return data;
}



const getTicks = (count: number, max: number) => {
  return [...Array(count).keys()].map(d => {
    return (max / (count - 1) * d).toFixed(2);
  });
}

export const StandardDistributionGraph = ({
  mean, 
  standardDeviation, 
  fidelity, 
  xLabel
}: SDGProps) => {
  const cachedData: [number, number][] = useMemo(() => {
    const low = mean - (4 * standardDeviation);
    const high = mean + (4 * standardDeviation);
    return generateProbabilityDensityData(low, high, mean, standardDeviation, fidelity);
  }, [mean, standardDeviation]);


  const width = 500;
  const height = 300;

  
  const TICK_COUNT = 6;

  let MAX_X = cachedData[cachedData.length - 1][0];
  let MAX_Y = Math.max(...cachedData.map(d => d[1]));

  let getPixelX = (val: number) => val / MAX_X * width;
  let getPixelY = (val: number) => val / MAX_Y * height;

  let x_ticks = getTicks(TICK_COUNT, MAX_X);
  let y_ticks = getTicks(TICK_COUNT, MAX_Y).reverse();

  let d = `
    M${getPixelX(cachedData[0][0])} ${getPixelY(cachedData[0][1])}
    ${cachedData.slice(1).map(d => {
      return `L${getPixelX(d[0])} ${getPixelY(d[1])}`
    }).join(' ')}
  `;

  return (
    <div className="line_chart" 
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      <svg className="line_chart_svg" width={width} height={height}>
        <path d={d} />
      </svg>
      <div className="x-axis">
        {x_ticks.map(v => <div data-value={v}/>)}
      </div>
      <div className="y-axis">
        {y_ticks.map(v => <div data-value={v}/>)}
      </div>
    </div>
  );
}

/*export const StandardDistributionGraph = ({mean, standardDeviation, fidelity, xLabel}: SDGProps) => {
  const cachedData: [number, number][] = useMemo(() => {
    const low = mean - (4 * standardDeviation);
    const high = mean + (4 * standardDeviation);
    return generateProbabilityDensityData(low, high, mean, standardDeviation, fidelity);
  }, [mean, standardDeviation]);

  let dummyData: number[][] = [
    [0, 10],
    [5, 50],
    [15, 75],
    [55, 100],
    [75, 10],
    [100, 5]
  ]

  let xScale = d3
    .scaleLinear()
    .domain(extent(dummyData.map((data) => data[0]), d=
    .range([0, 300])

  let line = d3.line()
    .x((d) => xScale(d[0]))
    .y(d => 300 - d[1])
    .curve(curveMonotoneX)
  let d = line(cachedData);


  return */

  /*return (
    <div style={{display: "flex", "justifyContent": "center", "width": "100%", height: "100%"}}>
      <svg width={"300"} height={"300"} viewBox="0 0 300 300">
        <path d={d ? d : undefined} fill="none" stroke="black"></path>
      </svg>
    </div>
  ) 
} */

/*const margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  }

  const parentWidth = 500;
  const parentHeight = 200;
  const width = parentWidth - margins.left - margins.right;
  const height = parentHeight - margins.top - margins.bottom;

  const ticks = 6;

  const xScale = d3.scaleLinear()
    .domain(cachedData.map(data => data.x))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(cachedData.map(data => data.y))
    .range([0, height]);

  const lineGenerator = d3.line()
    .x(data => {
      console.log(data)
      return xScale(data[0])
    })
    .y(data => {
      console.log(data)
      return yScale(data[1])
    })
    .curve(curveMonotoneX);

  return (
    <div className="sdg_container">
      <svg 
        className="standard_deviation_svg"
        width={width + margins.left + margins.right}
        height={height + margins.top + margins.bottom}
      >
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <XYAxis {...{xScale, yScale, height, ticks}}/>

        </g>
      </svg>
    </div>
  ) */