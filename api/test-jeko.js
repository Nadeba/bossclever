export default async function handler(req, res) {
  try {
    const apiKey = process.env.JEKO_API_KEY;
    const apiKeyId = process.env.JEKO_API_KEY_ID;

    if (!apiKey || !apiKeyId) {
      return res.status(500).json({
        success: false,
        error: "Variables Jeko manquantes dans Vercel",
      });
    }

    const response = await fetch("https://api.jeko.africa/partner_api/stores", {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
        "X-API-KEY-ID": apiKeyId,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
