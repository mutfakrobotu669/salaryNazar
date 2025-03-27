import React from 'react'
import { CalculatorProvider } from './contexts/CalculatorContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CalculatorView from './components/calculator/CalculatorView'
import LivePreview from './components/ui/LivePreview'

function App() {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="container flex-grow py-8">
            <CalculatorView />
          </main>
          <Footer />
          <LivePreview />
        </div>
      </CalculatorProvider>
    </ThemeProvider>
  )
}

export default App
