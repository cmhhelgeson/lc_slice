import React, {useState, useCallback, useEffect, useRef} from "react"
import {GraphNode} from "./GraphNode"
import {useImmer} from "use-immer"
import { MotionStyle } from "framer-motion"

type XY = {
    x: number,
    y: number
}

//Needed for edges as I understand it
type Node<T> = {
    x: number,
    y: number, 
    ix: number, 
    iy: number,
    radius: number,
    links: T[],
}


type GraphNodeState = {
    hasMoved: boolean,
    isInFront: boolean,
    isBeingDragged: boolean,
    originalEventTarget: EventTarget | null,
    node: Node<any>,
    moveStartX: number,
    moveStartY: number,
    moveStartObject: XY,
    onMouseUpCallback: (this: any, event: MouseEvent) => any,
    onMouseMoveCallback: (this: any, event: MouseEvent) => any,
}

export type GraphProps = {
    width: number,
}

const parseTranslateString = (str: string) => {
    
}

export const Graph = ({width}: GraphProps) => {

    const [svgWidth, setSvgWidth] = useState<number>(width);
    const [svgHeight, setSvgHeight] = useState<number>(450.0);

    useEffect(() => {
        setSvgWidth(width);
    }, [width])

    //Ref of the entire graph
    const graphSVGRef = useRef<SVGSVGElement>(null);
    //Forwareded ref from GraphNodeObject
    const graphNodeRef = useRef<SVGGElement>(null);
    //We separate the state of the node from its reference, which might need to be changed in the future

    const moveStart = useRef<{
        x: number,
        y: number
    }>({x: 0, y: 0});
    const moveStartObject = useRef<{
        x: number,
        y: number
    }>({x: 0, y: 0});
    const [graphNodeState, updateGraphNodeState] = useImmer<GraphNodeState>({
        hasMoved : false,
        isInFront: false,
        isBeingDragged: false,
        originalEventTarget: null,
        //Where mouse starts when onmousedown set
        moveStartX: 0,
        moveStartY: 0,
        //Where the object starts
        moveStartObject: {
            x: 200,
            y: 200,
        },
        node: {
            x: 200,
            y: 200,
            ix: 200,
            iy: 200,
            radius: 20,
            links: []
        },
        onMouseMoveCallback: (event: MouseEvent) => {
            updateGraphNodeState(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseMove(event);
        },
        onMouseUpCallback: (event: MouseEvent) => {
            updateGraphNodeState(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseUp(event);
        },
    })


    const startMove = (x: number, y: number) => {
        //Certain fields are not yet populated but will be when the callback is first called
        console.log("startMove");
        console.log(x, y);
        updateGraphNodeState(state => {state.moveStartX = x});
        updateGraphNodeState(state => {state.moveStartY = y});
        moveStart.current.x = x;
        moveStart.current.y = y;
        updateGraphNodeState(state => {state.moveStartObject.x = state.node.x});
        updateGraphNodeState(state => {state.moveStartObject.y = state.node.y});
        moveStartObject.current.x = graphNodeState.node.x;
        moveStartObject.current.y = graphNodeState.node.y;
        updateGraphNodeState(state => {state.hasMoved = false});
        updateGraphNodeState(state => {state.isInFront = false});
        updateGraphNodeState(state => {state.isBeingDragged = true});
        updateGraphNodeState(state => {state.originalEventTarget = null});
    }

    const moveNodeOnMouseMove = useCallback( (e: MouseEvent) => {
        console.log("Mouse move on node")
        updateGraphNodeState(state => {
            state.isBeingDragged = true;
        })
        //If mouse down has not been set

        //Set svgWidth if it has not yet been set
        if (graphSVGRef.current !== null) {
            setSvgWidth(graphSVGRef.current.clientWidth);
            setSvgHeight(graphSVGRef.current.clientHeight);
        }

        //Get new mouse coordinates
        const newMouseX = e.clientX;
        const newMouseY = e.clientY;
        updateGraphNodeState(state => {state.originalEventTarget = null});

        //If the mouse has moved from its starting position at mouse down
        if (newMouseX !== moveStart.current.x || newMouseY !== moveStart.current.y) {
            //Indicate that the mouse has indeed moved
            updateGraphNodeState(state => {state.hasMoved = true})
        }

        let currentSVGRect = graphSVGRef.current?.getBoundingClientRect();
        let currentSVGTopY = currentSVGRect?.top;
        let currentSVGLeftX = currentSVGRect?.left;

        //Where are the current svg coordinates
        console.log("SVG (X, Y) COORDS");
        console.log(currentSVGLeftX, currentSVGTopY);

        //Where did the mouse start
        console.log("Mouse starting coordinates");
        console.log(moveStart.current.x, moveStart.current.y);

        //Where is the mouse position
        console.log("Mouse (X, Y) COORDS");
        console.log(newMouseX, newMouseY)

        //Where did the move start on the node
        console.log("Object at start of move (x, y)");
        console.log(moveStartObject.current.x, moveStartObject.current.y)

        //Create new values first since setState/Immer will not update synchronously
        //However, our ref will need to be updated synchronously
        let newNodePosX = 
            //(currentSVGLeftX ? currentSVGLeftX : 0) +
            moveStartObject.current.x + 
            newMouseX - 
            moveStart.current.x
        ;


        console.log("New Node Position X:")
        console.log(newNodePosX);

        let newNodePosY = 
            //(currentSVGTopY ? currentSVGTopY : 0) +
            moveStartObject.current.y +
            newMouseY - 
            moveStart.current.y
        ;

        console.log("New Node Position Y:")
        console.log(newNodePosY);

        let nodeRadius = graphNodeState.node.radius;


        //Move the node to where the node object lay + (new position of mouse - where the mouse started)
        updateGraphNodeState(state => {state.node.x = newNodePosX});
        updateGraphNodeState(state => {state.node.y = newNodePosY});
        //If the new position of the node goes off screen left
        //TODO: GET RID OF COMMENTED OFF SCREEN EDGE CASES ONCE REGULAR DRAGGING IS WORKING PROPERLY
        /*if (graphNodeState.node.x < nodeRadius / 2.0) {
            console.log("off screen")
            newNodePosX = nodeRadius / 2.0
            updateGraphNodeState(state => {state.node.x = newNodePosX});
        //Else if it goes off screen right
        } else if (graphNodeState.node.x + nodeRadius / 2.0 > svgWidth) {
            console.log("off screen right")
            newNodePosX = svgWidth - nodeRadius / 2.0;
            updateGraphNodeState(state => {state.node.x = newNodePosX});
        }

        //If the new position of the node goes off screen top
        if (graphNodeState.node.y < nodeRadius / 2.0) {
            newNodePosY = nodeRadius / 2.0
            updateGraphNodeState(state => {state.node.y = newNodePosY});
        //Else if it goes off screen bottom
        } else if (graphNodeState.node.y + nodeRadius / 2.0 > svgHeight) {
            newNodePosY = svgHeight - nodeRadius / 2.0
            updateGraphNodeState(state => {state.node.y = newNodePosY});
        } */

        //TODO: 
        //Finally after the position has been fully updated, update the ref
        let prevIX = graphNodeState.node.ix;
        let prevIY = graphNodeState.node.iy;
        console.log(prevIX);
        let x = newNodePosX - prevIX;
        let y = newNodePosY - prevIY;

        console.log("Translate (x, y)")
        console.log(x, y);
        graphNodeRef.current?.setAttribute("transform", "translate(" + (x) + "," + (y) + ")")
        return false;
    }, [width])

    const moveNodeOnMouseUp = (e: MouseEvent) => {
        console.log("Mouse up on node")
        //Node is no longer being dragged
        updateGraphNodeState(state => {state.isBeingDragged = false});
        graphNodeRef.current?.getAttribute("transform");

        document.removeEventListener("mousemove", graphNodeState.onMouseMoveCallback, false);
        document.removeEventListener("mouseup", graphNodeState.onMouseUpCallback, false);
        return false;
    }

    //TODO: Mouse Event or React.MouseEvent
    const moveNodeOnMouseDown = (e: MouseEvent) => {
        console.log("Mouse down on node")
        startMove(e.clientX, e.clientY);
        document.addEventListener("mousemove", graphNodeState.onMouseMoveCallback, false);
        document.addEventListener("mouseup", graphNodeState.onMouseUpCallback, false);
        return false;
    }

    const setMovableGraphNode = () => {
        //Do nothing if the ref is null
        if (graphNodeRef.current !== null) {
            //Node has not yet moved

            //NOTE ABOUT HANDLERS
            //ref.onmousedown will reset all handlers associated with onmousedown
            //addEventListener allows you to add multiple onmousedown handler
            //Note if onmousedown has more than one handler so we can refactor accordingly
            graphNodeRef.current.onmousedown = moveNodeOnMouseDown
            /*updateGraphNodeState(state => {
                state.onMouseMoveCallback = (event: MouseEvent) => {
                    updateGraphNodeState(state => state.originalEventTarget = event.currentTarget);
                    return moveNodeOnMouseMove(event);
                }
            })
            updateGraphNodeState(state => {
                state.onMouseUpCallback = (event: MouseEvent) => {
                    updateGraphNodeState(state => state.originalEventTarget = event.currentTarget);
                    return moveNodeOnMouseUp(event);
                }
            }) */
        } else{
            return;
        }
        
    }


    useEffect(() => {
        if (graphSVGRef.current === null) {
            return;
        }
        //Set correct width and height once graphsvg has been found
        let svgDimensions = graphSVGRef.current.getBoundingClientRect();
        setSvgWidth(svgDimensions.width);
        setSvgHeight(svgDimensions.height);
        //Make the Graph Node Movable...will eventually take an index to indicate which node
        if (graphNodeRef.current) {
            setMovableGraphNode();
            graphNodeRef.current.addEventListener("click", () => {
                console.log("clicked");
            })
        }
        
    }, [graphSVGRef, graphNodeRef])


    return (
        <div>
            <svg 
                ref={graphSVGRef} 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink={"http://www.w3.org/1999/xlink"} 
                className="notselectable nwlinkhovertoggle" 
                height="900" id="svg_network_image" width={width} style={{verticalAlign: "top"}}>
                <g id="nodes">
                    <defs>
                        <filter id="filter_shadow">
                            <feGaussianBlur stdDeviation="1"/>
                        </filter>
                    </defs>
                    <defs>
                        <filter height="200%" id="filter_bg_text" width="200%" x="-50%" y="-50%">
                            <feGaussianBlur stdDeviation="1.8"/>
                        </filter>
                    </defs>

                    <GraphNode startX={200} startY={200} radius={20} ref={graphNodeRef} />
                </g>
            </svg>     
        </div>
    );
}