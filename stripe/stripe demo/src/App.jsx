import { useState } from 'react'
import StripeContainer from './PaymentForm'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <StripeContainer></StripeContainer>
   
    </>
  )
}

export default App
