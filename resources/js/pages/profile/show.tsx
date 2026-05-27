import Layout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'

export default function show({}) {
    return (
        <Layout>
            <Head title="show"/>
            <h1 className="page-title">{'test'}</h1>
        </Layout>
    )
}
