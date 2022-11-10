import { configureStore } from "@reduxjs/toolkit";
//import { changeCell, changeCellSize, changeHeight, changeLabel, changeWidth, clearCells, grid } from "./grid/gridSlice";

import { 
    totalStructsReducer 
} from "./totalStructs/totalStructsSlice";
import {
    arraysReducer
} from "./arrays/arraysSlice"
import {
    gridsReducer
} from "./grids/gridsSlice"

export const store = configureStore({
    reducer: {
        arrays: arraysReducer,
        grids: gridsReducer,
        totalStructs: totalStructsReducer
    },
    devTools: true, 
})

//Types the specific dispatch we expect from our store
export type AppDispatch = typeof store.dispatch;
//export type AppGetState = typeof store.getState