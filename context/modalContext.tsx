import { createContext, useContext, useReducer, Dispatch } from 'react'

import { TModalAction } from 'constants/modal'

type TModal = {
  name: string
  data?: any
  hideCard?: boolean
  handleOk?: (...args: any) => any
}
type TAction =
  | (TModal & {
      type: TModalAction.PUSH
    })
  | { type: TModalAction.POP }
  | { type: TModalAction.RESET }
interface Props {
  children: React.ReactNode
}

const ModalsContext = createContext<typeof initialModals>([])
const ModalsDispatchContext = createContext<unknown>(null)

export function ModalsProvider({ children }: Props) {
  const [modals, dispatch] = useReducer(modalsReducer, initialModals)
  return (
    <ModalsContext.Provider value={modals}>
      <ModalsDispatchContext.Provider value={dispatch}>
        {children}
      </ModalsDispatchContext.Provider>
    </ModalsContext.Provider>
  )
}

export function useModal() {
  return useContext(ModalsContext)
}

export function useModalDispatch() {
  return useContext(ModalsDispatchContext) as Dispatch<TAction>
}

function modalsReducer(
  modals: typeof initialModals = [],
  action?: TAction
): TModal[] {
  switch (action?.type) {
    case TModalAction.PUSH: {
      if (!action?.name) return modals
      const newModal = {
        name: action.name,
        data: action?.data,
        handleOk: action.handleOk,
        hideCard: action?.hideCard,
      } as TModal
      return [...modals, newModal]
    }
    case TModalAction.POP: {
      return modals?.length > 0 ? [...modals].slice(0, -1) : modals
    }
    case TModalAction.RESET: {
      return []
    }
    default: {
      throw Error('Unknown action: ' + action)
    }
  }
}

const initialModals: TModal[] = [] as TModal[]
