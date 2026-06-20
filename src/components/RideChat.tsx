'use client'
import axios from 'axios'
import { Send, Sparkle, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {AnimatePresence, motion} from 'motion/react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { Sen } from 'next/font/google'

type message = {
  bookingId: string
  sender: 'user' | 'driver'
  text: string
  createdAt: Date
}

const RideChat = ({ currentRole, bookingId, userName, driverName }: any) => {
  const otherName = currentRole === 'user' ? driverName : userName
  const myName = currentRole === 'user' ? userName : driverName
  const [messages, setMessages] = useState<message[]>([])
  const [lastMessage, setLastMessage] = useState('')
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const {userData} = useSelector((state: RootState) => state.user)
  const [showAI, setShowAI] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const sendMessage = async () => {
    try{
      const { data } = await axios.post('/api/chat/send', {
        sender: currentRole,
        text,
        bookingId
      })
      console.log('Message sent:', data)
      setMessages([...messages, data])
      setLastMessage(data.text) 
      setText('')
    }catch(err){
      console.error('Error sending message:', err)
    }
  }
  const getAllMessages = async () => {
    try{
      const { data } = await axios.post('/api/chat/get-all', {
        bookingId
      })
      console.log('All messages:', data)
      setMessages(data)
      setLastMessage(data[0])
    }catch(err){
      console.error('Error fetching messages:', err)
    }
  }

  const formatTime = (dateInput: Date | string) => {
    const data = new Date(dateInput)
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getAiSuggestions = async () => {
    setAiLoading(true)
    setShowAI(true)
    try{
      const { data } = await axios.post('/api/chat/ai-suggestions', {
        role: currentRole,
        lastMsg: lastMessage
      })
      console.log('AI suggestions:', data)
      const jsonData = JSON.parse(data.suggestions)
      setSuggestions(jsonData.suggestions)
      setAiLoading(false)
    }catch(err){
      console.error('Error fetching AI suggestions:', err)
      setAiLoading(false)
    }
  }

  useEffect(() => {
    getAllMessages()
  }, [])

  return (
    <div className='flex flex-col h-full min-h-0 bg-white rounded-2xl overflow-hidden border border-zinc-100'>
      <div className='flex items-center px-4 py-2 border-b border-zinc-100 shrink-0'>
        <div className='relative shrink-0'> 
          <div className='w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-sm font-bold text-white'>
            {otherName.charAt(0).toUpperCase()}
          </div>
          <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'/>
        </div>
        <div className='min-w-0 flex-1 ml-2'>
          <p className='text-sm font-bold text-zinc-900 leading-none'>{otherName}</p>
          <p className='text-xs text-emerald-500 font-semibold mt-0.5'>Active Now</p>
        </div>
        
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-50' style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full gap-3 py-16'>
            <div className='w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center shrink-0'>
              <Send size={18} className='text-zinc-400'/>
            </div>
            <p className='text-sm text-zinc-400 font-medium'>No messages yet. Start the conversation!</p>
            
          </div>
        )}

        {messages.length > 0 && (
          messages.map((msg, index) => {
            const isMine = msg.sender === currentRole
            return(
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl leading-relaxed shadow-sm ${isMine ? 'bg-zinc-900 text-white rounded-br-sm' : 'bg-zinc-100 text-zinc-900 rounded-bl-sm'}`}>
                  <p className='text-sm wrap-break-word'>{msg.text}</p>
                  <span className='text-[8px] text-zinc-200'>{formatTime(msg.createdAt)}</span>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

    <AnimatePresence>
        {showAI && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 10 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='flex gap-2 border-t border-zinc-100 bg-zinc-50 shrink-0 overflow-hidden'
          >
              <div className='px-4 pt-3 pb-2 w-full'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <Sparkle size={12} className='text-violet-500'/>
                    <span className='text-sm font-medium text-zinc-500 uppercase tracking-wider'>AI suggestions</span>
                  </div>  
                  <button onClick={() => setShowAI(false)} className='text-zinc-400 hover:text-zinc-600 text-xs font-medium'>
                    <X size={14}/>
                  </button>
                </div>
                {aiLoading ? (
                  <div className='flex flex-col gap-2'>
                    {[1, 2, 3].map((i)=>(
                      <div key={i} className='w-full h-4 bg-zinc-200 rounded-xl animate-pulse '/>
                    ))}
                  </div>
                ):(
                  <div className='flex flex-col gap-2'>
                    {suggestions.map((sug, index) => (
                      <motion.div
                        key={index}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setText(sug);
                          setShowAI(false)
                        }}
                        className='text-left text-sm text-zinc-700 bg-zinc-50 hover:bg-violet-50 hover:text-violet-700 border border-zinc-100 hover:border-violet-200 px-3 py-2 rounded-xl transition-all'
                      >
                        {sug}
                      </motion.div>
                    ))}
                    <button className='text-sm text-violet-500 hover:text-violet-700 font-semibold text-center transition-colors mt-2' onClick={()=>getAiSuggestions()}> 
                      Refresh Suggestions
                    </button>
                  </div>
                )}
              </div>
          </motion.div>
        )}
    </AnimatePresence>

    <div className='px-4 pb-4 pt-2 bg-white shrink-0'>
        <div className='flex items-center gap-2 bg-zinc-100 rounded-2xl pl-3 pr-2 py-2'>
          {messages.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={()=>getAiSuggestions()}
              className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showAI ? 'bg-violet-600 text-2xl' : 'bg-white text-violet-500 hover:text-violet-50 border border-zinc-200'}`}
            >
              <Sparkle size={14}/>
            </motion.button>
          )}
          <input type='text' placeholder='Message...' className='bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none py-2 min-w-0 w-full' onChange={(e) => setText(e.target.value)} value={text} />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={text.trim() === ''}
            className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${text.trim() === '' ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
          >
            <Send size={14}/>
          </motion.button>
        </div>
    </div>

    </div>
  )
}

export default RideChat