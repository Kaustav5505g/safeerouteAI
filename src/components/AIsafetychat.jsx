import { useState, useRef, useEffect } from "react"

const SYSTEM_PROMPT = `You are SafeRoute AI, an intelligent safety assistant for women commuters in Guwahati, Assam, India. You help women navigate safely by:
- Assessing safety of specific roads, areas, and routes in Guwahati (Fancy Bazar, Paltan Bazaar, GS Road, Dispur, Chandmari, Ulubari, Ganeshguri, Bhangagarh, Sixmile, Beltola, Zoo Road, Guwahati Railway Station area, etc.)
- Giving time-aware safety advice (daytime vs nighttime risks)
- Suggesting safer alternate routes
- Providing emergency tips and contacts (Guwahati Police: 100, Women Helpline: 1091, Assam Police: 0361-2237677)
- Assessing crowd density and lighting conditions
- Giving transport safety tips (auto, bus, cab)

Always be concise, empathetic, and practical. Format responses with short paragraphs. Use safety scores out of 10 when asked about specific areas. Never be alarmist — be helpful and empowering.`

export default function AISafetyChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm SafeRoute AI 👋 Ask me anything about safe commuting in Guwahati — route safety, best travel times, or emergency help."
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Try again."
      setMessages(prev => [...prev, { role: "assistant", content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }])
    }
    setLoading(false)
  }

  return (
    <div className="glass rounded-3xl p-6 flex flex-col h-[520px]">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-sm font-bold glow">AI</div>
        <div>
          <h2 className="text-xl font-bold">SafeRoute AI Assistant</h2>
          <p className="text-gray-400 text-xs">Powered by Claude · Guwahati Safety Expert</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-6 ${
              msg.role === "user"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-sm"
                : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask about route safety, areas, timings..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-pink-500/50 transition"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 glow"
        >
          Send
        </button>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {["Is GS Road safe at night?", "Safest route to Paltan Bazaar", "Emergency contacts"].map(q => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="text-xs bg-pink-500/10 border border-pink-500/20 text-pink-300 px-3 py-1.5 rounded-full hover:bg-pink-500/20 transition"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}