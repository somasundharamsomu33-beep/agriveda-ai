import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { sampleCropImages, sampleWeather, sampleMarketPrices, defaultCropCalendar, sampleCommunityPosts } from './src/data/mockData';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const getGeminiAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Initialize Groq AI Client (Ultra-fast Llama-3.3-70B Inference)
const callGroqAi = async ({
  messages,
  temperature = 0.5,
  jsonMode = false,
  model = 'llama-3.3-70b-versatile'
}): Promise<string | null> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'MY_GROQ_API_KEY' || apiKey.includes('YOUR_GROQ')) {
    return null;
  }
  try {
    const payload: any = {
      model,
      messages,
      temperature,
    };
    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Groq API Error:', res.status, errText);
      // If jsonMode failed, retry once without jsonMode
      if (jsonMode) {
        return callGroqAi({ messages, temperature, jsonMode: false, model });
      }
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('Groq API Fetch Error:', err);
    return null;
  }
};


// 1. API Route: Crop Analysis
app.post('/api/analyze-crop', async (req, res) => {
  try {
    const { cropType, soilType, farmArea, location, imageBase64, sampleImageId } = req.body;

    // Check if sample image ID was passed
    if (sampleImageId) {
      const found = sampleCropImages.find(s => s.id === sampleImageId);
      if (found) {
        return res.json({
          id: `report-${Date.now()}`,
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          cropType: cropType || found.crop,
          soilType: soilType || 'Red Loam Soil',
          location: location || 'Vellore, Tamil Nadu',
          imageUrl: found.url,
          detectedIssue: found.issue,
          confidence: 94,
          riskLevel: found.riskLevel,
          farmHealthScore: found.healthScore,
          cause: found.cause,
          treatment: found.treatment,
          prevention: found.prevention,
          fertilizerSuggestion: found.fertilizer,
          aiNotes: 'Analysis generated based on AgriVeda AI plant pathology database.'
        });
      }
    }

    // 1. PRIMARY AI ENGINE: Try Groq AI (Llama-3.3-70B) for ultra-fast Pathology & Agronomy diagnosis
    const groqRes = await callGroqAi({
      messages: [
        {
          role: 'system',
          content: `You are AgriVeda AI, an elite agricultural plant pathologist and agronomist. Analyze the crop details provided and respond strictly in valid JSON format with keys: cropType (string), soilType (string), location (string), detectedIssue (string), confidence (number 0-100), riskLevel ('Low'|'Medium'|'High'|'Critical'), farmHealthScore (number 0-100), cause (string), treatment (array of strings), prevention (array of strings), fertilizerSuggestion (string), aiNotes (string).`
        },
        {
          role: 'user',
          content: `Crop: ${cropType || 'Paddy / Rice'}, Soil: ${soilType || 'Red Loam'}, Location: ${location || 'Vellore, Tamil Nadu'}, Area: ${farmArea || 2.5} acres.`
        }
      ],
      jsonMode: true
    });

    if (groqRes) {
      try {
        const parsed = JSON.parse(groqRes);
        const defaultSample = sampleCropImages[0];
        return res.json({
          id: `report-${Date.now()}`,
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          cropType: parsed.cropType || cropType || 'Paddy / Rice',
          soilType: parsed.soilType || soilType || 'Red Soil',
          location: parsed.location || location || 'Vellore, Tamil Nadu',
          imageUrl: imageBase64 || defaultSample.url,
          detectedIssue: parsed.detectedIssue || 'Fungal Leaf Spot (Alternaria / Blast)',
          confidence: parsed.confidence || 94,
          riskLevel: parsed.riskLevel || 'High',
          farmHealthScore: parsed.farmHealthScore || 78,
          cause: parsed.cause || 'High ambient humidity (>80%) combined with leaf wetness and fungal spores.',
          treatment: parsed.treatment || ['Prune affected foliage safely', 'Apply Organic Neem Oil 5ml/L or Copper Oxychloride'],
          prevention: parsed.prevention || ['Maintain 60cm x 45cm spacing for sunlight canopy access', 'Drip irrigate at soil level'],
          fertilizerSuggestion: parsed.fertilizerSuggestion || 'NPK 19:19:19 @ 5g/L + Micronutrient foliar spray',
          aiNotes: parsed.aiNotes || 'Real-time AI pathology analysis powered by Groq Llama-3.3-70B.'
        });
      } catch (e) {
        console.error('Error parsing Groq crop analysis:', e);
      }
    }

    const ai = getGeminiAi();
    if (!ai) {
      // Fallback response if no API key is set
      const defaultSample = sampleCropImages[0];
      return res.json({
        id: `report-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        cropType: cropType || 'Tomato',
        soilType: soilType || 'Red Soil',
        location: location || 'Vellore, Tamil Nadu',
        imageUrl: defaultSample.url,
        detectedIssue: 'Early Blight Disease (Alternaria solani)',
        confidence: 92,
        riskLevel: 'High',
        farmHealthScore: 78,
        cause: 'High leaf wetness, humidity (>85%), and fungal spores spreading via soil rain splash.',
        treatment: [
          'Prune severely spotted lower leaves and burn them away from the field.',
          'Apply Copper Oxychloride 50 WP @ 2.5 g/L or Mancozeb fungicide spray.',
          'Spray in the early morning after dew dries off.'
        ],
        prevention: [
          'Maintain 60cm x 45cm spacing for adequate sunlight and airflow.',
          'Use paddy straw mulching to eliminate soil-to-leaf rain splash.',
          'Drip irrigate at soil level instead of overhead sprinkling.'
        ],
        fertilizerSuggestion: 'NPK 19:19:19 @ 5g/L + Neem oil 5ml/L spray every 10 days.',
        aiNotes: 'Simulated AI pathology analysis (Add Gemini API Key in Secrets for real-time vision diagnosis).'
      });
    }

    // Call Gemini for real AI analysis
    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    const promptText = `Examine this crop image and farm details:
Crop Type: ${cropType || 'Tomato/General'}
Soil Type: ${soilType || 'Loam'}
Location: ${location || 'India'}
Farm Area: ${farmArea || 1} acres

Provide an expert agricultural diagnosis in JSON format.
Include:
- detectedIssue: name of disease/pest or "Healthy Plant"
- confidence: integer percentage (e.g. 91)
- riskLevel: "High", "Medium", or "Low"
- farmHealthScore: integer from 1 to 100
- cause: concise description of causes and environmental vectors
- treatment: array of 3-4 clear step-by-step treatment instructions (fungicide/pesticide dosage and cultural practices)
- prevention: array of 3-4 preventative measures for future cycles
- fertilizerSuggestion: recommended NPK or organic fertilizer schedule`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts },
      config: {
        systemInstruction: 'You are AgriVeda AI, an elite agricultural plant pathologist and agronomist assistant. You output clear, practical JSON for farmers.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedIssue: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING },
            farmHealthScore: { type: Type.INTEGER },
            cause: { type: Type.STRING },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            fertilizerSuggestion: { type: Type.STRING }
          },
          required: ['detectedIssue', 'confidence', 'riskLevel', 'farmHealthScore', 'cause', 'treatment', 'prevention', 'fertilizerSuggestion']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');

    return res.json({
      id: `report-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      cropType: cropType || 'Crop',
      soilType: soilType || 'Red Soil',
      location: location || 'Vellore, Tamil Nadu',
      imageUrl: imageBase64 || sampleCropImages[0].url,
      detectedIssue: parsed.detectedIssue || 'Early Blight Disease',
      confidence: parsed.confidence || 90,
      riskLevel: parsed.riskLevel || 'Medium',
      farmHealthScore: parsed.farmHealthScore || 82,
      cause: parsed.cause || 'High humidity and airborne spores.',
      treatment: parsed.treatment || ['Apply organic fungicide spray.'],
      prevention: parsed.prevention || ['Practice crop rotation.'],
      fertilizerSuggestion: parsed.fertilizerSuggestion || 'Apply NPK 19:19:19.',
      aiNotes: 'Real-time Gemini 3.6 Flash Plant Pathology Analysis'
    });

  } catch (err: any) {
    console.error('Error in analyze-crop:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze crop image' });
  }
});

