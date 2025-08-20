import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./Body"
import Signin from "./Signin"
import Profile from "./Profile"
function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />} >
            <Route path="/signin" element={<Signin />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
