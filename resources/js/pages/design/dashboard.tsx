import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import type {BreadcrumbItem} from "@/types";
import {dashboard} from "@/routes";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function DesignDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
                <section>
                    <h2>My next tasks</h2>
                    <ul>
                        <li>
                            <article>
                                <h3>Water the plants</h3>
                                <p>The plants in our appartment’s shared garden need constant watering and care, especially if it didn’t rain.</p>
                                <time>Monday 16/07, 13:00 - 19:00</time>
                            </article>
                        </li>
                    </ul>
                    <a href="{}"></a>
                </section>
        </AppLayout>
    );
}
