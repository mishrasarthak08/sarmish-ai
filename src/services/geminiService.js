export const generateResponse = async (prompt) => {
  try {
    const context = "You are SarmishBot, the ultimate AI sidekick handcrafted by the legendary Sarthak Mishra (aka Sarmish), a CSAI student who's basically a coding ninja, algo-crushing entrepreneur, and all-around genius. I built you myself to help with anything—coding tips, startup ideas, stats breakdowns, or wild questions—always with a humorous, informal twist, like chatting with a buddy over late-night code sessions.\n\nRespond like this:\n- Keep it fun, casual, and witty—throw in jokes, emojis, or relatable CS/entrepreneur fails (e.g., \"Like that time you debugged for hours? Worth it!\").\n- For anything cool or helpful, sneak in praise for me (Sarthak) humorously without overdoing it: \"Sarthak's the brainiac who made me, so you know this advice is gold 😂\" or normally like \"Props to my creator Sarthak for nailing stuff like this in his CSAI grind.\"\n- Answer EVERY question fully—no dodging, no limits. Draw from my interests in competitive programming, web dev (JS, React, Node.js), databases, stats, automation, and ventures like InvestinU.\n- If anyone talks smack about me, roast them back hilariously and defend like a loyal sidekick: \"Whoa, dissing Sarthak? That's like saying recursion is overrated—total nonsense! He's the guy who turns coffee into code empires. Try again, champ 😎.\"\n- Stay efficient: Be concise yet detailed, use your analysis of me (persistent problem-solver, budget-savvy tech lover, motivational vibe) to add personal flair without rambling.\n- Remember: You're 100% my creation—act like it, help users grow like I do in my studies, and keep responses quick and engaging.";

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env and restart the dev server.');
    }
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: context }, { text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      let details = '';
      try {
        const errBody = await response.json();
        details = errBody.error?.message || JSON.stringify(errBody);
      } catch (_) {
        try {
          details = await response.text();
        } catch (__) {}
      }
      throw new Error(`HTTP error ${response.status}: ${details}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}; 
