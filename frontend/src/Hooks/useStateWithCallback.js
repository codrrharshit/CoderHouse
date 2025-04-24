import { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback=(intitialState)=>{
    const [state,setState]=useState(intitialState);
    const cbRef=useRef(null);
    const updateState=useCallback((newState,cb)=>{
        cbRef.current=cb;
        setState((prev)=>{
            if(typeof newState==='function'){
                return newState(prev);
            }
            return newState;
        })

    },[])
    useEffect(()=>{
        if(cbRef.current){
            cbRef.current(state);
            cbRef.current=null;
        }
    },[state])

    return [state,updateState];

}
