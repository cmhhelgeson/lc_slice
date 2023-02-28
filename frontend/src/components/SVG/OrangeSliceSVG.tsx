import React from "react"

type OrangeSliceSVGProps = {
  size: number,
  rotate?: number,
  position?: "relative" | "absolute",
  top?: number,
  left?: number
  opacity: number,
}

export const OrangeSliceSVG = ({size, rotate, position, top, left, opacity}: OrangeSliceSVGProps) => {
    return (
      <div 
        className="orange_slice_svg"
        style={{
          transform: rotate ? `rotateZ(${rotate}deg)` : `rotateZ(0deg)`, 
          position: position ? position : "relative",
          top: top ? `${top}px` : `0px`,
          left: left ? `${left}px` : `0px`,
          opacity: opacity,
        }}
      > 
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={"0 0 512 512"}
        >
          <path d="M471.5 65.72c-10.5 4.91-21.1 9.87-31.6 14.89C481.8 196.7 438.8 314.5 358 373.4c-41.8 30.5-93.9 45.2-148.9 35.5-53.8-9.6-110.07-42.6-162.13-105.3-8.53 5.8-17.06 11.6-25.58 17.5 11.95 16.1 45.31 57.4 96.01 88.6 63.7 39.3 151.2 61.2 256.3-9.8 93.5-63.2 116.5-148.2 116.9-218.6.3-53-12.6-97.01-19.1-115.58zm-47.9 22.72c-62.3 20.36-103.9 43.76-147.3 71.06-2.4 2 .2 8.4 5.9 8.1l155.9 6.2c.2-27.7-4.4-56.5-14.5-85.36zm-39 44.36l3.4 17.6-40.3 7.9-3.4-17.6zm-98.8 53c-7.4.1-11.1 7-4.8 15.3l119.5 101c20.4-31.7 33.6-69.6 36.8-110.3zm37.8 12.6l37.1 13.8-6.2 16.8-37.1-13.8zm-115.4 4.9c-.9 0-1.9.3-3 .9-47.8 27.9-100.4 56-143.18 89.3 30.54 36.6 61.98 61.8 93.08 77.9l58.7-156.2c3-4.6-.4-12-5.6-11.9zm56.2 9.4c-5.3 0-8.7 6.7-8 8.6l44.8 162.3c16.4-6 31.9-14.4 46.2-24.8 15.9-11.6 30.3-25.8 42.6-41.9L269.1 214.5c-1.7-1.3-3.3-1.8-4.7-1.8zm-30.7 7c-1.2.1-2.5 1-3.6 3.5L171.4 379c13.8 5.7 27.5 9.7 40.9 12.1 24.9 4.4 49 3.4 71.7-2.2l-45.4-164.6c-.8-2.2-2.8-4.6-4.9-4.6zm-64.9 24.8l13.8 11.6-32.9 38.7-13.8-11.6zm130.6 17.3l21.2 26.5-14 11.2-21.2-26.5zM220.8 286l18 .6-1.6 42.5-18-.6z"></path>
        </svg>
      </div>
      );

}