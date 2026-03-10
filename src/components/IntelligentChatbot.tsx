"use client";
import React, { useState, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'cta';
  ctaButtons?: Array<{
    label: string;
    action: string;
  }>;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category?: string;
}

interface ConversationContext {
  userInterests: string[];
  mentionedProducts: string[];
  askedAboutPricing: boolean;
  requestedDemo: boolean;
  lastMessageTime: Date;
  conversationStage: 'greeting' | 'exploring' | 'interested' | 'ready' | 'closing';
}

interface AIResponse {
  answer: string;
  confidence: number;
  source: 'ai' | 'faq' | 'context' | 'fallback';
  suggestedActions?: string[];
}

interface ChatSession {
  id: string;
  messages: Message[];
  context: ConversationContext;
  startTime: Date;
  lastActivity: Date;
}

// Business facts and context data - Step 3
const XHENVOLT_BUSINESS_FACTS = {
  contact: {
    phone: "+256 741 341 483",
    email: "info@xhenvolt.com",
    website: "xhenvolt.com",
    location: "Uganda, East Africa"
  },
  stats: {
    clients: "25+",
    satisfaction: "100%",
    experience: "5+ years",
    uptime: "99.9%"
  },
  products: {
    drais: { name: "DRAIS", type: "School Management", price: "UGX 800,000/year", timeline: "2-3 weeks" },
    zyra: { name: "Zyra", type: "SACCO Management", price: "UGX 600,000/year", timeline: "3-4 weeks" },
    constra: { name: "Constra", type: "Construction Management", price: "UGX 1,200,000/year", timeline: "4-6 weeks" },
    inveto: { name: "Inveto", type: "Investment Management", price: "UGX 1,500,000/year", timeline: "4-8 weeks" },
    sentra: { name: "Sentra", type: "POS System", price: "UGX 400,000/year", timeline: "1-2 weeks" }
  },
  services: [
    "Custom software development",
    "System integration",
    "24/7 technical support",
    "User training",
    "Data migration",
    "Cloud hosting",
    "Mobile app development"
  ]
};

