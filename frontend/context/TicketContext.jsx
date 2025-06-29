import { createContext, useReducer } from "react";


export const TicketContext = createContext()


export const TicketReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TICKETS':
        return {
            ...state,
            tickets: action.payload
        };
        case 'ADD_TICKET':
        return {
            ...state,
            tickets: [...state.tickets, action.payload]
        };
        case 'REMOVE_TICKET':
        return {
            ...state,
            tickets: state.tickets.filter(ticket => ticket.id !== action.payload)
        };
        default:
        return state;
    }
}



export const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TicketReducer, {
    tickets: null
  })

  return (
    <TicketContext.Provider value={{...state, dispatch }}>
      {children}
    </TicketContext.Provider>
  )
}