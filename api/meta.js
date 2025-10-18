export default async function handler(req, res) {
  // Habilita CORS para seu site poder chamar a API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Pega os dados do usuário
    const userAgent = req.headers['user-agent'] || '';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    const referer = req.headers.referer || req.headers.origin || '';
    
    // Dados do evento
    const eventData = {
      event_name: 'PageView',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: referer,
      user_data: {
        client_ip_address: clientIp.split(',')[0].trim(),
        client_user_agent: userAgent,
        fbc: req.cookies?.['_fbc'] || undefined,
        fbp: req.cookies?.['_fbp'] || undefined,
      },
    };

    // Remove campos undefined
    Object.keys(eventData.user_data).forEach(key => {
      if (eventData.user_data[key] === undefined) {
        delete eventData.user_data[key];
      }
    });

    const resposta = await fetch(
      'https://graph.facebook.com/v19.0/1304770100853595/events?access_token=EAFen0Q5rJtsBPkPoN2VLNmGODfdNs9lFuL4ilaCy76moMFyAIUb9ZCVj45QFK2RZBZCfWuq6LnUzVAG4MFC9kLVz5a1TM0QQYUJHY9YIBF5ZAy0oHmtTPu79W3wcVWDUKr3NZCtAmH0C3X9uaATFGzThvtRRVVRYJFeO25S0lfmTypL6LUvD3RlaK5OPfFyuz6AZDZD',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [eventData] }),
      }
    );

    const dados = await resposta.json();
    
    return res.status(resposta.ok ? 200 : 400).json({
      success: resposta.ok,
      ...dados
    });
    
  } catch (erro) {
    return res.status(500).json({ 
      erro: 'Erro ao enviar evento', 
      detalhes: erro.message 
    });
  }
}
