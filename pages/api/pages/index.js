import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Maafi chahta hoon, dobara try karo!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>BhartiyaAI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Noto+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <div className="app">
        <header>
          <div className="logo">
            <span className="logo-icon">🇮🇳</span>
            <span className="logo-text">BhartiyaAI</span>
          </div>
          <span className="tagline">Apna AI Assistant</span>
        </header>
        <main>
          {messages.length === 0 && (
            <div className="welcome">
              <div className="welcome-icon">🙏</div>
              <h2>Namaste!</h2>
              <p>Main BhartiyaAI hoon — tumhara apna Indian AI assistant.</p>
              <div className="suggestions">
                {["Aaj ka mausam kaisa hai?", "Ek joke sunao", "Python loop kaise likhein?", "Biryani recipe batao"].map((s) => (
                  <button key={s} className="suggestion" onClick={() => setInput(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === "assistant" && <span className="avatar">🇮🇳</span>}
                <div className="bubble">{m.content}</div>
                {m.role === "user" && <span className="avatar">👤</span>}
              </div>
            ))}
            {loading && (
              <div className="msg assistant">
                <span className="avatar">🇮🇳</span>
                <div className="bubble typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>
        <footer>
          <div className="input-row">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Kuch bhi poochho..." disabled={loading} />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>{loading ? "..." : "➤"}</button>
          </div>
        </footer>
      </div>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans', sans-serif; background: #0f0c1a; color: #f0ece8; height: 100vh; }
        .app { display: flex; flex-direction: column; height: 100vh; max-width: 800px; margin: 0 auto; }
        header { padding: 16px 20px; background: linear-gradient(135deg, #ff6b1a, #ff9d00); display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-icon { font-size: 28px; }
        .logo-text { font-family: 'Baloo 2', cursive; font-weight: 800; font-size: 24px; color: white; }
        .tagline { font-size: 13px; color: rgba(255,255,255,0.85); }
        main { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; }
        .welcome { text-align: center; margin: auto; padding: 40px 20px; }
        .welcome-icon { font-size: 60px; margin-bottom: 16px; }
        .welcome h2 { font-family: 'Baloo 2', cursive; font-size: 32px; color: #ff9d00; margin-bottom: 8px; }
        .welcome p { color: #b0a8c0; margin-bottom: 24px; }
        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .suggestion { background: rgba(255,107,26,0.15); border: 1px solid rgba(255,107,26,0.3); color: #ff9d00; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; }
        .suggestion:hover { background: rgba(255,107,26,0.3); }
        .messages { display: flex; flex-direction: column; gap: 16px; }
        .msg { display: flex; align-items: flex-end; gap: 10px; }
        .msg.user { flex-direction: row-reverse; }
        .avatar { font-size: 24px; }
        .bubble { max-width: 70%; padding: 12px 16px; border-radius: 18px; line-height: 1.6; font-size: 15px; }
        .msg.assistant .bubble { background: rgba(255,255,255,0.08); border-radius: 18px 18px 18px 4px; }
        .msg.user .bubble { background: linear-gradient(135deg, #ff6b1a, #ff9d00); border-radius: 18px 18px 4px 18px; color: white; }
        .typing { display: flex; gap: 5px; align-items: center; }
        .typing span { width: 8px; height: 8px; background: #ff9d00; border-radius: 50%; animation: bounce 1.2s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
        footer { padding: 16px; background: rgba(255,255,255,0.04); border-top: 1px solid rgba(255,255,255,0.1); }
        .input-row { display: flex; gap: 10px; }
        input { flex: 1; padding: 12px 18px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 25px; color: white; font-size: 15px; outline: none; }
        input:focus { border-color: #ff6b1a; }
        button { padding: 12px 20px; background: linear-gradient(135deg, #ff6b1a, #ff9d00); border: none; border-radius: 25px; color: white; font-size: 18px; cursor: pointer; }
        button:disabled { opacity: 0.5; }
      `}</style>
    </>
  );
}
