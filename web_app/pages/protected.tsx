import Layout from "../components/layout"

export default function ProtectedPage() {
  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>This page is now public. No sign-in required.</p>
    </Layout>
  )
}
