const FAQ = () => {
  const faqs = [
    {
      question: "什么是 WHSK?",
      answer: "WHSK 是 HSK 代币的包装版本..."
    },
    {
      question: "如何包装 HSK?",
      answer: "连接您的钱包，确保在正确的网络上，然后输入想要包装的 HSK 数量..."
    }
  ]

  return (
    <div className="mt-8 p-6 bg-nord-1 rounded-2xl backdrop-blur-sm">
      <h2 className="text-subheading font-bold mb-6 text-nord-6">常见问题</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-nord-2 pb-4 last:border-0">
            <h3 className="font-medium mb-2 text-nord-4">{faq.question}</h3>
            <p className="text-nord-3">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
