import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { edit } from '@/routes/projects';
import { members as editMembers, permissions as editPermissions } from '@/routes/projects/edit';
import { IProjectSettings } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

type Props = PropsWithChildren<{
    project: IProjectSettings;
}>;

export default function ProjectSettingsLayout({ project, children }: Props) {
    const { t } = useTranslation('projects');
    const currentPath = usePage().url.split('?')[0];

    const navItems = [
        { title: t('project_settings_nav_general'), href: edit(project.slug).url },
        { title: t('project_settings_nav_members'), href: editMembers(project.slug).url },
        ...(project.user_role === 'admin'
            ? [{ title: t('project_settings_nav_permissions'), href: editPermissions(project.slug).url }]
            : []),
    ];

    return (
        <>
            <Heading title={t('project_settings')} description={project.name} />

            <div className="flex w-full flex-col lg:flex-row lg:max-w-4xl lg:mx-auto lg:space-x-12">
                <aside className="w-full max-w-xl lg:sticky lg:top-8 lg:w-48 lg:self-start">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {navItems.map((item) => (
                            <Button
                                key={item.href}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href}>{item.title}</Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="space-y-12">{children}</section>
                </div>
            </div>
        </>
    );
}
