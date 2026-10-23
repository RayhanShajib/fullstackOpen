/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef } from 'react'

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)
  const timerRef = useRef(null)

  const notify = (message, seconds = 5) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setNotification(message)
    timerRef.current = setTimeout(() => {
      setNotification(null)
      timerRef.current = null
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  return context ? context.notification : null
}

export const useNotify = () => {
  const context = useContext(NotificationContext)
  return context ? context.notify : () => {}
}

export default NotificationContext
