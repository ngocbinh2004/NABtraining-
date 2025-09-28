import { useEffect } from 'react'

export function useOverflowBody({ hideOverflow }: { hideOverflow: boolean }) {
  useEffect(() => {
    // remove scroll on modal opened
    document.body.style.overflow = hideOverflow ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [hideOverflow])
}