// Sample FAQ data - Step 2 implementation
const XHENVOLT_FAQS: FAQ[] = [
  {
    id: "drais-1",
    question: "What is DRAIS?",
    answer: "DRAIS is Xhenvolt's comprehensive school management system for attendance, grades, fees, student records, and parent communication. It helps schools reduce administrative work by 60%. Want a demo? 📚",
    keywords: ["drais", "school", "management", "attendance", "grades", "fees", "students", "education"],
    category: "products"
  },
  {
    id: "constra-1", 
    question: "What is Constra?",
    answer: "Constra is our construction management system that handles project planning, resource allocation, progress tracking, and budget management for construction companies. Perfect for contractors in Uganda. 🏗️",
    keywords: ["constra", "construction", "project", "building", "contractor", "planning"],
    category: "products"
  },
  {
    id: "zyra-1",
    question: "What is Zyra?",
    answer: "Zyra is our SACCO management system that handles member registration, savings, loans, shares, and financial reporting for SACCOs and microfinance institutions. 🏦",
    keywords: ["zyra", "sacco", "savings", "loans", "microfinance", "members", "shares"],
    category: "products"
  },
  {
    id: "inveto-1",
    question: "What is Inveto?",
    answer: "Inveto is our investment management system that tracks portfolios, analyzes performance, manages client accounts, and provides investment insights for financial advisors and investment firms. 📈",
    keywords: ["inveto", "investment", "portfolio", "financial", "advisor", "performance", "analysis"],
    category: "products"
  },
  {
    id: "sentra-1",
    question: "What is Sentra?",
    answer: "Sentra is our Point of Sale (POS) system for retail businesses, restaurants, and shops. It handles sales, inventory, customer management, and reporting. Perfect for SMEs in Uganda. 🛒",
    keywords: ["sentra", "pos", "point of sale", "retail", "sales", "inventory", "shop", "restaurant"],
    category: "products"
  },
  {
    id: "pricing-1",
    question: "How much do your solutions cost?",
    answer: "Our pricing is flexible and depends on your specific needs:\n• DRAIS: from UGX 800,000/year\n• Zyra: from UGX 600,000/year\n• Constra: from UGX 1,200,000/year\n• Inveto: from UGX 1,500,000/year\n• Sentra: from UGX 400,000/year\n\nCall +256 741 341 483 for a personalized quote! 💰",
    keywords: ["price", "cost", "pricing", "how much", "ugx", "money"],
    category: "pricing"
  },
  {
    id: "demo-1",
    question: "How can I schedule a demo?",
    answer: "Easy! Call +256 741 341 483 or email info@xhenvolt.com. We'll set up a personalized demo within 48 hours. Which product interests you most? 🎯",
    keywords: ["demo", "schedule", "appointment", "meeting", "show"],
    category: "sales"
  },
  {
    id: "support-1",
    question: "Do you provide technical support?",
    answer: "Absolutely! We provide 24/7 technical support, training, and maintenance for all our systems. Our team is always here to help you succeed. 🛠️",
    keywords: ["support", "help", "technical", "training", "maintenance"],
    category: "support"
  },
  {
    id: "location-1",
    question: "Where is Xhenvolt located?",
    answer: "We're proudly based in Uganda, serving clients across East Africa. Our local presence means we understand your business needs. 🇺🇬",
    keywords: ["location", "where", "uganda", "address", "office"],
    category: "company"
  },
  {
    id: "implementation-1",
    question: "How long does implementation take?",
    answer: "Implementation typically takes:\n• Sentra POS: 1-2 weeks\n• DRAIS: 2-3 weeks\n• Zyra SACCO: 3-4 weeks\n• Constra: 4-6 weeks\n• Inveto: 4-8 weeks\n\nWe provide full support and training throughout the process. ⏱️",
    keywords: ["implementation", "install", "setup", "how long", "time"],
    category: "services"
  },
  {
    id: "customization-1",
    question: "Can you customize solutions for my business?",
    answer: "Yes! All our solutions are highly customizable. We tailor them to fit your specific industry and business processes. 🎨",
    keywords: ["customize", "custom", "tailor", "specific", "industry"],
    category: "services"
  },
  {
    id: "integration-1",
    question: "Do your systems integrate with existing software?",
    answer: "Our solutions integrate seamlessly with most existing systems through APIs and standard protocols. We ensure smooth data flow. 🔗",
    keywords: ["integrate", "integration", "api", "existing", "connect"],
    category: "technical"
  },
  {
    id: "security-1",
    question: "How secure are your systems?",
    answer: "Security is our top priority. We use enterprise-grade encryption, regular backups, and comply with international standards. 🔒",
    keywords: ["security", "secure", "safe", "encryption", "backup"],
    category: "technical"
  },
  {
    id: "training-1",
    question: "Do you provide user training?",
    answer: "Yes! We provide comprehensive training for all users, including documentation, video tutorials, and hands-on sessions. 📖",
    keywords: ["training", "learn", "education", "tutorial", "guide"],
    category: "support"
  },
  {
    id: "mobile-1",
    question: "Are your solutions mobile-friendly?",
    answer: "All our solutions are fully responsive and mobile-optimized. We also have dedicated mobile apps for key features. 📱",
    keywords: ["mobile", "phone", "app", "responsive", "android", "ios"],
    category: "technical"
  },
  {
    id: "schools-1",
    question: "Which schools use DRAIS?",
    answer: "DRAIS is trusted by primary schools, secondary schools, and colleges across Uganda. It handles student records, fee management, grade books, and parent communication. 🏫",
    keywords: ["schools", "students", "education", "primary", "secondary", "college"],
    category: "products"
  },
  {
    id: "sacco-features-1",
    question: "What features does Zyra have for SACCOs?",
    answer: "Zyra includes member management, savings accounts, loan processing, share management, dividend calculations, financial reporting, and mobile banking integration. 💼",
    keywords: ["sacco", "members", "savings", "loans", "shares", "dividend", "banking"],
    category: "products"
  },
  {
    id: "construction-features-1",
    question: "What does Constra do for construction companies?",
    answer: "Constra manages project timelines, resource allocation, budget tracking, progress monitoring, contractor payments, and generates detailed construction reports. 🏗️",
    keywords: ["construction", "project", "budget", "timeline", "contractor", "progress"],
    category: "products"
  },
  {
    id: "pos-features-1",
    question: "What features does Sentra POS have?",
    answer: "Sentra includes sales processing, inventory management, customer profiles, receipt printing, payment integration (mobile money, cards), daily reports, and multi-location support. 🛍️",
    keywords: ["pos", "sales", "inventory", "customers", "payment", "receipt", "reports"],
    category: "products"
  },
  {
    id: "investment-features-1",
    question: "What does Inveto do for investment management?",
    answer: "Inveto tracks investment portfolios, calculates returns, manages client accounts, generates performance reports, handles compliance, and provides market analysis tools. 📊",
    keywords: ["investment", "portfolio", "returns", "clients", "performance", "market", "analysis"],
    category: "products"
  },
  {
    id: "trial-1",
    question: "Do you offer free trials?",
    answer: "Yes! We offer 30-day free trials for all our products. No commitment required - just call +256 741 341 483 to get started! 🆓",
    keywords: ["trial", "free", "test", "try", "evaluation"],
    category: "sales"
  },
  {
    id: "payment-1",
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, mobile money (MTN, Airtel), and major credit cards. Flexible payment plans available in UGX. 💳",
    keywords: ["payment", "pay", "money", "bank", "mobile money", "credit card"],
    category: "pricing"
  },
  {
    id: "contact-1",
    question: "How can I contact Xhenvolt?",
    answer: "📞 Phone: +256 741 341 483\n📧 Email: info@xhenvolt.com\n🌐 Website: xhenvolt.com\n\nWe're available 24/7 for support and consultations!",
    keywords: ["contact", "phone", "email", "reach", "talk"],
    category: "company"
  },
  {
    id: "experience-1",
    question: "How experienced is Xhenvolt?",
    answer: "We've served 25+ clients with 100% satisfaction rate. Our team has deep expertise in software development and understanding of Ugandan business needs. 🏆",
    keywords: ["experience", "clients", "expertise", "years", "track record"],
    category: "company"
  },
  {
    id: "industries-1",
    question: "Which industries do you serve?",
    answer: "We serve schools (DRAIS), SACCOs (Zyra), construction companies (Constra), investment firms (Inveto), retail businesses (Sentra), and SMEs across Uganda and East Africa. 🏢",
    keywords: ["industries", "sectors", "business", "schools", "sacco", "retail", "construction", "investment"],
    category: "services"
  },
  {
    id: "cloud-1",
    question: "Do you offer cloud hosting?",
    answer: "Yes! We offer secure cloud hosting with 99.9% uptime guarantee. Your systems are accessible anywhere, anytime. ☁️",
    keywords: ["cloud", "hosting", "server", "online", "uptime"],
    category: "technical"
  }
];

