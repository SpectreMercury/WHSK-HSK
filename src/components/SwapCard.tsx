'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MessageStack from './MessageStack'
import Image from 'next/image'

const WHSK_ADDRESS = '0xCA8aAceEC5Db1e91B9Ed3a344bA026c4a2B3ebF6'
const WHSK_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "type": "function"
  }
]

interface Message {
  id: string
  type: 'pending' | 'success' | 'error'
  title: string
  description: string
  txHash?: string
}

const SwapCard = () => {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isReversed, setIsReversed] = useState(false)
  const [hskBalance, setHskBalance] = useState('0')
  const [whskBalance, setWhskBalance] = useState('0')
  const [account, setAccount] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ))
  }

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Get current connected account
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          }) as string[]
          // Ensure accounts is not empty
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0])
          }

          // Create provider and contract instances
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const whskContract = new ethers.Contract(WHSK_ADDRESS, WHSK_ABI, signer)
          
          // Get HSK balance (native token)
          const balance = await provider.getBalance(accounts[0])
          setHskBalance(ethers.formatEther(balance))

          // Get WHSK balance
          const whskBal = await whskContract.balanceOf(accounts[0])
          setWhskBalance(ethers.formatEther(whskBal))

        } catch (error) {
          console.error('Error:', error)
        }
      }
    }

    init()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', init)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', init)
      }
    }
  }, [])

  const handleSwap = async () => {
    if (!account || !fromAmount || isPending) return
    
    setIsPending(true)
    const messageId = Math.random().toString(36).substr(2, 9)
    
    try {
      // 添加 pending 消息
      setMessages(prev => [...prev, {
        id: messageId,
        type: 'pending',
        title: isReversed ? 'Wrapping HSK' : 'Unwrapping WHSK',
        description: `${fromAmount} ${isReversed ? 'HSK → WHSK' : 'WHSK → HSK'}`
      }])

      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const whskContract = new ethers.Contract(WHSK_ADDRESS, WHSK_ABI, signer)
      
      let tx
      if (isReversed) {
        tx = await whskContract.deposit({ value: ethers.parseEther(fromAmount) })
      } else {
        tx = await whskContract.withdraw(ethers.parseEther(fromAmount))
      }

      await tx.wait()

      // 更新消息状态为成功
      updateMessage(messageId, {
        type: 'success',
        txHash: tx.hash
      })

      setIsPending(false)
    } catch (error) {
      // 更新消息状态为失败
      updateMessage(messageId, {
        type: 'error',
        description: (error as Error).message
      })
      setIsPending(false)
    }
  }

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFromAmount(value)
    setToAmount(value) // Sync update bottom input
  }

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setToAmount(value)
    setFromAmount(value) // Sync update top input
  }

  const handleMax = (type: 'from' | 'to') => {
    if (isReversed) {
      if (type === 'from') setFromAmount(hskBalance)
      if (type === 'to') setToAmount(whskBalance) 
    } else {
      if (type === 'from') setFromAmount(whskBalance)
      if (type === 'to') setToAmount(hskBalance)
    }
  }

  return (
    <>
      <MessageStack 
        messages={messages}
        onDismiss={(id) => setMessages(prev => prev.filter(msg => msg.id !== id))}
      />
      
      <div className="bg-nord-1 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
        <h2 className="text-heading font-bold text-center mb-8 text-nord-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Image 
                src="https://hyper-index-dex.4everland.store/hsk-logo.png"
                alt="HSK Logo"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{isReversed ? 'HSK' : 'WHSK'}</span>
            </div>
            
            <svg className="w-5 h-5 text-nord-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            
            <div className="flex items-center gap-2">
              <Image 
                src="https://hyper-index-dex.4everland.store/hsk-logo.png"
                alt="HSK Logo"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{isReversed ? 'WHSK' : 'HSK'}</span>
            </div>
          </div>
        </h2>
        
        <div className="space-y-4">
          <div className="bg-nord-0 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-nord-4">
                Balance: {isReversed ? hskBalance : whskBalance} {isReversed ? 'HSK' : 'WHSK'}
              </span>
              <button 
                onClick={() => handleMax('from')}
                className="text-sm text-nord-8 hover:text-nord-9 transition-colors"
              >
                Max
              </button>
            </div>
            <input
              type="number"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder={isReversed ? "Enter HSK amount" : "Enter WHSK amount"}
              className="w-full bg-transparent outline-none text-xl text-nord-4 placeholder-nord-3"
            />
          </div>

          <button 
            onClick={() => setIsReversed(!isReversed)}
            className="flex items-center justify-center w-10 h-10 mx-auto rounded-full 
                       hover:bg-nord-2 transition-colors"
          >
            <svg className="w-6 h-6 text-nord-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <div className="bg-nord-0 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-nord-4">
                Balance: {isReversed ? whskBalance : hskBalance} {isReversed ? 'WHSK' : 'HSK'}
              </span>
              <button 
                onClick={() => handleMax('to')}
                className="text-sm text-nord-8 hover:text-nord-9 transition-colors"
              >
                Max
              </button>
            </div>
            <input
              type="number"
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder={isReversed ? "Receive WHSK" : "Receive HSK"}
              className="w-full bg-transparent outline-none text-xl text-nord-4 placeholder-nord-3"
            />
          </div>

          <button 
            onClick={handleSwap}
            disabled={!account || !fromAmount || isPending}
            className="w-full py-4 mt-4 bg-nord-8 hover:bg-nord-10 text-nord-0 
                      font-semibold rounded-xl transition-colors text-lg
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center"
          >
            {!account 
              ? 'Connect Wallet'
              : !fromAmount
                ? 'Enter Amount'
                : isPending
                  ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-nord-0 border-t-transparent mr-2" />
                      {isReversed ? 'Wrapping...' : 'Unwrapping...'}
                    </>
                  )
                  : isReversed 
                    ? 'Wrap' 
                    : 'Unwrap'
            }
          </button>
        </div>
      </div>
    </>
  )
}
export default SwapCard 