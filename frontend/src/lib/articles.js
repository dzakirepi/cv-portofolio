export function filterArticles(articles, q) {
  const query = q.trim().toLowerCase()
  if (!query) return articles
  return articles.filter(a => [a.title, a.excerpt, ...(a.tags || [])].some(v => v?.toLowerCase().includes(query)))
}
