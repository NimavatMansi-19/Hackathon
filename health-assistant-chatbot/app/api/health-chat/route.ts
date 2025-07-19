import { createOpenAI } from "@ai-sdk/openai"

// Create a mock AI provider that simulates health assistant responses
const healthAI = createOpenAI({
  apiKey: "mock-key",
  baseURL: "http://localhost:3000/api/mock-ai",
})

// Health knowledge base for symptom analysis
const healthKnowledgeBase = {
  symptoms: {
    fever: {
      keywords: ["fever", "temperature", "hot", "chills", "बुखार", "તાવ"],
      advice: {
        en: "For fever, rest and stay hydrated. Take paracetamol if needed. Monitor temperature.",
        hi: "बुखार के लिए आराम करें और पानी पिएं। जरूरत पड़ने पर पैरासिटामोल लें।",
        gu: "તાવ માટે આરામ કરો અને પાણી પીઓ। જરૂર પડે તો પેરાસિટામોલ લો।",
      },
    },
    headache: {
      keywords: ["headache", "head pain", "migraine", "सिरदर्द", "માથાનો દુખાવો"],
      advice: {
        en: "For headaches, try rest in a dark room, stay hydrated, and consider pain relief medication.",
        hi: "सिरदर्द के लिए अंधेरे कमरे में आराम करें, पानी पिएं और दर्द निवारक दवा लें।",
        gu: "માથાના દુખાવા માટે અંધારા રૂમમાં આરામ કરો, પાણી પીઓ અને પેઇન રિલીફ દવા લો।",
      },
    },
    cough: {
      keywords: ["cough", "coughing", "खांसी", "ખાંસી"],
      advice: {
        en: "For cough, drink warm liquids, use honey, and avoid irritants. See a doctor if persistent.",
        hi: "खांसी के लिए गर्म तरल पदार्थ पिएं, शहद का उपयोग करें। लगातार रहने पर डॉक्टर से मिलें।",
        gu: "ખાંસી માટે ગરમ પ્રવાહી પીઓ, મધનો ઉપયોગ કરો। સતત રહે તો ડૉક્ટરને મળો।",
      },
    },
  },

  assessUrgency(symptoms: string[]) {
    const highUrgency = ["chest pain", "breathing difficulty", "severe headache", "high fever"]
    const moderateUrgency = ["persistent cough", "body ache", "nausea"]

    const hasHighUrgency = symptoms.some((s) => highUrgency.some((h) => s.toLowerCase().includes(h)))

    const hasModerateUrgency = symptoms.some((s) => moderateUrgency.some((m) => s.toLowerCase().includes(m)))

    if (hasHighUrgency) return "high"
    if (hasModerateUrgency || symptoms.length >= 3) return "moderate"
    return "low"
  },

  generateResponse(message: string, language: string) {
    const lowerMessage = message.toLowerCase()

    // Check if it's a health-related question
    const healthKeywords = [
      "symptom",
      "pain",
      "ache",
      "fever",
      "cough",
      "headache",
      "sick",
      "hurt",
      "feel",
      "doctor",
      "medicine",
    ]
    const isHealthRelated = healthKeywords.some((keyword) => lowerMessage.includes(keyword))

    if (!isHealthRelated) {
      // Handle general questions
      if (
        lowerMessage.includes("hello") ||
        lowerMessage.includes("hi") ||
        lowerMessage.includes("नमस्ते") ||
        lowerMessage.includes("નમસ્તે")
      ) {
        return language === "hi"
          ? "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। आप कैसा महसूस कर रहे हैं?"
          : language === "gu"
            ? "નમસ્તે! હું તમારો આરોગ્ય સહાયક છું। તમે કેવું અનુભવો છો?"
            : "Hello! I'm your health assistant. How are you feeling today?"
      }

      if (lowerMessage.includes("thank") || lowerMessage.includes("धन्यवाद") || lowerMessage.includes("આભાર")) {
        return language === "hi"
          ? "आपका स्वागत है! क्या कोई और स्वास्थ्य संबंधी प्रश्न है?"
          : language === "gu"
            ? "તમારું સ્વાગત છે! કોઈ અન્ય આરોગ્ય સંબંધિત પ્રશ્ન છે?"
            : "You're welcome! Any other health-related questions?"
      }

      return language === "hi"
        ? "मैं स्वास्थ्य संबंधी सवालों में आपकी मदद कर सकता हूं। कृपया अपने लक्षणों के बारे में बताएं।"
        : language === "gu"
          ? "હું આરોગ્ય સંબંધિત પ્રશ્નોમાં તમારી મદદ કરી શકું છું. કૃપા કરીને તમારા લક્ષણો વિશે કહો."
          : "I can help with health-related questions. Please tell me about your symptoms or how you're feeling."
    }

    // Analyze symptoms
    const detectedSymptoms: string[] = []
    let response = ""

    Object.entries(this.symptoms).forEach(([symptom, data]) => {
      if (data.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        detectedSymptoms.push(symptom)
        response += data.advice[language as keyof typeof data.advice] + "\n\n"
      }
    })

    if (detectedSymptoms.length === 0) {
      // General health advice
      response =
        language === "hi"
          ? "आपके लक्षणों के आधार पर, मैं सुझाव देता हूं कि आप पर्याप्त आराम करें, पानी पिएं और अपनी स्थिति पर नजर रखें।"
          : language === "gu"
            ? "તમારા લક્ષણોના આધારે, હું સૂચન કરું છું કે તમે પૂરતો આરામ કરો, પાણી પીઓ અને તમારી સ્થિતિ પર નજર રાખો."
            : "Based on what you've described, I recommend getting adequate rest, staying hydrated, and monitoring your condition."
    }

    // Add urgency assessment
    const urgency = this.assessUrgency(detectedSymptoms)

    if (urgency === "high") {
      response +=
        language === "hi"
          ? "\n🔴 ઉચ્ચ તાત્કાલિકતા: કૃપા કરીને તાત્કાલિક તબીબી સહાય લો!"
          : language === "gu"
            ? "\n🔴 ઉચ્ચ તાત્કાલિકતા: કૃપા કરીને તાત્કાલિક તબીબી સહાય લો!"
            : "\n🔴 HIGH URGENCY: Please seek immediate medical attention!"
    } else if (urgency === "moderate") {
      response +=
        language === "hi"
          ? "\n🟡 मध्यम प्राथमिकता: अगले दिन या दो में डॉक्टर से मिलें।"
          : language === "gu"
            ? "\n🟡 મધ્યમ પ્રાથમિકતા: આગામી દિવસ કે બે દિવસમાં ડૉક્ટરને મળો."
            : "\n🟡 MODERATE PRIORITY: Consider seeing a doctor within the next day or two."
    } else {
      response +=
        language === "hi"
          ? "\n🟢 कम प्राथमिकता: स्व-देखभाल और निगरानी।"
          : language === "gu"
            ? "\n🟢 ઓછી પ્રાથમિકતા: સ્વ-સંભાળ અને દેખરેખ."
            : "\n🟢 LOW PRIORITY: Self-care and monitoring recommended."
    }

    // Add disclaimer
    response +=
      language === "hi"
        ? "\n\n⚠️ महत्वपूर्ण: यह चिकित्सा निदान नहीं है। सटीक सलाह के लिए डॉक्टर से सलाह लें।"
        : language === "gu"
          ? "\n\n⚠️ મહત્વપૂર્ણ: આ તબીબી નિદાન નથી. ચોક્કસ સલાહ માટે ડૉક્ટરની સલાહ લો."
          : "\n\n⚠️ IMPORTANT: This is not a medical diagnosis. Please consult a healthcare professional for accurate advice."

    return response
  },
}

export async function POST(req: Request) {
  try {
    const { messages, language = "en", userName = "User" } = await req.json()

    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage.content

    // Generate contextual response based on user's actual question
    const healthResponse = healthKnowledgeBase.generateResponse(userMessage, language)

    // Create a proper streaming response
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      start(controller) {
        // Simulate natural typing speed
        let index = 0
        const words = healthResponse.split(" ")

        const sendNextWord = () => {
          if (index < words.length) {
            const word = words[index] + (index < words.length - 1 ? " " : "")
            controller.enqueue(encoder.encode(`0:"${word}"\n`))
            index++
            setTimeout(sendNextWord, 100) // Adjust speed as needed
          } else {
            controller.enqueue(
              encoder.encode('d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n'),
            )
            controller.close()
          }
        }

        sendNextWord()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    })
  } catch (error) {
    console.error("Health chat error:", error)
    return new Response("Error processing your question", { status: 500 })
  }
}