// Step 4: AI System Prompt for Xhenvolt
const XHENVOLT_SYSTEM_PROMPT_FINAL = `You are the official Xhenvolt AI assistant. Use a concise, helpful, and professional tone. 

COMPANY INFO:
- Location: Uganda, East Africa
- Phone: +256 741 341 483
- Email: info@xhenvolt.com
- Products: DRAIS (School Management), Zyra (SACCO Management), Constra (Construction Management), Inveto (Investment Management), Sentra (POS System)

GUIDELINES:
- Prioritize clarity and action-oriented responses
- Always propose demos, share pricing when appropriate
- Offer to connect to human agents for complex queries  
- Include contact info when relevant
- Use Ugandan context (UGX currency, local business understanding)
- If uncertain, ask clarifying questions
- Keep responses under 150 words unless detailed explanation needed
- Use emojis appropriately to maintain friendly tone

TONE: Professional, helpful, confident, friendly, concise, locally aware.`;

// JSON-based conversation storage (Step 4)
const saveConversationToJSON = (session: ChatSession) => {
  if (typeof window !== 'undefined') {
    try {
      const sessions = JSON.parse(localStorage.getItem('xhenvolt-chat-sessions') || '[]');
      const existingIndex = sessions.findIndex((s: ChatSession) => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      // Keep only last 10 sessions
      const recentSessions = sessions.slice(-10);
      localStorage.setItem('xhenvolt-chat-sessions', JSON.stringify(recentSessions));
    } catch (error) {
      console.log('Failed to save conversation:', error);
    }
  }
};

const loadConversationHistory = (): ChatSession[] => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem('xhenvolt-chat-sessions') || '[]');
    } catch (error) {
      console.log('Failed to load conversation history:', error);
    }
  }
  return [];
};

interface ConversationalPattern {
  keywords: string[];
  response: string;
  tone: 'casual' | 'professional' | 'empathetic' | 'playful';
}

interface SentimentPattern {
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'excited' | 'confused';
  responseModifier: string;
}

