"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Search, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message { id: string; text: string; from: "me" | "them"; time: string; }
interface Thread { id: string; name: string; lastMsg: string; time: string; unread: number; avatar: string; messages: Message[]; }

const THREADS: Thread[] = [
  { id:"th1", name:"James Kamau", lastMsg:"Is the 2BR still available?", time:"10:42", unread:2, avatar:"JK",
    messages:[
      { id:"m1", text:"Hi, I saw your listing for a 2BR in Westlands. Is it still available?", from:"them", time:"10:38" },
      { id:"m2", text:"Is the 2BR still available?", from:"them", time:"10:42" },
    ]},
  { id:"th2", name:"Fatuma Hassan", lastMsg:"Can we schedule a viewing?", time:"9:15", unread:1, avatar:"FH",
    messages:[
      { id:"m3", text:"Hello, I'm interested in the bedsitter in Nyali.", from:"them", time:"9:10" },
      { id:"m4", text:"Can we schedule a viewing?", from:"them", time:"9:15" },
    ]},
  { id:"th3", name:"David Mwangi", lastMsg:"Documents sent ✓", time:"Yesterday", unread:0, avatar:"DM",
    messages:[
      { id:"m5", text:"Please send the tenancy agreement.", from:"them", time:"Yesterday 14:00" },
      { id:"m6", text:"Documents sent ✓", from:"me", time:"Yesterday 14:30" },
    ]},
];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState<string | null>(THREADS[0].id);
  const [input, setInput] = useState("");
  const [threads, setThreads] = useState(THREADS);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = threads.find(t => t.id === activeId);

  const openThread = (id: string) => {
    setActiveId(id);
    // Mark unread as read
    setThreads(ts => ts.map(t => t.id === id ? { ...t, unread: 0 } : t));
    setMobileView("chat");
  };

  const send = () => {
    if (!input.trim() || !activeId) return;
    const now = new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
    setThreads(ts => ts.map(t => t.id === activeId ? {
      ...t, lastMsg: input, time: now,
      messages: [...t.messages, { id: Date.now().toString(), text: input, from: "me" as const, time: now }],
    } : t));
    setInput("");
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  return (
    <div className="flex h-[calc(100dvh-57px)] overflow-hidden">
      {/* Thread list — hidden on mobile when chat is open */}
      <div className={cn(
        "flex-shrink-0 border-r border-gray-100 bg-white flex flex-col",
        "w-full sm:w-72 lg:w-80",
        mobileView === "chat" ? "hidden sm:flex" : "flex"
      )}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-3">Messages</h2>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              placeholder="Search messages..."
              className="text-xs bg-transparent focus:outline-none text-gray-600 placeholder:text-gray-400 flex-1"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map(thread => (
            <button
              key={thread.id}
              onClick={() => openThread(thread.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50",
                activeId === thread.id && "bg-gray-50"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                  {thread.avatar}
                </div>
                {thread.unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    {thread.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{thread.name}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{thread.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{thread.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area — hidden on mobile when list is shown */}
      {active ? (
        <div className={cn(
          "flex-1 flex flex-col bg-gray-50 min-w-0",
          mobileView === "list" ? "hidden sm:flex" : "flex"
        )}>
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setMobileView("list")}
              className="sm:hidden text-gray-400 hover:text-gray-700 mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
              {active.avatar}
            </div>
            <p className="text-sm font-semibold text-gray-900">{active.name}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {active.messages.map(msg => (
              <div key={msg.id} className={cn("flex", msg.from === "me" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] sm:max-w-xs px-4 py-2.5 rounded-2xl text-sm",
                  msg.from === "me"
                    ? "bg-gray-900 text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                )}>
                  <p>{msg.text}</p>
                  <p className={cn("text-[10px] mt-1", msg.from === "me" ? "text-white/50" : "text-gray-400")}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 p-3 sm:p-4 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
              />
              <button
                onClick={send}
                className="w-10 h-10 bg-gray-900 hover:bg-gray-700 rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden sm:flex items-center justify-center text-gray-400 text-sm">
          Select a conversation
        </div>
      )}
    </div>
  );
}
