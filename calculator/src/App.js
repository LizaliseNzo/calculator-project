import { useReducer } from "react";
import "./styles.css"
import OperationButton from "./operationButton";
import DigitButton from "./DigitButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return{
          ...state,
          CurrentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.CurrentOperand === "0") return state
     
      if (payload.digit === "." && state.CurrentOperand.includes(".")) return state


      return {
        ...state,
        CurrentOperand: `${state.CurrentOperand || ""}${payload.digit}`,
  }
  case ACTIONS.CHOOSE_OPERATION:
    if (state.CurrentOperand== null && state.previousoperand == null){
      return state
    }

     if (state.CurrentOperand == null){
      return {...state,
      operation: payload.operation,
     }
    }



    if (state.previousoperand == null){
    return{
      ...state,
      operation: payload.operation,
      previousoperand: state.CurrentOperand,
      CurrentOperand: null,
      }
    }
    return{
      ...state,
    previousoperand: evaluate (state),
    operation: payload.operation,
    CurrentOperand: null,
  }
  

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.CurrentOperand == null || state.previousoperand == null ){
        return state
      }
      return{
        ...state,
        overwrite: true,
        previousoperand: null,
        operation: null,
        CurrentOperand: evaluate(state)
      }
      case ACTIONS.CLEAR:
      return{}
  
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite) {
          return {
            ...state,
            overwrite: false,
            CurrentOperand: null
  
        }
      }
      if (state.CurrentOperand == null) return state
      if (state.CurrentOperand.length === 1){
        return {...state, CurrentOperand: null}
      }
      return{
        ...state,
        CurrentOperand: state.CurrentOperand.slice(0, -1)
      }
      case ACTIONS.EVALUATE:
    }

}

function evaluate({ CurrentOperand, previousoperand, operation}) {
  const prev = parseFloat(previousoperand)
  const Current = parseFloat(CurrentOperand)
  if (isNaN(prev) || isNaN(Current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + Current
      break
      case "-":
        computation = prev - Current
        break
      case "*":
        computation = prev * Current
        break
      case "÷":
        computation = prev / Current
        break
  }
  return computation.toString()
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  
  const[{CurrentOperand, previousoperand, operation}, dispatch ] =useReducer(reducer, {})


  
  return (
    <div className="Calculator-grid">
      <div className= "output">
      <div className="previous-operand">{formatOperand(previousoperand)} {operation} </div>
      <div className="Current-Operand">{formatOperand(CurrentOperand)}</div>
       </div>
       <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  )
}

export default App;