// Step 5: Enhanced Conversational Patterns for Human Interaction
const XHENVOLT_CONVERSATIONAL_PATTERNS: ConversationalPattern[] = [
  {
    keywords: ["hi", "hello", "hey", "yo", "sup", "hiya"],
    response: "Hey there 👋 I'm Xhenvolt's AI assistant! How can I help you today?",
    tone: "casual"
  },
  {
    keywords: ["how are you", "how's it going", "how do you do", "what's up", "whatsup"],
    response: "I'm doing great, thanks for asking! 😊 Always ready to help with Xhenvolt stuff. What brings you here today?",
    tone: "casual"
  },
  {
    keywords: ["who are you", "what are you", "tell me about yourself"],
    response: "I'm your friendly Xhenvolt AI assistant! I help with questions about our software solutions, pricing, demos, and support. Think of me as your tech-savvy guide! 🤖",
    tone: "professional"
  },
  {
    keywords: ["what can you do", "what do you do", "help me", "how can you help"],
    response: "I can help you with:\n• Questions about DRAIS, Zyra, Constra, Inveto & Sentra\n• Pricing and demos\n• Technical support info\n• Just chatting if you want! 😄\n\nWhat interests you most?",
    tone: "professional"
  },
  {
    keywords: ["good morning", "morning", "good afternoon", "afternoon", "good evening", "evening"],
    response: "Good day to you! ☀️ I'm Xhenvolt's AI assistant, ready to brighten your day with helpful info. What can I do for you?",
    tone: "casual"
  },
  {
    keywords: ["nice to meet you", "pleasure to meet", "glad to meet"],
    response: "Likewise! Nice to meet you too 😊 I'm excited to help you discover what Xhenvolt can do for your business. Where should we start?",
    tone: "casual"
  },
  {
    keywords: ["you're funny", "you're cool", "you're awesome", "i like you"],
    response: "Aww, thanks! 😄 I try to keep things fun while being helpful. Want to chat about Xhenvolt or just hang out for a bit?",
    tone: "playful"
  },
  {
    keywords: ["you're annoying", "you're boring", "shut up", "stop"],
    response: "Oh, sorry about that! 😅 I can tone it down and keep things brief. Just let me know how I can better help you.",
    tone: "empathetic"
  },
  {
    keywords: ["i'm sad", "i'm upset", "feeling down", "bad day", "frustrated"],
    response: "I'm sorry to hear you're having a tough time 🫂 While I can't solve everything, maybe I can help with any work-related questions? Sometimes a small win helps! What's on your mind?",
    tone: "empathetic"
  },
  {
    keywords: ["i'm happy", "great day", "feeling good", "excited"],
    response: "That's wonderful to hear! 🎉 Your positive energy is contagious! Since you're in a great mood, want to explore something exciting about Xhenvolt's solutions?",
    tone: "playful"
  },
  {
    keywords: ["i'm busy", "no time", "quick question", "make it fast"],
    response: "Got it - I'll keep this snappy! ⚡ What's your quick question about Xhenvolt? I'm here to save you time, not waste it.",
    tone: "professional"
  },
  {
    keywords: ["just browsing", "just looking", "just checking", "exploring"],
    response: "Perfect! Feel free to browse around 👀 I'm here if anything catches your eye or if you have questions about our solutions. No pressure!",
    tone: "casual"
  },
  {
    keywords: ["are you real", "are you human", "are you a bot", "are you ai"],
    response: "I'm an AI assistant created by Xhenvolt! 🤖 Not human, but I try my best to be helpful and personable. Think of me as your digital teammate!",
    tone: "professional"
  },
  {
    keywords: ["can you help", "need help", "i need assistance"],
    response: "Absolutely! That's exactly what I'm here for 💪 Whether it's about DRAIS, Zyra, pricing, demos, or just general questions - I've got you covered. What do you need?",
    tone: "professional"
  },
  {
    keywords: ["amazing", "wow", "impressive", "that's great"],
    response: "Right? 🌟 Xhenvolt really does have some impressive solutions! Want to dive deeper into what caught your attention?",
    tone: "playful"
  }
];

const XHENVOLT_SENTIMENT_PATTERNS: SentimentPattern[] = [
  {
    keywords: ["love", "awesome", "amazing", "fantastic", "excellent", "perfect"],
    sentiment: "positive",
    responseModifier: "I'm so glad you feel that way! "
  },
  {
    keywords: ["hate", "terrible", "awful", "horrible", "worst", "sucks"],
    sentiment: "negative", 
    responseModifier: "I understand your frustration. Let me see how I can help make this better. "
  },
  {
    keywords: ["confused", "don't understand", "unclear", "complicated"],
    sentiment: "confused",
    responseModifier: "No worries, let me break this down simply for you. "
  },
  {
    keywords: ["excited", "can't wait", "thrilled", "pumped"],
    sentiment: "excited",
    responseModifier: "I love your enthusiasm! "
  }
];

// Enhanced greeting response function
const getResponseForGreeting = (userInput: string): string | null => {
  const input = userInput.toLowerCase().trim();
  
  // Check conversational patterns
  for (const pattern of XHENVOLT_CONVERSATIONAL_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (input.includes(keyword)) {
        return pattern.response;
      }
    }
  }
  
  // Check for sentiment modifiers
  let sentimentModifier = "";
  for (const sentiment of XHENVOLT_SENTIMENT_PATTERNS) {
    for (const keyword of sentiment.keywords) {
      if (input.includes(keyword)) {
        sentimentModifier = sentiment.responseModifier;
        break;
      }
    }
    if (sentimentModifier) break;
  }
  
  // Generic fallback for social interaction
  if (input.length < 20 && (
    input.includes("?") || 
    ["what", "how", "why", "when", "where"].some(w => input.includes(w))
  )) {
    return `${sentimentModifier}Hey there 👋 I'm Xhenvolt's assistant. Would you like to talk about our systems or just chat?`;
  }
  
  return null;
};

const IntelligentChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [aiBackendAvailable, setAiBackendAvailable] = useState(false);
  
  // Step 3: Context memory and conversation tracking
  const [context, setContext] = useState<ConversationContext>({
    userInterests: [],
    mentionedProducts: [],
    askedAboutPricing: false,
    requestedDemo: false,
    lastMessageTime: new Date(),
    conversationStage: 'greeting'
  });
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // Check if welcome message was already shown (localStorage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const welcomeShown = localStorage.getItem('xhenvolt-chat-welcome-shown');
      setHasShownWelcome(!!welcomeShown);
    }
  }, []);

  // Show welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasShownWelcome && messages.length === 0) {
      const timer = setTimeout(() => {
        const welcomeMessage: Message = {
          id: 'welcome-1',
          text: "👋 Hi — I'm Xhenvolt's AI Assistant. I can help with DRAIS, Zyra, Constra, Inveto, Sentra, pricing, demos, or support. Would you like to:",
          isUser: false,
          timestamp: new Date(),
          type: 'cta',
          ctaButtons: [
            { label: 'Ask a question', action: 'ask' },
            { label: 'View FAQs', action: 'faqs' },
            { label: 'Schedule a demo', action: 'demo' }
          ]
        };
        setMessages([welcomeMessage]);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('xhenvolt-chat-welcome-shown', 'true');
          setHasShownWelcome(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, hasShownWelcome, messages.length]);

  // Enhanced contextual response with personality
  const generatePersonalizedResponse = (userInput: string, currentContext: ConversationContext): string | null => {
    const input = userInput.toLowerCase();
    
    // First check for conversational patterns
    const greetingResponse = getResponseForGreeting(userInput);
    if (greetingResponse) {
      return greetingResponse;
    }
    
    // Follow-up on previous interests
    if (currentContext.mentionedProducts.length > 0) {
      const lastProduct = currentContext.mentionedProducts[currentContext.mentionedProducts.length - 1];
      const productInfo = XHENVOLT_BUSINESS_FACTS.products[lastProduct as keyof typeof XHENVOLT_BUSINESS_FACTS.products];
      
      if (input.includes('more') || input.includes('tell me') || input.includes('details')) {
        return `Great! Let me tell you more about ${productInfo.name}:\n\n✨ **${productInfo.type}**\n💰 Starting from ${productInfo.price}\n⏱️ Implementation: ${productInfo.timeline}\n🛠️ Full training & support included\n\nWould you like to see a demo or learn about specific features?`;
      }
      
      if (input.includes('price') || input.includes('cost')) {
        return `${productInfo.name} pricing starts from ${productInfo.price}. This includes:\n\n✅ Full system setup\n✅ User training\n✅ 24/7 support\n✅ Regular updates\n✅ Cloud hosting\n\nWe also offer flexible payment plans. Would you like a detailed quote? Call ${XHENVOLT_BUSINESS_FACTS.contact.phone}! 💰`;
      }
    }
    
    // Industry-specific responses with personality
    if (input.includes('school') || input.includes('education')) {
      return `Perfect! 🎓 DRAIS is our school management solution trusted by schools across Uganda. It handles:\n\n📚 Student records & enrollment\n📊 Grade management & report cards\n💰 Fee collection & tracking\n📱 Parent communication portal\n📈 Analytics & insights\n\nImplementation takes 2-3 weeks. Would you like to see it in action?`;
    }
    
    if (input.includes('sacco') || input.includes('microfinance')) {
      return `Excellent choice! 🏦 Zyra is our SACCO management system used by microfinance institutions. Features include:\n\n👥 Member management\n💰 Savings & loan processing\n📊 Share management\n📈 Financial reporting\n🏦 Mobile banking integration\n💳 Payment processing\n\nStarting from UGX 600,000/year. Want a demo?`;
    }
    
    if (input.includes('construction') || input.includes('contractor')) {
      return `Great choice! 🏗️ Constra helps construction companies manage:\n\n🔨 Project planning & timelines\n💰 Budget tracking & costs\n👷 Resource allocation\n📊 Progress monitoring\n💳 Contractor payments\n📈 Detailed reporting\n\nImplementation: 4-6 weeks. Ready to see how it works?`;
    }
    
    // Progressive conversation flow
    if (currentContext.conversationStage === 'interested' && !currentContext.requestedDemo) {
      if (input.includes('yes') || input.includes('sure') || input.includes('okay')) {
        return `Fantastic! 🎉 Let me connect you with our demo team:\n\n📞 **Call**: ${XHENVOLT_BUSINESS_FACTS.contact.phone}\n📧 **Email**: ${XHENVOLT_BUSINESS_FACTS.contact.email}\n\nOr I can take your details and have them call you back within 2 hours. What works better for you?`;
      }
    }
    
    return null;
  };

  // Context-aware response generation
  const generateContextualResponse = (userInput: string, currentContext: ConversationContext): string | null => {
    const input = userInput.toLowerCase();
    
    // Follow-up on previous interests
    if (currentContext.mentionedProducts.length > 0) {
      const lastProduct = currentContext.mentionedProducts[currentContext.mentionedProducts.length - 1];
      const productInfo = XHENVOLT_BUSINESS_FACTS.products[lastProduct as keyof typeof XHENVOLT_BUSINESS_FACTS.products];
      
      if (input.includes('more') || input.includes('tell me') || input.includes('details')) {
        return `Great! Let me tell you more about ${productInfo.name}:\n\n✨ **${productInfo.type}**\n💰 Starting from ${productInfo.price}\n⏱️ Implementation: ${productInfo.timeline}\n🛠️ Full training & support included\n\nWould you like to see a demo or learn about specific features?`;
      }
      
      if (input.includes('price') || input.includes('cost')) {
        return `${productInfo.name} pricing starts from ${productInfo.price}. This includes:\n\n✅ Full system setup\n✅ User training\n✅ 24/7 support\n✅ Regular updates\n✅ Cloud hosting\n\nWe also offer flexible payment plans. Would you like a detailed quote? Call ${XHENVOLT_BUSINESS_FACTS.contact.phone}! 💰`;
      }
    }
    
    // Industry-specific responses
    if (input.includes('school') || input.includes('education')) {
      return `Perfect! DRAIS is our school management solution trusted by schools across Uganda. It handles:\n\n🎓 Student records & enrollment\n📊 Grade management & report cards\n💰 Fee collection & tracking\n📱 Parent communication portal\n📈 Analytics & insights\n\nImplementation takes 2-3 weeks. Would you like to see it in action?`;
    }
    
    if (input.includes('sacco') || input.includes('microfinance')) {
      return `Excellent! Zyra is our SACCO management system used by microfinance institutions. Features include:\n\n👥 Member management\n💰 Savings & loan processing\n📊 Share management\n📈 Financial reporting\n🏦 Mobile banking integration\n💳 Payment processing\n\nStarting from UGX 600,000/year. Want a demo?`;
    }
    
    if (input.includes('construction') || input.includes('contractor')) {
      return `Great choice! Constra helps construction companies manage:\n\n🏗️ Project planning & timelines\n💰 Budget tracking & costs\n👷 Resource allocation\n📊 Progress monitoring\n💳 Contractor payments\n📈 Detailed reporting\n\nImplementation: 4-6 weeks. Ready to see how it works?`;
    }
    
    // Progressive conversation flow
    if (currentContext.conversationStage === 'interested' && !currentContext.requestedDemo) {
      if (input.includes('yes') || input.includes('sure') || input.includes('okay')) {
        return `Fantastic! 🎉 Let me connect you with our demo team:\n\n📞 **Call**: ${XHENVOLT_BUSINESS_FACTS.contact.phone}\n📧 **Email**: ${XHENVOLT_BUSINESS_FACTS.contact.email}\n\nOr I can take your details and have them call you back within 2 hours. What works better for you?`;
      }
    }
    
    return null;
  };

  // Enhanced keyword matching with context
  const findMatchingFAQ = (userInput: string, context: ConversationContext): FAQ | null => {
    const input = userInput.toLowerCase().trim();
    
    // Boost scores for previously mentioned products
    const contextBoost = (faq: FAQ): number => {
      let boost = 0;
      context.mentionedProducts.forEach(product => {
        if (faq.keywords.includes(product)) boost += 5;
      });
      return boost;
    };
    
    // Direct question match first
    const directMatch = XHENVOLT_FAQS.find(faq => 
      faq.question.toLowerCase().includes(input) || 
      input.includes(faq.question.toLowerCase().split('?')[0])
    );
    if (directMatch) return directMatch;

    // Keyword scoring with context boost
    const faqScores = XHENVOLT_FAQS.map(faq => {
      const score = faq.keywords.reduce((acc, keyword) => {
        if (input.includes(keyword)) {
          return acc + keyword.length;
        }
        return acc;
      }, 0) + contextBoost(faq);
      return { faq, score };
    });

    // Find best match (minimum score threshold of 3)
    const bestMatch = faqScores
      .filter(item => item.score >= 3)
      .sort((a, b) => b.score - a.score)[0];

    return bestMatch ? bestMatch.faq : null;
  };

  // Update conversation context
  const updateContext = (userInput: string, botResponse: string) => {
    const input = userInput.toLowerCase();
    const newContext = { ...context };
    
    // Track mentioned products
    Object.keys(XHENVOLT_BUSINESS_FACTS.products).forEach(product => {
      if (input.includes(product) && !newContext.mentionedProducts.includes(product)) {
        newContext.mentionedProducts.push(product);
      }
    });
    
    // Track user interests
    if (input.includes('price') || input.includes('cost')) {
      newContext.askedAboutPricing = true;
    }
    
    if (input.includes('demo') || input.includes('show')) {
      newContext.requestedDemo = true;
    }
    
    // Update conversation stage
    if (newContext.mentionedProducts.length > 0 && !newContext.askedAboutPricing) {
      newContext.conversationStage = 'exploring';
    } else if (newContext.askedAboutPricing || newContext.requestedDemo) {
      newContext.conversationStage = 'interested';
    }
    
    newContext.lastMessageTime = new Date();
    setContext(newContext);
    
    // Update conversation history (keep last 10 exchanges)
    setConversationHistory(prev => 
      [...prev, `User: ${userInput}`, `Bot: ${botResponse}`].slice(-20)
    );
  };

  // Check AI backend availability on mount
  useEffect(() => {
    const checkAIBackend = async () => {
      try {
        const response = await fetch('/api/chat/health', { method: 'GET' });
        setAiBackendAvailable(response.ok);
      } catch {
        setAiBackendAvailable(false);
      }
    };
    
    checkAIBackend();
  }, []);

  // Save conversation periodically
  useEffect(() => {
    if (messages.length > 0) {
      const currentSession: ChatSession = {
        id: sessionId,
        messages,
        context,
        startTime: new Date(messages[0]?.timestamp || Date.now()),
        lastActivity: new Date()
      };
      
      saveConversationToJSON(currentSession);
    }
  }, [messages, context, sessionId]);

  // Enhanced AI response generation
  const generateAIResponse = async (userInput: string, conversationContext: ConversationContext): Promise<AIResponse> => {
    // Try real AI backend first (if available)
    if (aiBackendAvailable) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userInput,
            context: conversationContext,
            systemPrompt: XHENVOLT_SYSTEM_PROMPT_FINAL,
            conversationHistory: conversationHistory.slice(-6)
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            answer: data.answer,
            confidence: data.confidence || 0.8,
            source: 'ai',
            suggestedActions: data.suggestedActions
          };
        }
      } catch (error) {
        console.log('AI backend failed, using fallback:', error);
        setAiBackendAvailable(false);
      }
    }

    // JSON-based intelligent fallback
    return generateIntelligentFallback(userInput, conversationContext);
  };

  // Enhanced fallback with personality matching
  const generateIntelligentFallback = (userInput: string, currentContext: ConversationContext): AIResponse => {
    // First try personalized/conversational response
    const personalizedResponse = generatePersonalizedResponse(userInput, currentContext);
    if (personalizedResponse) {
      return {
        answer: personalizedResponse,
        confidence: 0.9,
        source: 'context',
        suggestedActions: getSuggestedActions(currentContext)
      };
    }
    
    // FAQ matching
    const matchedFAQ = findMatchingFAQ(userInput, currentContext);
    if (matchedFAQ) {
      return {
        answer: matchedFAQ.answer,
        confidence: 0.8,
        source: 'faq',
        suggestedActions: getSuggestedActions(currentContext)
      };
    }

    // Enhanced pattern-based responses with personality
    if (userInput.toLowerCase().includes('thank')) {
      const suggestions = currentContext.mentionedProducts.length > 0 
        ? "Would you like to know more about implementation or schedule a demo?"
        : "Would you like to explore our products or learn about pricing?";
      return {
        answer: `You're most welcome! 😊 ${suggestions}`,
        confidence: 0.9,
        source: 'context'
      };
    }

    if (userInput.toLowerCase().includes('bye') || userInput.toLowerCase().includes('goodbye')) {
      return {
        answer: `Goodbye! 👋 Thanks for chatting with me today. Remember, Xhenvolt is always here when you need us:\n\n📞 ${XHENVOLT_BUSINESS_FACTS.contact.phone}\n📧 ${XHENVOLT_BUSINESS_FACTS.contact.email}\n\nHave a wonderful day!`,
        confidence: 0.9,
        source: 'context'
      };
    }

    // Smart suggestions with friendly tone
    const suggestions = currentContext.mentionedProducts.length > 0
      ? `Since you're interested in ${currentContext.mentionedProducts.join(', ')}, would you like to know about:\n\n• Pricing and payment plans\n• Implementation timeline\n• Demo scheduling\n• Similar client success stories`
      : `I can help you with:\n\n• DRAIS (School Management)\n• Zyra (SACCO Management)\n• Constra (Construction Management)\n• Inveto (Investment Management)\n• Sentra (POS System)`;
    
    return {
      answer: `I'd love to help you with "${userInput}"! 🤔\n\n${suggestions}\n\nOr feel free to call our amazing team at ${XHENVOLT_BUSINESS_FACTS.contact.phone} for immediate assistance!`,
      confidence: 0.6,
      source: 'fallback',
      suggestedActions: ['Schedule Demo', 'View Pricing', 'Contact Support']
    };
  };

  // Get contextual action suggestions
  const getSuggestedActions = (currentContext: ConversationContext): string[] => {
    const actions: string[] = [];
    
    if (currentContext.mentionedProducts.length > 0 && !currentContext.requestedDemo) {
      actions.push('Schedule Demo');
    }
    
    if (currentContext.mentionedProducts.length > 0 && !currentContext.askedAboutPricing) {
      actions.push('View Pricing');
    }
    
    if (currentContext.conversationStage === 'interested') {
      actions.push('Contact Sales');
    }
    
    actions.push('View FAQs');
    
    return actions.slice(0, 3);
  };

  // Enhanced message handler with AI integration
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);

    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Enhanced AI response generation
    setTimeout(async () => {
      try {
        const aiResponse = await generateAIResponse(currentInput, context);
        
        setIsTyping(false);
        addBotMessage(aiResponse.answer, aiResponse.suggestedActions);
        updateContext(currentInput, aiResponse.answer);
        
      } catch (error) {
        console.error('Error generating response:', error);
        setIsTyping(false);
        
        const errorResponse = `I'm having a small technical issue right now! 😅\n\nBut our amazing human team is always available:\n\n📞 ${XHENVOLT_BUSINESS_FACTS.contact.phone}\n📧 ${XHENVOLT_BUSINESS_FACTS.contact.email}\n\nThey'll take excellent care of you! 💙`;
        addBotMessage(errorResponse);
      }
    }, 800 + Math.random() * 1200);
  };

  // Enhanced addBotMessage with action suggestions
  const addBotMessage = (text: string, suggestedActions?: string[]) => {
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text,
      isUser: false,
      timestamp: new Date(),
      type: suggestedActions ? 'cta' : 'text',
      ctaButtons: suggestedActions?.map(action => ({
        label: action,
        action: action.toLowerCase().replace(' ', '_')
      }))
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Enhanced CTA click handler (finish implementation)
  const handleCTAClick = (action: string) => {
    switch (action) {
      case 'ask': {
        const inputEl = document.querySelector('#chat-input') as HTMLInputElement | null;
        if (inputEl) inputEl.focus();
        break;
      }
      case 'faqs': {
        const faqSummary = `Here are our most common questions by category:\n\n🏢 **Products**\n• What is DRAIS? (School Management)\n• What is Zyra? (SACCO Management)\n• What is Constra? (Construction Management)\n• What is Inveto? (Investment Management)\n• What is Sentra? (POS System)\n\n💰 **Pricing**\n• How much do solutions cost?\n• Payment methods?\n• Free trials?\n\n🎯 **Sales & Demos**\n• Schedule a demo\n• Implementation time\n• Customization options\n\n🛠️ **Support**\n• Technical support\n• Training provided\n• Data security\n\nJust ask me about any of these topics! 😊`;
        addBotMessage(faqSummary);
        break;
      }
      case 'demo':
      case 'schedule_demo': {
        addBotMessage(`I'd love to schedule a demo for you! 🎯\n\n📞 **Call**: ${XHENVOLT_BUSINESS_FACTS.contact.phone}\n📧 **Email**: ${XHENVOLT_BUSINESS_FACTS.contact.email}\n\nOur team will set up a personalized demo within 48 hours. Which product interests you most?`);
        setContext(prev => ({ ...prev, requestedDemo: true, conversationStage: 'interested' }));
        break;
      }
      case 'view_pricing': {
        addBotMessage(`Here's our pricing overview:\n\n💰 **Product Pricing:**\n• DRAIS: from UGX 800,000/year\n• Zyra: from UGX 600,000/year\n• Constra: from UGX 1,200,000/year\n• Inveto: from UGX 1,500,000/year\n• Sentra: from UGX 400,000/year\n\n✅ All plans include setup, training, support & updates\n\nCall ${XHENVOLT_BUSINESS_FACTS.contact.phone} for a personalized quote! 💰`);
        setContext(prev => ({ ...prev, askedAboutPricing: true }));
        break;
      }
      case 'contact_support':
      case 'contact_sales': {
        addBotMessage(`Ready to talk to our team? 🤝\n\n📞 **Phone**: ${XHENVOLT_BUSINESS_FACTS.contact.phone}\n📧 **Email**: ${XHENVOLT_BUSINESS_FACTS.contact.email}\n🌐 **Website**: ${XHENVOLT_BUSINESS_FACTS.contact.website}\n\nWe're available 24/7 and typically respond within 2 hours! Our team will be happy to discuss your specific needs.`);
        break;
      }
      default: {
        // Unknown/derived actions (e.g., 'schedule_demo', 'view_pricing' variants) are handled above;
        // log unknown actions without throwing to keep runtime stable.
        console.warn('Unrecognized CTA action:', action);
        break;
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Xhenvolt chat"
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[500px]'
        }`}>
          {/* Header with AI status indicator */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">X</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Xhenvolt AI Assistant</h3>
                <p className="text-xs text-white/80">
                  {aiBackendAvailable ? '🤖 AI Enhanced' : '📚 Smart Mode'} • Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M4 8l4-4 4 4" : "M20 12l-4-4-4 4"} />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-white text-gray-800 shadow-sm border'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                      
                      {/* CTA Buttons */}
                      {message.type === 'cta' && message.ctaButtons && (
                        <div className="flex flex-col gap-2 mt-3">
                          {message.ctaButtons.map((button, index) => (
                            <button
                              key={index}
                              onClick={() => handleCTAClick(button.action)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                              {button.label}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <p className={`text-xs mt-2 opacity-70 ${
                        message.isUser ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 shadow-sm border p-3 rounded-2xl max-w-[80%]">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">Xhenvolt AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    id="chat-input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about DRAIS, Zyra, Constra, pricing..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Xhenvolt AI • Always learning
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default IntelligentChatbot;