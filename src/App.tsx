import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AboutPage } from './pages/AboutPage'
import { ArticlePage } from './pages/ArticlePage'
import { CategoryPage } from './pages/CategoryPage'
import { CharterPage } from './pages/CharterPage'
import { ContactPage } from './pages/ContactPage'
import { DirectoryDetailPage } from './pages/DirectoryDetailPage'
import { DirectoryPage } from './pages/DirectoryPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

function CategoryRoute({ slug }: { slug: string }) {
  return <CategoryPage fixedSlug={slug} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="actualites" element={<CategoryRoute slug="actualites" />} />
          <Route path="reglementation" element={<CategoryRoute slug="reglementation" />} />
          <Route path="marche" element={<CategoryRoute slug="marche" />} />
          <Route path="science" element={<CategoryRoute slug="science" />} />
          <Route path="culture" element={<CategoryRoute slug="culture" />} />
          <Route path="guides" element={<CategoryRoute slug="guides" />} />
          <Route path="article/:slug" element={<ArticlePage />} />
          <Route path="annuaire" element={<DirectoryPage />} />
          <Route path="annuaire/:slug" element={<DirectoryDetailPage />} />
          <Route path="a-propos" element={<AboutPage />} />
          <Route path="charte-editoriale" element={<CharterPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
