import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AboutPage } from './pages/AboutPage'
import { AlertsPage } from './pages/AlertsPage'
import { ArticlePage } from './pages/ArticlePage'
import { CategoryPage } from './pages/CategoryPage'
import { CharterPage } from './pages/CharterPage'
import { ContactPage } from './pages/ContactPage'
import { DirectoryDetailPage } from './pages/DirectoryDetailPage'
import { DirectoryPage } from './pages/DirectoryPage'
import { EuropePage } from './pages/EuropePage'
import { HomePage } from './pages/HomePage'
import { LegalPage } from './pages/LegalPage'
import { LexiconPage } from './pages/LexiconPage'
import { MethodPage } from './pages/MethodPage'
import { NotFoundPage } from './pages/NotFoundPage'

function CategoryRoute({ slug }: { slug: string }) {
  return <CategoryPage fixedSlug={slug} />
}

function ActeursSlugRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/acteurs/${slug ?? ''}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />

          <Route path="radar" element={<CategoryRoute slug="radar" />} />
          <Route path="dossiers" element={<CategoryRoute slug="dossiers" />} />
          <Route path="qualite" element={<CategoryRoute slug="qualite" />} />
          <Route path="filiere" element={<CategoryRoute slug="filiere" />} />
          <Route path="mode-emploi" element={<CategoryRoute slug="mode-emploi" />} />

          <Route path="droit" element={<LegalPage />} />
          <Route path="europe" element={<EuropePage />} />
          <Route path="alertes" element={<AlertsPage />} />
          <Route path="lexique" element={<LexiconPage />} />
          <Route path="methode" element={<MethodPage />} />

          <Route path="article/:slug" element={<ArticlePage />} />
          <Route path="acteurs" element={<DirectoryPage />} />
          <Route path="acteurs/:slug" element={<DirectoryDetailPage />} />

          <Route path="a-propos" element={<AboutPage />} />
          <Route path="charte-editoriale" element={<CharterPage />} />
          <Route path="contact" element={<ContactPage />} />

          <Route path="actualites" element={<Navigate to="/radar" replace />} />
          <Route path="reglementation" element={<Navigate to="/droit" replace />} />
          <Route path="marche" element={<Navigate to="/filiere" replace />} />
          <Route path="science" element={<Navigate to="/qualite" replace />} />
          <Route path="culture" element={<Navigate to="/dossiers" replace />} />
          <Route path="guides" element={<Navigate to="/mode-emploi" replace />} />
          <Route path="annuaire" element={<Navigate to="/acteurs" replace />} />
          <Route path="annuaire/:slug" element={<ActeursSlugRedirect />} />
          <Route path="home" element={<Navigate to="/" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
