import { Link } from 'react-router-dom'
import type { Article } from '../../types/content'
import { ARTICLE_CATEGORIES } from '../../data/site'

interface NewsTickerProps {
  articles: Article[]
}

export function NewsTicker({ articles }: NewsTickerProps) {
  const items = articles.slice(0, 6)

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper-elevated/90 shadow-soft">
      <div className="flex items-stretch">
        <div className="flex shrink-0 items-center bg-forest px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper">
          Fil
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-[ticker_40s_linear_infinite] flex w-max gap-8 py-3 pl-4 pr-8">
            {[...items, ...items].map((article, index) => {
              const label =
                ARTICLE_CATEGORIES.find((item) => item.slug === article.category)?.label ?? article.category
              return (
                <Link
                  key={`${article.id}-${index}`}
                  to={`/article/${article.slug}`}
                  className="inline-flex items-center gap-3 whitespace-nowrap text-sm text-ink-soft hover:text-forest"
                >
                  <span className="font-semibold text-forest">{label}</span>
                  <span className="text-sage">◆</span>
                  <span>{article.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[ticker_40s_linear_infinite\\] {
            animation: none !important;
            transform: none !important;
            flex-wrap: wrap;
            width: auto !important;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  )
}
