import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import Button from '@/components/buttons/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Spinner} from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import {register} from '@/routes';
import password, {request} from '@/routes/password';
import {Form, Head} from '@inertiajs/react';
import {useTranslation} from "react-i18next";
import GeneralInput from "@/components/form/general-input";

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({status, canResetPassword}: LoginProps) {
    const {t} = useTranslation('auth');

    return (
        <AuthLayout
            title={t('account_log_in')}
            description={t('enter_password_bellow')}
        >
            <Head title={t('log_in')}/>

            <Form
                {...AuthenticatedSessionController.store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({processing, errors}) => (
                    <>
                        <div className="grid gap-6">
                            <GeneralInput name="email" type="email" label={t('field_email')}
                                          required autoFocus
                                          placeholder="email@example.com"/>
                            <InputError message={errors.email}/>

                            <GeneralInput name="password" label={t('field_password')} type="password" required/>
                            <InputError message={errors.password}/>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                />
                                <Label htmlFor="remember">{t('remember_me')}</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm"
                                >
                                    {t('forgot_password')}
                                </TextLink>
                            )}
                            </div>

                            <Button
                                type="submit"
                                data-test="login-button"
                                textContent={t('log_in')}/>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {t('no_account_yet')}{' '}
                            <TextLink href={register()}>
                                {t('sign_up')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
