import './App.css'
import { SquareArea } from './components/SquareArea'

export const App = () =>
{
  const myWs = new WebSocket('ws://localhost:9000')
  myWs.onopen = () => { console.log('connected') }
  myWs.onmessage = (message) => { console.log('Message: ', message) }
  const wsSend = () => { console.log("trying to send the message"); myWs.send(JSON.stringify("message from website")) }

  return (
    <div className="App">
      <SquareArea />
      <button onClick={ wsSend }>send ws msg</button>
    </div>
  )
}