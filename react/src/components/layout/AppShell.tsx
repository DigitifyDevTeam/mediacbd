import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Newsletter } from './Newsletter'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Aller au contenu
      </a>
      <ScrollToTop />
      <Header />
      <main id="contenu-principal" className="flex-1">
        <Outlet />
      </main>
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <Newsletter />
      </div>
      <Footer />
    </div>
  )
}
