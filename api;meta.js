export default async function handler(req, res) {
  try {
    const resposta = await fetch(
      'https://graph.facebook.com/v19.0/1304770100853595/events?access_token=EAFen0Q5rJtsBPkPoN2VLNmGODfdNs9lFuL4ilaCy76moMFyAIUb9ZCVj45QFK2RZBZCfWuq6LnUzVAG4MFC9kLVz5a1TM0QQYUJHY9YIBF5ZAy0oHmtTPu79W3wcVWDUKr3NZCtAmH0C3X9uaATFGzThvtRRVVRYJFeO25S0lfmTypL6LUvD3RlaK5OPfFyuz6AZDZD',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: 'PageView',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              event_source_url: req.headers.referer || 'https://seudominio.github.io',
              user_data: {
                client_user_agent: req.headers['user-agent'],
              },
            },
          ],
        }),
      }
    );

    const dados = await resposta.json();
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao enviar evento para Meta API', detalhes: erro.message });
  }
}