// 2. API Route: Voice / Chat Assistant (End-to-End Multimodal)
app.post('/api/voice-assistant', async (req, res) => {
  try {
    const { prompt, language = 'en', context, imageBase64 } = req.body;
    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }

    const ai = getGeminiAi();
    const userName = context?.farmerName || context?.name || 'Farmer';
    const userCrop = context?.cropType || 'Tomato';
    const userVariety = context?.cropVariety || 'Hybrid';
    const userSowingDate = context?.sowingDate || '';
    const userCropAge = context?.cropAgeDays || null;
    const userSoil = context?.soilType || 'Red Loam';
    const userIrrigation = context?.irrigationMethod || 'Drip Irrigation';
    const userArea = context?.farmArea || 2.5;
    const userLocation = context?.location || 'Vellore, Tamil Nadu';
    const userSeedVariety = context?.seedVariety || 'Traditional Nattu Variety';
    const userSeedBank = context?.seedBankName || 'Vellore Community Seed Vault';

    const lower = (prompt || '').toLowerCase();

    // 15-Category Intent Classifier
    let intentCategory = 'General Agricultural Question';
    if (imageBase64 || lower.includes('spot') || lower.includes('disease') || lower.includes('pest') || lower.includes('yellow') || lower.includes('fungus') || lower.includes('blight')) {
      intentCategory = 'Disease / Pest';
    } else if (lower.includes('seed bank') || lower.includes('community seed') || lower.includes('exchange seed') || lower.includes('heritage seed') || lower.includes('seed vault')) {
      intentCategory = 'Seed Bank';
    } else if (lower.includes('seed') || lower.includes('germination') || lower.includes('preservation') || lower.includes('sowing seed')) {
      intentCategory = 'Seed Information';
    } else if (lower.includes('fertilizer') || lower.includes('npk') || lower.includes('urea') || lower.includes('dap') || lower.includes('potash') || lower.includes('खाद') || lower.includes('உரம்')) {
      intentCategory = 'Fertilizer';
    } else if (lower.includes('weather') || lower.includes('spray today') || lower.includes('rain') || lower.includes('wind') || lower.includes('humidity') || lower.includes('வானிலை') || lower.includes('मौसम')) {
      intentCategory = 'Weather';
    } else if (lower.includes('when should i fertilize') || lower.includes('when should i harvest') || lower.includes('when should i irrigate') || lower.includes('calendar') || lower.includes('timeline') || lower.includes('stage')) {
      intentCategory = 'Crop Calendar';
    } else if (lower.includes('irrigation') || lower.includes('water') || lower.includes('drip') || lower.includes('moisture') || lower.includes('பாசனம்') || lower.includes('सिंचाई')) {
      intentCategory = 'Irrigation';
    } else if (lower.includes('soil') || lower.includes('ph') || lower.includes('clay') || lower.includes('loam') || lower.includes('மண்') || lower.includes('मिट्टी')) {
      intentCategory = 'Soil';
    } else if (lower.includes('mandi') || lower.includes('market') || lower.includes('price') || lower.includes('rate') || lower.includes('மண்டே') || lower.includes('भाव')) {
      intentCategory = 'Market / Mandi';
    } else if (lower.includes('expert') || lower.includes('doctor') || lower.includes('scientist') || lower.includes('agronomist')) {
      intentCategory = 'Agricultural Expert';
    } else if (lower.includes('buy') || lower.includes('vendor') || lower.includes('product') || lower.includes('pesticide bottle') || lower.includes('equipment')) {
      intentCategory = 'Vendor / Product';
    } else if (lower.includes('b2b') || lower.includes('bulk contract') || lower.includes('wholesale contract')) {
      intentCategory = 'B2B';
    } else if (lower.includes('b2c') || lower.includes('direct consumer') || lower.includes('retail customer')) {
      intentCategory = 'B2C';
    } else if (lower.includes('crop') || lower.includes('pruning') || lower.includes('spacing') || lower.includes('yield')) {
      intentCategory = 'Crop Management';
    }

    const langInstruction = language === 'ta' ? 'Respond strictly in clear, natural Tamil script (தமிழ்).' :
                            language === 'hi' ? 'Respond strictly in clear, natural Hindi script (हिंदी).' :
                            language === 'te' ? 'Respond strictly in clear, natural Telugu script (తెలుగు).' :
                            'Respond in clear, professional English.';

    const systemPrompt = `You are AgriVeda AI, an elite multilingual agricultural copilot for smallholder and commercial farmers.
FARMER CONTEXT:
- Farmer Name: ${userName}
- Crop: ${userCrop}
- Crop Variety: ${userVariety}
- Sowing Date: ${userSowingDate || 'Not specified'}
- Crop Age: ${userCropAge ? userCropAge + ' days' : 'Not specified'}
- Soil Type: ${userSoil}
- Irrigation Method: ${userIrrigation}
- Farm Area: ${userArea} acres
- Location: ${userLocation}
- Seed Variety: ${userSeedVariety}
- Seed Bank: ${userSeedBank}

RULES FOR RESPONSE STRUCTURE:
1. FIRST understand intent and classify query into one of these 15 categories:
   ['Crop Management', 'Disease / Pest', 'Soil', 'Fertilizer', 'Irrigation', 'Weather', 'Crop Calendar', 'Seed Information', 'Seed Bank', 'Market / Mandi', 'Agricultural Expert', 'Vendor / Product', 'B2B', 'B2C', 'General Agricultural Question']

2. If important context is missing (e.g. crop stage or image of yellow leaves):
   Ask a short targeted clarification question, but also provide an initial plausible explanation.

3. FOR FARMING/AGRONOMY QUESTIONS, use this format:
   🌾 Crop: ...
   📅 Crop Stage: ... (Ask for sowing/transplanting date if unavailable)
   💧 Recommendation: ...
   📋 Action: ...
   ⚠️ Important: Mention that fertilizer recommendations depend on soil test, variety, crop stage and local agricultural recommendations.

4. FOR DISEASE DIAGNOSIS (when image/symptoms presented):
   🌱 Crop: ...
   🔍 Possible Disease: ...
   📊 Confidence: ... (If confidence low: "I need a clearer image of the leaf/stem/fruit to make a better assessment.")
   🧪 Possible Cause: ...
   🌿 Recommended Management: (Organic / low-risk options, advice to follow product label & local expert guidance)
   🛡️ Prevention: ...

5. FOR WEATHER QUESTIONS:
   🌦️ Weather Risk: Low / Medium / High
   🚜 Recommendation: Suitable / Not recommended
   ⏰ Better Window: ...
   ⚠️ Reason: ... (Never invent weather data)

6. FOR SMART CROP CALENDAR:
   🌱 Stage 1
   🌿 Stage 2
   🌾 Stage 3
   🌻 Stage 4
   🚜 Harvest

7. FOR SEED BANK QUESTIONS:
   🌱 Seed Variety
   📦 Available Quantity
   📍 Seed Bank Location
   🌾 Crop Type
   📅 Storage Information
   🟢 Availability
   🌡️ Storage Condition
   📞 Contact / Exchange Request

LANGUAGE INSTRUCTION: ${langInstruction}`;

    // 1. PRIMARY AI ENGINE: Try Groq AI (Llama-3.3-70B) for ultra-fast Copilot response
    const userPromptText = prompt || 'Analyze farmer query for crop context and provide actionable guidance.';
    const groqRes = await callGroqAi({
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}\n\nProvide response in JSON format with keys: intentCategory (string), text (string), hasActionCard (boolean), actionType (string optional), actionTitle (string optional), actionDetails (string optional), suggestedFollowups (array of strings).`
        },
        {
          role: 'user',
          content: `Farmer Question: "${userPromptText}"`
        }
      ],
      jsonMode: true
    });

    if (groqRes) {
      let responseText = groqRes;
      let intentCat = intentCategory;
      let actionCardObj: any = null;
      let followupsArr: string[] = [
        'Calculate fertilizer dosage',
        'Check weather spray risk',
        'Explore Community Seed Bank'
      ];

      try {
        const parsed = JSON.parse(groqRes);
        if (parsed.text) responseText = parsed.text;
        if (parsed.intentCategory) intentCat = parsed.intentCategory;
        if (parsed.hasActionCard && parsed.actionType) {
          actionCardObj = {
            type: parsed.actionType,
            title: parsed.actionTitle || `${userCrop} AgriVeda Advisory`,
            data: {
              details: parsed.actionDetails || responseText,
              crop: userCrop,
              location: userLocation
            }
          };
        }
        if (Array.isArray(parsed.suggestedFollowups) && parsed.suggestedFollowups.length > 0) {
          followupsArr = parsed.suggestedFollowups;
        }
      } catch (e) {
        // Groq returned text directly - use it!
        responseText = groqRes;
      }

      return res.json({
        intentCategory: intentCat,
        text: responseText,
        actionCard: actionCardObj,
        suggestedFollowups: followupsArr
      });
    }

    if (!ai) {
      // Intelligent Multilingual Fallback Handler strictly adhering to AgriVeda AI prompt templates
      let replyText = '';
      let actionCard: any = null;
      let followups: string[] = [];

      if (intentCategory === 'Disease / Pest' || imageBase64) {
        // If image uploaded or symptoms mentioned
        if (!imageBase64 && (lower.includes('yellow') || lower.includes('spot'))) {
          // Missing context scenario: ask short clarification while giving initial explanation
          if (language === 'ta') {
            replyText = `வணக்கம் ${userName}, உங்கள் **${userCrop}** இலைகள் மஞ்சளாவதற்கு ஊட்டச்சத்து குறைபாடு அல்லது ஆரம்பகட்ட பூஞ்சை தாக்குதல் காரணமாக இருக்கலாம்.\n\n❓ **தெளிவான முடிவு பெற:**\nதயவுசெய்து பாதிப்படைந்த இலையின் புகைப்படத்தை பதிவேற்றவும். மேலும் பயிர் நட்டு எத்தனை நாட்கள் ஆகிறது என்பதை தெரிவிக்கவும்?\n\n🌱 **பயிர்:** ${userCrop}\n🔍 **ஆரம்பகட்ட சந்தேகம்:** இலை மஞ்சள் நோய் (Early Blight / Nitrogen Deficiency)\n🌿 **தற்காலிக நடவடிக்கை:** மிதமான நீர்ப்பாசனம் வழங்கி, இலை அடியில் பூச்சிகள் உள்ளதா என சரிபார்க்கவும்.`;
          } else if (language === 'hi') {
            replyText = `नमस्ते ${userName}, आपकी **${userCrop}** फसल में पत्तियों का पीलापन नाइट्रोजन की कमी या शुरुआती फफूंद संक्रमण के कारण हो सकता है।\n\n❓ **सटीक निदान के लिए:**\nकृपया प्रभावित पत्ती की फोटो अपलोड करें और बताएं कि रोपाई के कितने दिन हुए हैं?\n\n🌱 **फसल:** ${userCrop}\n🔍 **प्रारंभिक आकलन:** अर्ली ब्लाइट या नाइट्रोजन की कमी\n🌿 **अस्थायी सलाह:** अधिक पानी देने से बचें और सुबह पत्तियों के निचले हिस्से की जांच करें।`;
          } else if (language === 'te') {
            replyText = `నమస్తే ${userName}, మీ **${userCrop}** ఆకులు పసుపు రంగులోకి మారడానికి నత్రజని లోపం లేదా తొలిదశ శీలీంధ్ర సోకడం కారణం కావచ్చు.\n\n❓ **స్పష్టమైన అంచనా కోసం:**\nదయచేసి ప్రభావిత ఆకు ఫోటోను అప్‌లోడ్ చేయండి. అలాగే విత్తిన ఎన్ని రోజులవుతుందో చెప్పండి?\n\n🌱 **పంట:** ${userCrop}\n🔍 **ప్రాథమిక అంచనా:** ఆకు పసుపు తెగులు (Early Blight)\n🌿 **తక్షణ చర్య:** వేరు వద్ద నీరు నిలవకుండా చూసుకోండి.`;
          } else {
            replyText = `Hello ${userName}, yellowing in **${userCrop}** leaves can stem from nitrogen deficiency or early fungal blight.\n\n❓ **Clarification Needed:**\nCan you upload a photo of the affected leaves? Also tell me how many days after planting the crop is.\n\n🌱 **Crop:** ${userCrop}\n🔍 **Initial Assessment:** Fungal Leaf Spot / Nitrogen Stress\n🌿 **Temporary Advisory:** Avoid over-irrigation and inspect leaf undersides for aphid/thrips activity.`;
          }
        } else {
          // Standard Disease Detection structure
          if (language === 'ta') {
            replyText = `🌱 **பயிர்:** ${userCrop}\n🔍 **சாத்தியமான நோய்:** ஆரம்பகால கருகல் நோய் (Early Blight - Alternaria solani)\n📊 **நம்பகத்தன்மை:** 92%\n🧪 **சாத்தியமான காரணம்:** அதிக ஈரப்பதம் (>80%) மற்றும் காற்றில் பரவும் பூஞ்சை வித்துக்கள்.\n🌿 **பரிந்துரைக்கப்பட்ட மேலாண்மை:**\n1. பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி அழிக்கவும்.\n2. இயற்கை வேப்ப எண்ணெய் (5ml/L) அல்லது தயாரிப்பு லேபிளின்படி காப்பர் ஆக்சிகுளோரைடு தெளிக்கவும்.\n🛡️ **தடுப்பு முறைகள்:**\n• இலைகளின் மேல் நீர் தெளிப்பதை தவிர்க்கவும் (சொட்டு நீர் பாசனம் பயன்படுத்தவும்).\n• செடிகளுக்கு இடையே 60செ.மீ இடைவெளி பராமரிக்கவும்.\n\n⚠️ *குறிப்பு: ரசாயன மருந்து தெளிக்கும் முன் தயாரிப்பு லேபிளை கவனமாக படித்து, உள்ளூர் வேளாண் விரிவாக்க அலுவலரின் ஆலோசனையைப் பெறவும்.*`;
          } else if (language === 'hi') {
            replyText = `🌱 **फसल:** ${userCrop}\n🔍 **संभावित रोग:** अगेती झुलसा (Early Blight)\n📊 **विश्वसनीयता:** 92%\n🧪 **संभावित कारण:** उच्च आर्द्रता (>80%) और हवा में फफूंद बीजाणुओं का प्रसार।\n🌿 **अनुशंसित प्रबंधन:**\n1. प्रभावित निचली पत्तियों को हटाकर नष्ट करें।\n2. जैविक नीम तेल (5ml/L) या उत्पाद लेबल के अनुसार कॉपर ऑक्सीक्लोराइड का छिड़काव करें।\n🛡️ **बचाव:**\n• पत्तियों पर ऊपर से पानी देने से बचें (ड्रिप सिंचाई का उपयोग करें)।\n• पौधों के बीच 60 सेमी की दूरी बनाए रखें।\n\n⚠️ *महत्वपूर्ण: कीटनाशक/फफूंदनाशी का उपयोग उत्पाद लेबल और स्थानीय कृषि विशेषज्ञ के परामर्श के अनुसार ही करें।*`;
          } else {
            replyText = `🌱 **Crop:** ${userCrop}\n🔍 **Possible Disease:** Early Blight Fungal Spot (Alternaria solani)\n📊 **Confidence:** 92%\n🧪 **Possible Cause:** High ambient humidity (>80%) coupled with airborne fungal spores.\n🌿 **Recommended Management:**\n1. Prune and safely dispose of severely infected lower foliage.\n2. Apply organic Neem Oil extract (5ml/L) or Copper Oxychloride as per product label.\n🛡️ **Prevention:**\n• Avoid overhead sprinkler watering to minimize leaf wetness.\n• Ensure proper row spacing (60cm x 45cm) for sunlight canopy access.\n\n⚠️ *Important: Always strictly follow product label instructions and local agricultural officer recommendations for exact chemical spray dosages.*`;
          }
        }

        actionCard = {
          type: 'diagnosis',
          title: `${userCrop} Disease Assessment`,
          data: {
            detectedIssue: 'Early Blight (Alternaria solani)',
            confidence: 92,
            riskLevel: 'Medium',
            treatment: ['Prune affected lower leaves', 'Spray Organic Neem Oil 5ml/L'],
            prevention: ['Drip irrigation at root level', 'Maintain 60cm row spacing']
          }
        };
        followups = [
          'What organic bio-pesticides can I use?',
          'When is the best time of day to spray?',
          'Ask agricultural expert'
        ];

      } else if (intentCategory === 'Fertilizer') {
        // AI Agronomist Structure for Fertilizer
        if (!userSowingDate) {
          replyText = `🌾 **பயிர் / Crop:** ${userCrop}\n📅 **பயிர் பருவம் / Crop Stage:** நட்ட தேதியை (Sowing Date) கூறவும். (Defaulting to Flowering Phase - Day 30)\n💧 **பரிந்துரை / Recommendation:** ${userArea} ஏக்கர் நிலத்திற்கு நைட்ரஜன் மற்றும் பொட்டாஷ் சத்து வழங்கவும்.\n📋 **செயல்முறை / Action:**\n1. யூரியா (Urea): 40 கிலோ / ஏக்கர்\n2. DAP: 25 கிலோ / ஏக்கர்\n3. MOP (பொட்டாஷ்): 20 கிலோ / ஏக்கர்\n⚠️ **முக்கியம் / Important:** உரப் பரிந்துரைகள் மண் பரிசோதனை, பயிர் ரகம், பயிர் பருவம் மற்றும் உள்ளூர் வேளாண் பரிந்துரைகளை சார்ந்தது.`;
        } else {
          replyText = `🌾 **Crop:** ${userCrop} (${userVariety})\n📅 **Crop Stage:** Sowing Date: ${userSowingDate} (Vegetative / Flowering Phase)\n💧 **Recommendation:** Split application of NPK nutrients tailored for ${userArea} Acres in ${userSoil}.\n📋 **Action:**\n1. Basal Top Dressing: Urea 45 kg + DAP 30 kg + Potash 25 kg.\n2. Foliar Boost: Spray 19:19:19 NPK @ 5g/L during early morning.\n⚠️ **Important:** Fertilizer dosage recommendations strictly depend on soil testing, crop variety, crop age stage, and local agricultural recommendations.`;
        }

        actionCard = {
          type: 'fertilizer',
          title: `Custom Fertilizer Schedule (${userArea} Acres)`,
          data: {
            crop: userCrop,
            acres: userArea,
            ureaKg: Math.round(userArea * 18),
            dapKg: Math.round(userArea * 12),
            mopKg: Math.round(userArea * 10)
          }
        };
        followups = ['Check fertilizer prices', 'Schedule irrigation', 'Ask for organic compost formula'];

      } else if (intentCategory === 'Weather') {
        // Weather Intelligence structure
        replyText = `🌦️ **Weather Risk:** Low Risk (Ideal Morning Spray Window)\n🚜 **Recommendation:** Suitable for spraying between 7:00 AM - 9:30 AM\n⏰ **Better Window:** Today 7:15 AM - 9:15 AM (Wind speed < 10 km/h)\n⚠️ **Reason:** Current temp is 31°C, humidity 60%, rain risk only 10%. Afternoon wind velocity is expected to rise above 16 km/h.`;

        actionCard = {
          type: 'weather',
          title: `Spray Suitability & Weather Alert (${userLocation})`,
          data: {
            temp: 31,
            humidity: 60,
            rainChance: 10,
            windSpeed: 12,
            spraySafety: 'Suitable (7:00 AM - 9:30 AM)'
          }
        };
        followups = ['Will it rain tomorrow?', 'Irrigation advisory for today', 'Pest risk forecast'];

      } else if (intentCategory === 'Crop Calendar') {
        // Smart Crop Calendar timeline structure
        if (!userSowingDate) {
          replyText = `🌾 **Crop:** ${userCrop}\n📅 **Crop Calendar Query:**\nTo generate an accurate timeline, please tell me your **Sowing/Transplanting Date** and **Crop Variety**.\n\n🌱 **Stage 1 (Day 1-15):** Seed Nursery Bed & Basal Compost\n🌿 **Stage 2 (Day 16-40):** Foliar NPK Spray & Root Staking\n🌾 **Stage 3 (Day 41-75):** Flowering & Blossom Protection\n🌻 **Stage 4 (Day 76-100):** Fruit Set & Potash Drenching\n🚜 **Harvest (Day 101-120):** Selective Pick & Mandi Transport`;
        } else {
          replyText = `🌾 **Crop:** ${userCrop} | Sowing Date: ${userSowingDate}\n\n🌱 **Stage 1 (Sowing to Day 15):** Seedbed Preparation & Bio-fungicide Treatment\n🌿 **Stage 2 (Day 16 to 35):** Vegetative Growth & NPK Basal Dressing\n🌾 **Stage 3 (Day 36 to 65):** Flowering & Micro-nutrient Foliar Spray\n🌻 **Stage 4 (Day 66 to 90):** Fruit Set & Water Management\n🚜 **Harvest (Day 91 to 120):** Mature Picking & Mandi Marketing`;
        }

        actionCard = {
          type: 'crop_calendar',
          title: `${userCrop} Smart Crop Calendar Timeline`,
          data: {
            crop: userCrop,
            sowingDate: userSowingDate || 'Not specified'
          }
        };
        followups = ['Set reminder for Stage 2', 'When to apply flower booster?', 'Check harvest market price'];

      } else if (intentCategory === 'Seed Bank' || intentCategory === 'Seed Information') {
        // Community Seed Bank structure
        replyText = `🌱 **Seed Variety:** Country Tomato (Nattu Thakkali - Heirloom Heritage)\n📦 **Available Quantity:** 45 kg\n📍 **Seed Bank Location:** ${userSeedBank}, ${userLocation}\n🌾 **Crop Type:** ${userCrop} / Vegetables\n📅 **Storage Information:** Sun-dried seed pulp coated with wood ash stored in airtight copper urns.\n🟢 **Availability:** In Stock for Exchange\n🌡️ **Storage Condition:** Temp 24°C | Humidity 40% | Moisture 9.0%\n📞 **Contact:** M. Lakshmi Ammal (+91 98421 55432)`;

        actionCard = {
          type: 'seedbank',
          title: `Community Seed Bank Listing`,
          data: {
            variety: 'Country Tomato (Nattu Thakkali)',
            qtyKg: 45,
            location: userSeedBank,
            contact: 'M. Lakshmi Ammal (+91 98421 55432)'
          }
        };
        followups = ['How to preserve seeds organically?', 'Find heritage rice seeds', 'Request seed exchange'];

      } else if (intentCategory === 'Market / Mandi') {
        replyText = `📈 **Market Intelligence for ${userCrop}** (${userLocation}):\n\n• Current Average Mandi Price: **₹35 / kg** (+16.6% rise this week)\n• Best High-Demand Market: **Vellore Main Mandi** (₹36/kg)\n• AI Market Outlook: Festival demand is driving prices higher. Recommend harvesting mature produce within 48 hours.`;

        actionCard = {
          type: 'market',
          title: `${userCrop} Live Mandi Quote`,
          data: {
            crop: userCrop,
            avgPrice: 35,
            trend: '+16.6%'
          }
        };
        followups = ['Will prices drop next week?', 'Connect with wholesale vendor', 'Transport support near me'];

      } else {
        replyText = `Hello ${userName}! As your **AgriVeda AI Agronomist**, here is customized guidance for your **${userCrop}** crop (${userArea} Acres, ${userSoil}):\n\n1. **Soil & Irrigation:** Maintain 2-inch soil moisture depth. Avoid over-watering during high humidity.\n2. **Crop Nutrition:** Apply organic vermicompost @ 2 tonnes/acre along with Trichoderma bio-fungicide.\n3. **Pest Monitoring:** Inspect leaf undersides weekly. Spray Neem oil (5ml/L) as a preventative.`;
        followups = ['Calculate fertilizer dosage', 'Check weather spray risk', 'Browse Seed Bank'];
      }

      return res.json({
        text: replyText,
        intentCategory,
        actionCard,
        suggestedFollowups: followups
      });
    }

    // Call Gemini 3.6 Flash Multimodal API with strict structured system instructions
    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    const promptContent = prompt || 'Analyze this crop photo and provide structured pathology diagnosis and advice.';
    parts.push({ text: promptContent });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intentCategory: { type: Type.STRING },
            text: { type: Type.STRING },
            hasActionCard: { type: Type.BOOLEAN },
            actionType: { type: Type.STRING }, // 'fertilizer' | 'weather' | 'market' | 'diagnosis' | 'seedbank' | 'crop_calendar'
            actionTitle: { type: Type.STRING },
            actionDetails: { type: Type.STRING },
            suggestedFollowups: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['intentCategory', 'text', 'hasActionCard', 'suggestedFollowups']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    let actionCard: any = null;
    if (parsed.hasActionCard && parsed.actionType) {
      actionCard = {
        type: parsed.actionType,
        title: parsed.actionTitle || `${userCrop} AgriVeda Advisory`,
        data: {
          details: parsed.actionDetails || parsed.text,
          crop: userCrop,
          location: userLocation
        }
      };
    }

    return res.json({
      intentCategory: parsed.intentCategory || intentCategory,
      text: parsed.text || 'I have analyzed your query. Ensure adequate soil aeration and optimal irrigation schedule.',
      actionCard,
      suggestedFollowups: parsed.suggestedFollowups || [
        'Calculate fertilizer dosage',
        'Check weather forecast',
        'Explore Community Seed Bank'
      ]
    });

  } catch (err: any) {
    console.error('Error in voice-assistant:', err);
    res.status(500).json({ error: err.message || 'Failed to process voice request' });
  }
});

// 3. API Route: Weather & Alerts
app.get('/api/weather-alerts', (req, res) => {
  const location = req.query.location as string || 'Vellore, Tamil Nadu';
  res.json({
    ...sampleWeather,
    location
  });
});

// 4. API Route: Market Insights
app.get('/api/market-insights', (req, res) => {
  res.json({
    updatedTime: 'Today, 8:00 AM',
    items: sampleMarketPrices
  });
});

// 5. API Route: Smart Crop Calendar Generator
app.post('/api/crop-calendar', async (req, res) => {
  try {
    const { cropName, sowingDate } = req.body;
    if (cropName && cropName !== 'Tomato') {
      const ai = getGeminiAi();
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `Generate a 5-step key milestone calendar for growing ${cropName} starting from sowing date ${sowingDate || 'Today'}. Return JSON with totalDurationDays, and array of events [{dayNumber, dateStr, title, category, description, recommendedTime}]`,
          config: {
            responseMimeType: 'application/json'
          }
        });
        const parsed = JSON.parse(response.text || '{}');
        if (parsed.events) {
          return res.json({
            cropName,
            sowingDate: sowingDate || '01 June 2024',
            totalDurationDays: parsed.totalDurationDays || 110,
            events: parsed.events.map((e: any, idx: number) => ({
              id: `ev-${idx}`,
              dayNumber: e.dayNumber || (idx + 1) * 20,
              dateStr: e.dateStr || `Day ${e.dayNumber || (idx + 1) * 20}`,
              title: e.title,
              category: e.category || 'Inspection',
              description: e.description,
              completed: idx === 0,
              recommendedTime: e.recommendedTime || 'Morning'
            }))
          });
        }
      }
    }
    return res.json(defaultCropCalendar);
  } catch (err) {
    res.json(defaultCropCalendar);
  }
});

// 6. API Route: Community Ask
app.post('/api/community/ask', async (req, res) => {
  try {
    const { question, cropContext, authorName, authorLocation } = req.body;

    const newPost = {
      id: `post-${Date.now()}`,
      authorName: authorName || 'Ravi Kumar',
      authorLocation: authorLocation || 'Vellore, Tamil Nadu',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      timeAgo: 'Just now',
      question,
      cropContext: cropContext || 'General Crop',
      likesCount: 1,
      repliesCount: 1,
      replies: [] as any[]
    };

    const ai = getGeminiAi();
    let expertText = 'Thank you for your query. Ensure adequate soil aeration and apply balanced organic compost. Check leaves regularly for sucking insects.';
    if (ai) {
      try {
        const resp = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `Question from farmer (${cropContext || 'Crop'}): "${question}". Give an official 2-sentence expert solution.`,
          config: {
            systemInstruction: 'You are Dr. Swaminathan, Senior Agronomist at AgriVeda AI. Provide authoritative, helpful advice.'
          }
        });
        if (resp.text) expertText = resp.text;
      } catch (e) {
        console.error('Gemini error for community post:', e);
      }
    }

    newPost.replies.push({
      id: `rep-${Date.now()}`,
      authorName: 'Dr. S. Swaminathan (Agri Expert)',
      isExpert: true,
      text: expertText,
      timeAgo: 'Just now',
      likes: 1
    });

    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post question' });
  }
});

// 7. API Route: B2B/B2C Marketplace Listings & Quotes
app.get('/api/marketplace/listings', (req, res) => {
  res.json({
    produce: [
      { id: 'p-paddy', name: 'Seeraga Samba Heritage Rice', category: 'Grains & Millets', seller: 'Vellore Farmer Producer Co.', location: 'Vellore · 5 km', price: 65, retailPrice: 85, unit: 'kg', availableQty: 2400, rating: 4.9, image: '🌾', certified: true, tradeType: 'b2b', minOrderQty: 100, harvestDate: 'Harvested 10 days ago', sellerRole: 'collective' },
      { id: 'p-ragi', name: 'Pure Organic Ragi (Finger Millet)', category: 'Grains & Millets', seller: 'Salem Dryland Millet Collective', location: 'Salem · 45 km', price: 42, retailPrice: 58, unit: 'kg', availableQty: 1800, rating: 4.9, image: '🌱', certified: true, tradeType: 'both', minOrderQty: 25, harvestDate: 'Fresh Current Crop', sellerRole: 'farmer' },
      { id: 'p-moong', name: 'Organic Green Gram (Moong Dal)', category: 'Pulses', seller: 'Dharmapuri Pulses Hub', location: 'Dharmapuri · 30 km', price: 95, retailPrice: 125, unit: 'kg', availableQty: 1200, rating: 4.8, image: '🫘', certified: true, tradeType: 'b2b', minOrderQty: 50, harvestDate: 'Sun-dried pure lot', sellerRole: 'farmer' },
      { id: 'p1', name: 'Farm Fresh Country Tomato (Nattu)', category: 'Vegetables', seller: 'Ravi Farmers Group', location: 'Vellore · 8 km', price: 28, retailPrice: 38, unit: 'kg', availableQty: 850, rating: 4.8, image: '🍅', certified: true, tradeType: 'b2c', minOrderQty: 5, harvestDate: 'Picked Today Morning', sellerRole: 'farmer' },
      { id: 'p-chilli', name: 'Guntur Teja Sun-Dried Red Chilli', category: 'Spices', seller: 'Andhra Indigenous Seed Savers', location: 'Vellore · 12 km', price: 185, retailPrice: 230, unit: 'kg', availableQty: 600, rating: 4.9, image: '🌶️', certified: true, tradeType: 'both', minOrderQty: 10, harvestDate: 'Premium Export Lot', sellerRole: 'vendor' }
    ],
    inputs: [
      { id: 'i1', name: 'Neem-Coated Bio-Urea (45 kg Bag)', category: 'Fertilizer', seller: 'Sri Balaji Agri Input Store', location: 'Vellore · 4 km', price: 266, unit: 'bag', availableQty: 90, rating: 4.8, image: '🧺', subsidy: 'Government Subsidy Applied (DBT Approved)', tradeType: 'both', sellerRole: 'vendor' },
      { id: 'i2', name: 'Water Soluble DAP 18:46:0 (50 kg Bag)', category: 'Fertilizer', seller: 'Kisan Inputs Direct Outlet', location: 'Katpadi · 7 km', price: 1350, unit: 'bag', availableQty: 55, rating: 4.6, image: '🌱', subsidy: 'DBT Fertilizer Price Control Compliant', tradeType: 'both', sellerRole: 'vendor' },
      { id: 'i3', name: 'Certified KNS-2B Paddy Pureline Seeds', category: 'Seeds', seller: 'Tamil Nadu Farmers Seed Center', location: 'Vellore · 5 km', price: 68, unit: 'kg', availableQty: 450, rating: 4.9, image: '🌾', certified: true, tradeType: 'both', sellerRole: 'vendor' }
    ]
  });
});

app.post('/api/marketplace/quotes', async (req, res) => {
  try {
    const { productId, productName, quotedPrice, quantity, unit, buyerName } = req.body;
    const groqRes = await callGroqAi({
      messages: [
        {
          role: 'system',
          content: `You are an AI trade desk agent for AgriVeda Marketplace. Evaluate the buyer's offer price relative to prevailing market rates and respond strictly in JSON with keys: status ('Accepted'|'Responded'|'Countered'), counterPrice (number), text (string).`
        },
        {
          role: 'user',
          content: `Product: ${productName}, Quoted Price: ₹${quotedPrice}/${unit || 'kg'}, Quantity: ${quantity}.`
        }
      ],
      jsonMode: true
    });

    let status = 'Open';
    let text = `Quote request for ${productName} (₹${quotedPrice}/${unit || 'kg'}) successfully submitted to seller.`;
    if (groqRes) {
      try {
        const parsed = JSON.parse(groqRes);
        if (parsed.status) status = parsed.status;
        if (parsed.text) text = parsed.text;
      } catch (e) {}
    }

    res.json({
      id: `q-${Date.now()}`,
      product: productName,
      quantity: `${quantity} ${unit || 'kg'}`,
      buyer: buyerName || 'Buyer',
      quotedPrice: Number(quotedPrice),
      status,
      message: text
    });
  } catch (err) {
    res.status(500).json({ error: 'Quote processing error' });
  }
});

