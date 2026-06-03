import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import LiveBackground from "../components/LiveBackground"
 
function Home() {
  return (
    <div className="min-h-screen bg-[#050816] text-white relative">
      <LiveBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
      </div>
    </div>
  )
}
 
export default Home
 