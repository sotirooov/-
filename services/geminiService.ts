import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, ChallengeCategory } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API ключът липсва. Моля, задайте променливата на средата API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scenarioSchema = {
  type: Type.OBJECT,
  properties: {
    sender: { type: Type.STRING, description: 'За имейл/SMS сценарии, адрес на подателя. Незадължително.' },
    subject: { type: Type.STRING, description: 'За имейл/новинарски сценарии, тема или заглавие. Незадължително.' },
    body: { type: Type.STRING, description: 'Основният текст на сценария. За тип въпрос "identify_element" това ТРЯВА да бъде JSON низ, представляващ масив от обекти с ключове "text" (низ) и незадължителен "isCorrectPart" (булев).' },
    question: { type: Type.STRING, description: 'Въпросът, който да се зададе на потребителя относно сценария.' },
    questionType: { type: Type.STRING, enum: ['binary', 'multiple_choice', 'identify_element', 'multiple_select'], description: "Типът на въпроса. Редувайте типовете, като 'multiple_choice' (3-4 опции) е най-често срещан (~50%), последван от 'binary' (2 опции, ~30%). 'multiple_select' и 'identify_element' трябва да се използват по-рядко за разнообразие (~10% всеки)." },
    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Масив от възможни отговори. За "binary" трябва да има 2 опции. За "multiple_choice" и "multiple_select" трябва да има 3-5 опции. За "identify_element" трябва да е празен масив.' },
    correctAnswer: { type: Type.STRING, description: 'За "binary" и "multiple_choice", точният текст на верния отговор от масива с опции. За "identify_element" и "multiple_select" трябва да е празен низ.' },
    correctAnswers: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'ЗАДЪЛЖИТЕЛНО за "multiple_select": масив съдържащ всички верни отговори от масива с опции. За другите типове трябва да е празен масив.'}
  },
  required: ['body', 'question', 'questionType', 'options', 'correctAnswer', 'correctAnswers']
};

const getCategoryPrompt = (category: ChallengeCategory) => {
    switch(category) {
        case 'phishing':
            return 'Генерирай реалистичен сценарий за фишинг (имейл или SMS). Сценарият трябва да бъде предизвикателен, но с ясни индикации за измама, които потребителят да открие. Целта е да се обучи потребителят да разпознава фишинг атаки.';
        case 'daily':
            return 'Генерирай сценарий, свързан с ежедневната кибер хигиена за нетехнически потребители. Примерите включват сигурност на пароли, използване на обществен Wi-Fi, сигурност в социалните мрежи, онлайн пазаруване и др.';
        case 'work':
            return 'Генерирай сценарий, свързан с кибер хигиената на работното място. Примерите включват работа с поверителна информация, фирмени политики за сигурност, разпознаване на вътрешни заплахи, заключване на компютъра и др.';
        case 'fake_news':
            return 'Генерирай сценарий, свързан с разпознаването на фалшиви новини или дезинформация онлайн. Може да бъде заглавие на новина, публикация в социална мрежа или кратък текст. Целта е потребителят да се научи да оценява критично източниците и съдържанието.'
    }
}

export const generateScenario = async (category: ChallengeCategory): Promise<Scenario> => {
  const prompt = getCategoryPrompt(category);
  
  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: scenarioSchema,
          temperature: 1.2, // Higher temp for more creative/varied scenarios
        },
      });

      const scenario = JSON.parse(response.text) as Scenario;

      // Handle interactive scenario body parsing
      if (scenario.questionType === 'identify_element' && typeof scenario.body === 'string') {
        try {
          scenario.body = JSON.parse(scenario.body);
        } catch (e) {
          console.error("Грешка при парсване на тялото на интерактивен сценарий:", e);
          // Fallback or re-request might be needed in a real app
          throw new Error("AI генерира невалиден интерактивен сценарий.");
        }
      }

      return scenario;

  } catch (error) {
    console.error("Грешка при генериране на сценарий:", error);
    throw new Error("Неуспешно генериране на сценарий от AI. Моля, опитайте отново.");
  }
};

export const generateFeedback = async (scenario: Scenario, userAnswer: string): Promise<string> => {
  const correctAnswerText = scenario.correctAnswer || scenario.correctAnswers?.join(', ') || 'Интерактивен избор';
  const prompt = `Потребителят беше представен със следния сценарий за киберсигурност:
Сценарий: ${JSON.stringify(scenario.body)}
Въпрос към потребителя: ${scenario.question}
Верният отговор е: ${correctAnswerText}
Потребителят отговори: ${userAnswer}

Твоята задача е да предоставиш подробна и образователна обратна връзка.

1. Анализирай отговора на потребителя. Посочи дали е правилен или грешен.
2. Ако е грешен, обясни подробно ЗАЩО е грешен. Позови се на КОНКРЕТНИ ДУМИ ИЛИ ФРАЗИ от сценария, които са "червени флагове" или подвеждащи елементи (напр. "чувство за спешност в темата", "странен адрес на подателя", "граматически грешки", "подозрителен линк").
3. Предостави ясен съвет как потребителят може да подобри уменията си и да избегне подобни грешки в бъдеще.
4. Формулирай отговора по окуражаващ и образователен начин. Използвай приятелски тон. Отговорът трябва да е около 3-4 изречения.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
          temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Грешка при генериране на обратна връзка:", error);
    throw new Error("Неуспешно генериране на обратна връзка от AI.");
  }
};