// 8. Dedicated Groq AI API Route: Fertilizer Guidance from Soil Analysis
app.post('/api/groq/fertilizer-advice', async (req, res) => {
  try {
    const { crop, area, nSoil, pSoil, kSoil, language = 'en' } = req.body || {};
    const groqRes = await callGroqAi({
      messages: [
        {
          role: 'system',
          content: `You are AgriVeda Groq AI Soil Nutritionist. Turn soil analysis data into plain-language advice with exact fertilizer bag dosages (Urea, DAP, MOP, FYM) and step-by-step application schedule for ${crop || 'Crop'} (${area || 1} acres). Soil N: ${nSoil}, P: ${pSoil}, K: ${kSoil}. Respond in JSON with keys: title (string), dosageSummary (string), stepByStepSchedule (array of strings), organicAlternatives (array of strings).`
        },
        {
          role: 'user',
          content: `Generate custom fertilizer advice for ${crop} with ${nSoil} N, ${pSoil} P, ${kSoil} K soil test.`
        }
      ],
      jsonMode: true
    });

    if (groqRes) {
      try {
        const parsed = JSON.parse(groqRes);
        return res.json(parsed);
      } catch (e) {}
    }

    res.json({
      title: `${crop || 'Crop'} Soil-Calibrated NPK Fertilizer Schedule`,
      dosageSummary: `Apply DAP 50kg/acre + MOP 25kg/acre as basal dose. Top dress Urea 45kg in 2 splits.`,
      stepByStepSchedule: [
        'Basal (Day 0): Mix DAP 50kg + MOP 25kg with 4 tonnes FYM compost.',
        'Vegetative (Day 25): Apply 50% Urea with light drip irrigation.',
        'Flowering (Day 50): Apply remaining Urea + 25kg MOP.'
      ],
      organicAlternatives: ['Neem Cake 100kg/acre', 'Vermi-compost 2 tonnes/acre', 'Bio-fertilizer Azospirillum']
    });
  } catch (err) {
    res.status(500).json({ error: 'Fertilizer advice error' });
  }
});

