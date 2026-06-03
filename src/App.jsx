import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import SplashScreen from "./components/SplashScreen"
 
function App() {
  const [showSplash, setShowSplash] = useState(true)
 
  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
 
export default App