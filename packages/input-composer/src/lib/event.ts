/* TODO: extract into @hmans/things */

export type Event<P = void> = ReturnType<typeof createEvent<P>>

export type Listener<P> = (payload: P) => void

export const createEvent = <P = void>() => {
  const listeners = new Set<Listener<P>>()

  const on = (listener: Listener<P>) => {
    listeners.add(listener)
    return () => off(listener)
  }

  const off = (listener: Listener<P>) => {
    listeners.delete(listener)
  }

  const emit = (payload: P) => {
    for (const listener of listeners) {
      listener(payload)
    }
  }

  return { on, off, emit }
}