// 9. Dedicated Groq AI API Route: Smart Irrigation & Spray Timing
app.post('/api/groq/irrigation-advice', async (req, res) => {
  try {
    const { crop, location, humidity, temp, rainChance, language = 'en' } = req.body || {};
    const groqRes = await callGroqAi({
      messages: [
        {
          role: 'system',
          content: `You are AgriVeda Groq AI Irrigation & Spray Advisor. Analyze weather data (Temp ${temp}°C, Humidity ${humidity}%, Rain Chance ${rainChance}%) for ${crop || 'Crop'} at ${location || 'Farm'}. Respond in JSON with keys: isIrrigationNeeded (boolean), recommendedTime (string), sprayRisk (Low|Medium|High), reasoning (string), actionableTip (string).`
        },
        {
          role: 'user',
          content: `Weather check for ${crop} in ${location}.`
        }
      ],
      jsonMode: true
    });

    if (groqRes) {
      try {
        const parsed = JSON.parse(groqRes);
        return res.json(parsed);
      } catch (e) {}
    }

    res.json({
      isIrrigationNeeded: true,
      recommendedTime: '4:30 PM - 6:00 PM (Cooler Hours)',
      sprayRisk: humidity > 75 ? 'High' : 'Low',
      reasoning: `Atmospheric humidity at ${humidity}% with temperature ${temp}°C. Moist root zone prevents stress.`,
      actionableTip: 'Irrigate via drip system to keep foliage dry and avoid fungal spore spread.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Irrigation advice error' });
  }
});

