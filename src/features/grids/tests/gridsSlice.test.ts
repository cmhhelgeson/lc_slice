import { copyGrid, deleteGrid } from "../../sharedActions"
import {store} from "../../store"
import {GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, GRID_733_FLOOD_FILL} from "../defaultGrids"
import { changeGridHeight, changeGridWidth, clearGridCells, copyGrids } from "../gridsSlice"


beforeEach(async () => {
    const grids = store.getState().grids;
    let length = grids.length;
    let result = await store.dispatch(deleteGrid({num: length}));
})

describe('gridsSlice redux state tests', () => {
    test('if initial state is empty', () => {
        const grids = store.getState().grids
        expect(grids).toEqual([]);
    })

    test('if copyGrid works', async () => {
        const result = await store.dispatch(copyGrid({
            cells: GRID_417_PACIFIC_ATLANTIC_WATER_FLOW
        }))
        expect(result.type).toEqual("copyGrid")
        const grids = store.getState().grids
        //eslint-disable-next-line
        expect(grids[0]).not.toBeUndefined();
        for (let i = 0; i < grids[0].cells.length; i++) {
            for (let j = 0; j < grids[0].cells[0].length; j++) {
                expect(grids[0].cells[i][j].data).toEqual(
                    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW[i][j].data
                )
                expect(grids[0].cells[i][j].status).toEqual(
                    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW[i][j].status
                )
            }
        }
    })


    test('if changeWidth works when adding columns', async () => {
        let result = await store.dispatch(copyGrids([
            GRID_733_FLOOD_FILL
        ]))
        const grids = store.getState().grids;
        //Do grids exist
        expect(grids[0]).not.toBeUndefined();
        //Does actual width and height match stored width
        expect(grids[0].cells[0].length).toEqual(5);
        expect(grids[0].width).toEqual(5);
        //Dispatch add columns:
        let resultChangeWidth = store.dispatch(changeGridWidth({gridIndex: 0, newWidth: 10}));
        //Type of action is sound
        expect(resultChangeWidth.type).toEqual("grids/changeGridWidth");
        //Get new state
        const gridZero = store.getState().grids[0];
        //Check if height does not change
        expect(gridZero.height).toEqual(5);
        expect(gridZero.cells.length).toEqual(5);
        //Check if adding columns works
        expect(gridZero.width).toEqual(10);
        expect(gridZero.cells[0].length).toEqual(10);
        //TODO: Check that default value works
    })

    test('if changeWidth remove columns works', async () => {
        let result = await store.dispatch(copyGrids([
            GRID_733_FLOOD_FILL
        ]))
        const grids = store.getState().grids;
        //Do grids exist
        expect(grids[0]).not.toBeUndefined();
        //Does actual width and height match stored width
        expect(grids[0].cells[0].length).toEqual(5);
        expect(grids[0].width).toEqual(5);
        //Dispatch add columns:
        //Dispatch remove columns:
        let resultChangeWidth = await store.dispatch(changeGridWidth({gridIndex: 0, newWidth: 3}));
        //Type of action is sound
        expect(resultChangeWidth.type).toEqual("grids/changeGridWidth");
        //Get new state
        const gridOne = store.getState().grids[0];
        //Check if height does not change
        expect(gridOne.height).toEqual(5);
        expect(gridOne.cells.length).toEqual(5);
        //Check if removing columns works
        expect(gridOne.width).toEqual(3);
        expect(gridOne.cells[0].length).toEqual(3);
        //TODO: Check that default value works
    })

    test("if changeHeight works adding rows", async () => {
        let result = await store.dispatch(copyGrids([
            GRID_733_FLOOD_FILL
        ]))
        const grids = store.getState().grids;
        //Do grids exist
        expect(grids[0]).not.toBeUndefined();
        //Does actual height match stored height
        expect(grids[0].cells.length).toEqual(5);
        expect(grids[0].height).toEqual(5);
        //Dispatch add rows:
        let resultChangeWidth = await store.dispatch(changeGridHeight({gridIndex: 0, newHeight: 10}));
        //Type of action is sound
        expect(resultChangeWidth.type).toEqual("grids/changeGridHeight");
        //Get new state
        const gridZero = store.getState().grids[0];
        //Check if width does not change
        expect(gridZero.width).toEqual(5);
        expect(gridZero.cells[0].length).toEqual(5);
        //Check if adding rows works
        expect(gridZero.height).toEqual(10);
        expect(gridZero.cells.length).toEqual(10);
    })

    test("if changeHeight new rows have proper default values", async () => {
        //Setup
        let result = await store.dispatch(copyGrids([
            GRID_733_FLOOD_FILL
        ]))
        let resultChangeWidth = await store.dispatch(changeGridHeight({gridIndex: 0, newHeight: 6}));
        //Type of action is sound
        expect(resultChangeWidth.type).toEqual("grids/changeGridHeight");
        //Get new state
        const gridZero = store.getState().grids[0];
        //Height is sound
        expect(gridZero.height).toEqual(6);
        expect(gridZero.cells.length).toEqual(6);
        //Iterate through new row
        for (let i = 0; i < gridZero.width; i++) {
            //eslint-disable-nextline
            expect(gridZero.cells[gridZero.height - 1][i].data).toEqual(0);
            expect(gridZero.cells[gridZero.height - 1][i].status).toEqual("UNEXPLORED");
        }
    })

    test("if changeHeight new rows have proper defined values", async () => {
        //Setup
        let result = await store.dispatch(copyGrids([
            GRID_733_FLOOD_FILL
        ]))
        let resultChangeWidth = await store.dispatch(changeGridHeight({
            gridIndex: 0,
            newHeight: 6,
            defaultStatus: "DEEP_OCEAN",
            defaultValue: 20
        }));
        //Type of action is sound
        expect(resultChangeWidth.type).toEqual("grids/changeGridHeight");
        //Get new state
        const gridZero = store.getState().grids[0];
        //Height is sound
        expect(gridZero.height).toEqual(6);
        expect(gridZero.cells.length).toEqual(6);
        //Iterate through new row
        for (let i = 0; i < gridZero.width; i++) {
            //eslint-disable-nextline
            expect(gridZero.cells[gridZero.height - 1][i].data).toEqual(20);
            expect(gridZero.cells[gridZero.height - 1][i].status).toEqual("DEEP_OCEAN");
        }
    })

    test("if changeHeight works removing rows", async () => {
        let result = await store.dispatch(copyGrids([
            GRID_733_FLOOD_FILL
        ]))
        const grids = store.getState().grids;
        //Do grids exist
        expect(grids[0]).not.toBeUndefined();
        //Does actual height match stored height
        expect(grids[0].cells.length).toEqual(5);
        expect(grids[0].height).toEqual(5);
        //Dispatch add rows:
        let resultChangeWidth = await store.dispatch(changeGridHeight({gridIndex: 0, newHeight: 3}));
        //Type of action is sound
        expect(resultChangeWidth.type).toEqual("grids/changeGridHeight");
        //Get new state
        const gridZero = store.getState().grids[0];
        //Check if width does not change
        expect(gridZero.width).toEqual(5);
        expect(gridZero.cells[0].length).toEqual(5);
        //Check if adding rows works
        expect(gridZero.height).toEqual(3);
        expect(gridZero.cells.length).toEqual(3);
    })

    test("if clearGridCells works with defaultValues", async() => {
        let result = await store.dispatch(copyGrids([
            GRID_417_PACIFIC_ATLANTIC_WATER_FLOW
        ]))
        let resultTwo = await store.dispatch(clearGridCells({
            gridIndex: 0,
        }))
        expect(resultTwo.type).toEqual("grids/clearGridCells");
        const gridZero = store.getState().grids[0];
        for (let i = 0; i < gridZero.height; i++) {
            for (let j = 0; j < gridZero.width; j++) {
                expect(gridZero.cells[i][j].data).toEqual(0);
                expect(gridZero.cells[i][j].status).toEqual("UNEXPLORED");
            }
        }
    })

    test("if clearGridCells works with defined values", async() => {
        let result = await store.dispatch(copyGrids([
            GRID_417_PACIFIC_ATLANTIC_WATER_FLOW
        ]))
        let resultTwo = await store.dispatch(clearGridCells({
            gridIndex: 0,
            defaultStatus: "DEEP_OCEAN",
            defaultValue: 20,
        }))
        expect(resultTwo.type).toEqual("grids/clearGridCells");
        const gridZero = store.getState().grids[0];
        for (let i = 0; i < gridZero.height; i++) {
            for (let j = 0; j < gridZero.width; j++) {
                expect(gridZero.cells[i][j].data).toEqual(20);
                expect(gridZero.cells[i][j].status).toEqual("DEEP_OCEAN");
            }
        }
    })
})