'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const Header = () => {
  const [account, setAccount] = useState<string>('')
  const [chainId, setChainId] = useState<number>()
  const [showDisconnect, setShowDisconnect] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        }) as string[]
        const newAccount = accounts[0] || ''
        setAccount(newAccount)
        
        const chainId = await window.ethereum.request({
          method: 'eth_chainId'
        }) as string
        const newChainId = parseInt(chainId, 16)
        setChainId(newChainId)

        // 保存到 localStorage
        localStorage.setItem('walletAddress', newAccount)
        localStorage.setItem('chainId', newChainId.toString())
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const disconnectWallet = () => {
    setAccount('')
    setChainId(undefined)
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('chainId')
    setShowDisconnect(false)
  }

  const switchTo133 = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not installed')
      }
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x85' }], // 133 in hex
      })
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  useEffect(() => {
    // 从 localStorage 恢复状态
    const savedAddress = localStorage.getItem('walletAddress')
    const savedChainId = localStorage.getItem('chainId')
    
    if (savedAddress) setAccount(savedAddress)
    if (savedChainId) setChainId(parseInt(savedChainId))

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (...args: unknown[]) => {
        const chainId = args[0] as string
        const newChainId = parseInt(chainId, 16)
        setChainId(newChainId)
        localStorage.setItem('chainId', newChainId.toString())
      })

      window.ethereum.on('accountsChanged', (...args: unknown[]) => {
        const accounts = args[0] as string[]
        const newAccount = accounts[0] || ''
        setAccount(newAccount)
        if (newAccount) {
          localStorage.setItem('walletAddress', newAccount)
        } else {
          localStorage.removeItem('walletAddress')
          localStorage.removeItem('chainId')
        }
      })
    }
  }, [])

  return (
    <header className="border-b border-nord-2 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-nord-8 to-nord-9 text-transparent bg-clip-text">
            Wrapped HSK
          </h1>
          
          <div className="flex items-center gap-4">
            {account && chainId !== 133 && (
              <button 
                onClick={switchTo133}
                className="px-4 py-2 bg-nord-11 text-nord-0 rounded-xl 
                         hover:bg-nord-12 transition-all duration-200 text-sm font-medium"
              >
                Switch to 133
              </button>
            )}
            
            {account && chainId === 133 && (
              <div className="p-1 bg-nord-2 rounded-full">
                <Image 
                  src="https://hyper-index-dex.4everland.store/hsk-logo.png"
                  alt="HSK Logo"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </div>
            )}

            <div className="relative">
              <button
                onClick={account ? undefined : connectWallet}
                onMouseEnter={() => account && setShowDisconnect(true)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200
                  ${account 
                    ? 'bg-nord-2 text-nord-4 hover:bg-nord-3' 
                    : 'bg-nord-8 text-nord-0 hover:bg-nord-10'
                  }`}
              >
                {account 
                  ? `${account.slice(0,6)}...${account.slice(-4)}` 
                  : 'Connect Wallet'
                }
              </button>

              {/* Disconnect Popup */}
              {showDisconnect && account && (
                <div 
                  className="absolute top-full mt-2 left-0 w-full"
                  onMouseEnter={() => setShowDisconnect(true)}
                  onMouseLeave={() => setShowDisconnect(false)}
                >
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-2 px-4
                             bg-nord-11 text-nord-0 rounded-lg text-sm font-medium
                             hover:bg-nord-12 transition-all duration-200"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 