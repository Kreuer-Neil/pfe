import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import {login} from '@/routes';
import {Form, Head} from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import Button from '@/components/buttons/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Spinner} from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import {useTranslation} from "react-i18next";
import GeneralInput from "@/components/form/general-input";

export default function Register() {
    const {t} = useTranslation('auth');

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register"/>
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({processing, errors}) => (
                    <>
                        <div className="grid gap-6">
                            <GeneralInput name="first_name" label={t('field_first_name')} required autoFocus
                            placeholder="John"/>
                            <InputError message={errors.first_name}/>

                            <GeneralInput name="last_name" label={t('field_last_name')} required
                            placeholder="Doe"/>
                            <InputError message={errors.last_name}/>

                            <GeneralInput name="email" label={t('field_email')} type="email" required
                            placeholder="john.doe@example.com"/>
                            <InputError message={errors.email}/>

                            <GeneralInput name="password" label={t('field_password')} type="password" required
                            placeholder={t('field_password_placeholder')}/>
                            <InputError message={errors.password}/>

                            <GeneralInput name="password_confirmation" label={t('field_password_confirmation')}
                                          type="password" required placeholder={t('field_password_confirmation_placeholder')}/>
                            <InputError message={errors.password_confirmation}/>

                            <Button type="submit"
                                textContent={t('create_account')}/>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {t('already_have_account')}{' '}
                            <TextLink href={login()}>
                                {t('log_in')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
