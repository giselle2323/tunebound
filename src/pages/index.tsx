import type { ReactElement } from 'react'
import Layout from '../layouts/main'
import type { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  return <p>hello world</p>
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
    <div> here i'm send me</div>
    </Layout>
  )
}

export default Home