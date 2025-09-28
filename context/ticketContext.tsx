import { createContext, useContext, useReducer, Dispatch } from 'react'

const TicketsContext = createContext<number[] | null>(null)

const TicketsDispatchContext = createContext<unknown>(null)

interface Props {
  children: React.ReactNode
}

export function TicketsProvider({ children }: Props) {
  const [tickets, dispatch] = useReducer(ticketsReducer, initialTickets)

  return (
    <TicketsContext.Provider value={tickets}>
      <TicketsDispatchContext.Provider value={dispatch}>
        {children}
      </TicketsDispatchContext.Provider>
    </TicketsContext.Provider>
  )
}

export function useTicket() {
  return useContext(TicketsContext)
}

export function useTicketDispatch() {
  return useContext(TicketsDispatchContext) as Dispatch<{
    id?: number | number[]
    type: 'added' | 'deleted' | 'updated' | 'reset'
  }>
}

function ticketsReducer(
  tickets: number[],
  action: {
    id?: number | number[]
    type: 'added' | 'deleted' | 'updated' | 'reset'
  }
) {
  switch (action.type) {
    case 'added': {
      if (Array.isArray(action.id) || !action.id) return tickets
      return Array.from(new Set([...tickets, action.id]))
    }
    case 'deleted': {
      if (Array.isArray(action.id) || !action.id) return tickets
      return tickets.length > 0
        ? tickets.filter((t: number) => t !== action.id)
        : tickets
    }
    case 'updated': {
      if (!action.id) return tickets
      return Array.isArray(action.id) ? [...action.id] : []
    }
    case 'reset': {
      return []
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

const initialTickets: number[] = []
