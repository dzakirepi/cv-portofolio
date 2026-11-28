---
title: Optimizing React Performance
date: 2025-04-28
readTime: 6 min read
cover: /images/blog/react-performance.svg
excerpt: Cara menemukan dan memperbaiki render berlebih di aplikasi React.
tags: React, Performance
---

Aplikasi React terasa lambat biasanya karena komponen di-render ulang lebih sering dari yang diperlukan.

## Ukur dulu, baru optimasi

Buka **React DevTools → Profiler**, rekam interaksi, lalu lihat komponen mana yang paling lama di-render.

## Teknik yang sering dipakai

1. **`React.memo`** untuk komponen yang menerima props yang sama berulang kali.
2. **`useMemo` dan `useCallback`** untuk perhitungan berat dan fungsi yang dikirim sebagai props.
3. **Pecah state** supaya perubahan kecil tidak memicu render seluruh halaman.
4. **Virtualisasi list** panjang dengan library seperti `react-window`.
5. **Code splitting** dengan `React.lazy` dan `Suspense`.

```jsx
const Chart = React.lazy(() => import('./Chart'))

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Chart />
    </Suspense>
  )
}
```

Optimasi tanpa pengukuran sering hanya menambah kompleksitas. Ukur, perbaiki bagian yang paling berdampak, lalu ukur lagi.
