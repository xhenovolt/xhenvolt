/**
 * Bot & AI-crawler classification from the User-Agent string.
 *
 * HONESTY NOTE (see AI_CRAWLER_TRACKING.md): a User-Agent only tells us a
 * crawler *fetched* a page. It does NOT prove an AI model trained on or
 * answered from our content. We therefore report "likely AI crawler activity"
 * based on declared UA tokens — never certainty. UAs can also be spoofed.
 */

export interface BotClassification {
  isBot: boolean;
  botName: string | null;
  isAiCrawler: boolean;
  aiCrawlerName: string | null;
}

/** AI / LLM-related crawlers (token -> display name). */
const AI_CRAWLERS: Array<[RegExp, string]> = [
  [/GPTBot/i, "OpenAI GPTBot"],
  [/OAI-SearchBot/i, "OpenAI SearchBot"],
  [/ChatGPT-User/i, "ChatGPT-User"],
  [/ClaudeBot/i, "Anthropic ClaudeBot"],
  [/Claude-Web/i, "Anthropic Claude-Web"],
  [/anthropic-ai/i, "Anthropic"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/Perplexity-User/i, "Perplexity-User"],
  [/Google-Extended/i, "Google-Extended (AI)"],
  [/Applebot-Extended/i, "Applebot-Extended (AI)"],
  [/Meta-ExternalAgent/i, "Meta AI"],
  [/Bytespider/i, "ByteDance Bytespider"],
  [/CCBot/i, "Common Crawl (CCBot)"],
  [/cohere-ai/i, "Cohere"],
  [/Diffbot/i, "Diffbot"],
  [/YouBot/i, "You.com"],
  [/Amazonbot/i, "Amazonbot"],
  [/ImagesiftBot/i, "ImagesiftBot"],
];

/** Search / social / generic crawlers (token -> display name). */
const BOTS: Array<[RegExp, string]> = [
  [/Googlebot/i, "Googlebot"],
  [/Storebot-Google/i, "Google StoreBot"],
  [/AdsBot-Google/i, "Google AdsBot"],
  [/bingbot/i, "Bingbot"],
  [/Slurp/i, "Yahoo Slurp"],
  [/DuckDuckBot/i, "DuckDuckBot"],
  [/Baiduspider/i, "Baiduspider"],
  [/YandexBot/i, "YandexBot"],
  [/PetalBot/i, "PetalBot"],
  [/Applebot/i, "Applebot"],
  [/facebookexternalhit/i, "Facebook"],
  [/Facebot/i, "Facebook"],
  [/LinkedInBot/i, "LinkedInBot"],
  [/Twitterbot/i, "Twitter/X bot"],
  [/WhatsApp/i, "WhatsApp preview"],
  [/Slackbot/i, "Slackbot"],
  [/TelegramBot/i, "TelegramBot"],
  [/Discordbot/i, "Discordbot"],
  [/Pinterest/i, "Pinterest"],
  [/SemrushBot/i, "SemrushBot"],
  [/AhrefsBot/i, "AhrefsBot"],
  [/DotBot/i, "DotBot"],
  [/MJ12bot/i, "Majestic"],
  [/UptimeRobot/i, "UptimeRobot"],
  // Generic fallthrough tokens
  [/bot\b/i, "Generic bot"],
  [/crawler/i, "Generic crawler"],
  [/spider/i, "Generic spider"],
  [/headless/i, "Headless browser"],
];

export function classifyUserAgent(ua: string | null | undefined): BotClassification {
  const s = (ua ?? "").trim();
  if (!s) {
    // Empty UA is itself a strong bot signal.
    return { isBot: true, botName: "Unknown (no UA)", isAiCrawler: false, aiCrawlerName: null };
  }

  for (const [re, name] of AI_CRAWLERS) {
    if (re.test(s)) {
      return { isBot: true, botName: name, isAiCrawler: true, aiCrawlerName: name };
    }
  }
  for (const [re, name] of BOTS) {
    if (re.test(s)) {
      return { isBot: true, botName: name, isAiCrawler: false, aiCrawlerName: null };
    }
  }
  return { isBot: false, botName: null, isAiCrawler: false, aiCrawlerName: null };
}
