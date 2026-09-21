import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('MediaCBD render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Une erreur est survenue</h1>
          <p style={{ color: '#555' }}>{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 999,
              border: 0,
              background: '#1a3d2e',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Recharger l’accueil
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