// 10. Dedicated Groq AI API Route: Crop Selection & Variety Recommendations
app.post('/api/groq/crop-recommendations', async (req, res) => {
  try {
    const { soilType, location, season, farmArea, language = 'en' } = req.body || {};
    const groqRes = await callGroqAi({
      messages: [
        {
          role: 'system',
          content: `You are AgriVeda Groq AI Crop Planner. Recommend the top 3 high-yield, climate-resilient crops and heritage varieties for ${soilType || 'Soil'} in ${location || 'Region'} during ${season || 'Kharif/Rabi'}. Respond in JSON with keys: recommendedCrops (array of objects with cropName, variety, yieldExpectation, reasoning).`
        },
        {
          role: 'user',
          content: `Recommend crops for ${soilType} soil in ${location}.`
        }
      ],
      jsonMode: true
    });

    if (groqRes) {
      try {
        const parsed = JSON.parse(groqRes);
        return res.json(parsed);
      } catch (e) {}
    }

    res.json({
      recommendedCrops: [
        { cropName: 'Paddy / Rice', variety: 'Seeraga Samba / KNS-2B-S1', yieldExpectation: '22-25 Quintals/Acre', reasoning: 'High market demand & premium price bonus.' },
        { cropName: 'Ragi Finger Millet', variety: 'GPU-28 / Heritage Native', yieldExpectation: '12-15 Quintals/Acre', reasoning: 'Drought hardy with low fertilizer requirement.' },
        { cropName: 'Moong Dal (Green Gram)', variety: 'CO-8 / Pulses Line', yieldExpectation: '6-8 Quintals/Acre', reasoning: 'Short 70-day crop that enriches soil nitrogen.' }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Crop recommendation error' });
  }
});

// 7. API Route: Weekly Agri-Tip (Gemini Powered)
app.post('/api/weekly-agri-tip', async (req, res) => {
  try {
    const { location, cropType, month, language } = req.body || {};
    const currentMonth = month || new Date().toLocaleString('en-US', { month: 'long' });
    const userLocation = location || 'Vellore, Tamil Nadu';
    const primaryCrop = cropType || 'Tomato';

    const ai = getGeminiAi();
    if (!ai) {
      return res.json({
        title: `${currentMonth} Seasonal Care: Root Health & Moisture Safeguard`,
        category: 'Soil & Nutrition',
        seasonalBadge: `${currentMonth} • Seasonal Advisory`,
        tipText: `During ${currentMonth} in ${userLocation}, high atmospheric humidity and root zone wetness require extra vigilance for ${primaryCrop}. Ensure field drainage ridges are clear and roots stay well-aerated to prevent fungal wilting.`,
        actionableSteps: [
          'Drench root zone with Trichoderma viride bio-fungicide @ 5g/L water in early morning.',
          'Clear field drainage bunds to eliminate standing water after rain showers.',
          'Foliar spray Micronutrient Mix (Zinc + Boron) @ 2g/L to boost blossom retention.'
        ],
        impact: 'Protects crops from root rot and boosts flowering strength by up to 25% during monsoon.',
        locationUsed: userLocation,
        monthUsed: currentMonth,
        cropUsed: primaryCrop
      });
    }

    const langPrompt = language === 'ta' ? 'Write the title, tipText, and actionableSteps in Tamil (தமிழ்).' :
                       language === 'hi' ? 'Write the title, tipText, and actionableSteps in Hindi (हिंदी).' :
                       language === 'te' ? 'Write the title, tipText, and actionableSteps in Telugu (తెలుగు).' :
                       'Write in simple, practical English.';

    const promptText = `Generate a highly practical, localized, seasonal weekly farming tip for a farmer with these details:
- Location: ${userLocation}
- Primary Crop: ${primaryCrop}
- Current Month: ${currentMonth}
${langPrompt}

Provide JSON with properties:
- title: concise, catchy title for this week's seasonal tip
- category: one of ["Pest Protection", "Soil & Nutrition", "Water Management", "Harvest & Post-Harvest", "Seasonal Weather Care"]
- seasonalBadge: short text like "${currentMonth} • Local Advisory"
- tipText: 2-3 sentence explanation of what to do this week and why it is critical for this location and crop
- actionableSteps: array of 3 specific, step-by-step action points with exact dosages or practices
- impact: clear, measurable benefit (e.g., "Prevents 30% yield drop from fungal rot")`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are AgriVeda AI, an expert agronomist providing actionable, highly localized seasonal farming tips based on agricultural cycles in India.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            seasonalBadge: { type: Type.STRING },
            tipText: { type: Type.STRING },
            actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            impact: { type: Type.STRING }
          },
          required: ['title', 'category', 'seasonalBadge', 'tipText', 'actionableSteps', 'impact']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      title: parsed.title || `${currentMonth} Crop Care Tip`,
      category: parsed.category || 'Seasonal Weather Care',
      seasonalBadge: parsed.seasonalBadge || `${currentMonth} • Local Advisory`,
      tipText: parsed.tipText || `Essential seasonal management for ${primaryCrop} in ${userLocation}.`,
      actionableSteps: parsed.actionableSteps || [
        'Inspect leaf undersides for early pest presence.',
        'Maintain balanced drip irrigation based on soil moisture.',
        'Apply organic compost top-dressing.'
      ],
      impact: parsed.impact || 'Improves yield quality and crop stress resilience.',
      locationUsed: userLocation,
      monthUsed: currentMonth,
      cropUsed: primaryCrop
    });

  } catch (err: any) {
    console.error('Error generating weekly agri tip:', err);
    const currentMonth = req.body?.month || new Date().toLocaleString('en-US', { month: 'long' });
    const userLocation = req.body?.location || 'Vellore, Tamil Nadu';
    const primaryCrop = req.body?.cropType || 'Tomato';

    return res.json({
      title: `${currentMonth} Seasonal Care: Root Health & Moisture Safeguard`,
      category: 'Soil & Nutrition',
      seasonalBadge: `${currentMonth} • Seasonal Advisory`,
      tipText: `During ${currentMonth} in ${userLocation}, high atmospheric humidity and root zone wetness require extra vigilance for ${primaryCrop}. Ensure field drainage ridges are clear and roots stay well-aerated to prevent fungal wilting.`,
      actionableSteps: [
        'Drench root zone with Trichoderma viride bio-fungicide @ 5g/L water in early morning.',
        'Clear field drainage bunds to eliminate standing water after rain showers.',
        'Foliar spray Micronutrient Mix (Zinc + Boron) @ 2g/L to boost blossom retention.'
      ],
      impact: 'Protects crops from root rot and boosts flowering strength by up to 25% during monsoon.',
      locationUsed: userLocation,
      monthUsed: currentMonth,
      cropUsed: primaryCrop
    });
  }
});

// Vite & Static file setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriVeda AI server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

