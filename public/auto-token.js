// Auto token setter
(function() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjN2NiNjc5LWQ5NTItNDViZS1hNGJjLTkxMzU5NTQzZjk5YSIsImVtYWlsIjoianUudHJldml6YW5AaG90bWFpbC5jb20iLCJyb2xlIjoiY2xpZW50IiwiY29tcGFueUlkIjoiYjkxNGYxMzMtMGNkZC00Zjc3LTkxMjYtNjFkMDkzOWY5NjVjIiwiaWF0IjoxNzUxMDQ3OTM0LCJleHAiOjE3NTExMzQzMzR9.wx0u72asvpIhr4H5iHXaaCHiuPQUy6sj5uzspQaGj9k';
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'client');
    
    console.log('✅ Token definido automaticamente!');
    
    // Recarregar se não estiver na página principal
    if (window.location.pathname !== '/') {
        window.location.href = '/';
    }
})();
