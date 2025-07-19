"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Heart, Shield, Trash2, Globe, Send, Bot, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { translations } from "@/lib/translations"

type Language = "en" | "hi" | "gu"
type UrgencyLevel = "low" | "moderate" | "high"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  urgency?: UrgencyLevel
  timestamp: Date
}

export default function HealthAssistant() {
  const [language, setLanguage] = useState<Language>("en")
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [userName, setUserName] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/health-chat",
    body: { language, userName },
    onFinish: (message) => {
      // Save to local storage for privacy
      const updatedHistory = [
        ...chatHistory,
        {
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: new Date(),
        },
      ]
      setChatHistory(updatedHistory)
      localStorage.setItem("healthChatHistory", JSON.stringify(updatedHistory))
    },
  })

  const t = translations[language]

  useEffect(() => {
    // Load chat history from local storage
    const savedHistory = localStorage.getItem("healthChatHistory")
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    }

    // Check if user has completed onboarding
    const savedUserName = localStorage.getItem("healthAssistantUserName")
    const savedLanguage = localStorage.getItem("healthAssistantLanguage")
    if (savedUserName && savedLanguage) {
      setUserName(savedUserName)
      setLanguage(savedLanguage as Language)
      setShowOnboarding(false)
    }
  }, [])

  const handleOnboardingComplete = () => {
    if (userName.trim()) {
      localStorage.setItem("healthAssistantUserName", userName)
      localStorage.setItem("healthAssistantLanguage", language)
      setShowOnboarding(false)
    }
  }

  const clearChatHistory = () => {
    setChatHistory([])
    localStorage.removeItem("healthChatHistory")
  }

  const deleteProfile = () => {
    localStorage.removeItem("healthAssistantUserName")
    localStorage.removeItem("healthAssistantLanguage")
    localStorage.removeItem("healthChatHistory")
    setUserName("")
    setChatHistory([])
    setShowOnboarding(true)
  }

  const getUrgencyColor = (urgency?: UrgencyLevel) => {
    switch (urgency) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getUrgencyIcon = (urgency?: UrgencyLevel) => {
    switch (urgency) {
      case "low":
        return "🟢"
      case "moderate":
        return "🟡"
      case "high":
        return "🔴"
      default:
        return "💬"
    }
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">{t.welcome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectLanguage}</label>
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                  <SelectItem value="gu">🇮🇳 ગુજરાતી</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.enterName}</label>
              <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder={t.namePlaceholder} />
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">{t.privacyNote}</AlertDescription>
            </Alert>

            <Button onClick={handleOnboardingComplete} disabled={!userName.trim()} className="w-full">
              {t.startChat}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{t.healthAssistant}</h1>
              <p className="text-sm text-gray-600">{t.greeting.replace("{name}", userName)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="gu">ગુજરાતી</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={clearChatHistory}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border min-h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">{t.welcomeMessage}</p>
                <p className="text-sm text-gray-500">{t.howCanIHelp}</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    }`}
                  >
                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* Show urgency badge for assistant messages */}
                    {message.role === "assistant" && message.content.includes("🟢🟡🔴") && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.content.includes("🟢") && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">🟢 {t.urgencyLow}</Badge>
                        )}
                        {message.content.includes("🟡") && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            🟡 {t.urgencyModerate}
                          </Badge>
                        )}
                        {message.content.includes("🔴") && (
                          <Badge className="bg-red-100 text-red-800 border-red-200">🔴 {t.urgencyHigh}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Medical Disclaimer */}
          <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800">{t.disclaimer}</p>
            </div>
          </div>

          {/* Input Form */}
          <div className="p-6 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={t.messagePlaceholder}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="mt-4 flex justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={clearChatHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            {t.clearHistory}
          </Button>
          <Button variant="outline" size="sm" onClick={deleteProfile}>
            <Shield className="w-4 h-4 mr-2" />
            {t.deleteProfile}
          </Button>
        </div>
      </div>
    </div>
  )
}
