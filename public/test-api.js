// Test login directly
const testLoginAPI = async () => {
  console.log('🔍 Testando login na API...')
  
  try {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ju.trevizan@hotmail.com',
        password: '12345678'
      })
    })
    
    console.log('📡 Status da resposta:', response.status)
    console.log('📡 Headers:', [...response.headers.entries()])
    
    const responseText = await response.text()
    console.log('📡 Resposta bruta:', responseText)
    
    if (response.ok) {
      const data = JSON.parse(responseText)
      console.log('✅ Login bem-sucedido:', data)
      
      if (data.token) {
        console.log('🔑 Token recebido:', data.token.substring(0, 20) + '...')
        
        // Test tickets API
        const ticketsResponse = await fetch('http://localhost:3001/api/v1/tickets?status=open', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('🎫 Status tickets:', ticketsResponse.status)
        const ticketsText = await ticketsResponse.text()
        console.log('🎫 Resposta tickets:', ticketsText)
        
        if (ticketsResponse.ok) {
          const ticketsData = JSON.parse(ticketsText)
          console.log('✅ Tickets carregados:', ticketsData)
        }
      }
    } else {
      console.log('❌ Falha no login:', responseText)
    }
    
  } catch (error) {
    console.error('💥 Erro na requisição:', error)
  }
}

// Run test
testLoginAPI()
