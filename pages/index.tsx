// pages/index.tsx
import Head from 'next/head'
import ImportForm from '@/components/ImportForm'

export default function Home() {
  return (
    <>
      <Head>
        <title>Import Data Penjualan</title>
        <meta name="description" content="Aplikasi import data penjualan dari Shopee, TikTok, dan Lazada" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ImportForm />
      </main>
    </>
  )
}
