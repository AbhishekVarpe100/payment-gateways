import { useState } from 'react'
import PaymentForm from './PaymentForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <PaymentForm></PaymentForm>
    </>
  )
}

export default App
