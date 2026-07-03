import '@testing-library/jest-dom'

// Provide a dummy base URL so apiClient can build valid URLs during tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
