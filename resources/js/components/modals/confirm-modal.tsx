import CustomModal, {ModalContent, ModalDescription, ModalHeader, ModalTitle} from "@/components/modals/custom-modal";
import {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Form} from "@inertiajs/react";
import {RouteFormDefinition} from "@/wayfinder";

type ConfirmModalProps = {
    showModal: boolean;
    onClose: () => void;
    formAction?: RouteFormDefinition<"post">;
    onConfirm?: () => void;
    onSuccess?: () => void;
    title: string;
    id?: string;
    message?: string | null;
    // Extra data the formAction's route doesn't carry as a URL param (e.g. a target user id).
    fields?: Record<string, string | number>;
}

export default function ConfirmModal(
    {
        showModal,
        onClose,
        formAction,
        onConfirm,
        onSuccess,
        title,
        id,
        message = null,
        fields
    }: ConfirmModalProps): ReactNode {
    const {t} = useTranslation('modals');
    return (
        <CustomModal showModal={showModal} onClose={onClose} id={id ?? 'confirm'}>
            <Form
                {...formAction}
                onSuccess={onSuccess}
            >
                {() => (
                    <>
                        <ModalHeader>
                            <ModalTitle>
                                {title}
                            </ModalTitle>
                            <ModalDescription>
                                {message}
                            </ModalDescription>
                        </ModalHeader>
                        <ModalContent>
                            {fields && Object.entries(fields).map(([name, value]) => (
                                <input key={name} type="hidden" name={name} value={value}/>
                            ))}
                            <div className="grid grid-cols-2 gap-1 mt-2">
                                <Button
                                    variant="destructive"
                                    type="submit"
                                    onClick={onConfirm}
                                >
                                    {t('confirm')}
                                </Button>
                                <Button
                                    onClick={onClose}
                                    type="reset"
                                >
                                    {t('cancel')}
                                </Button>
                            </div>
                        </ModalContent>
                    </>
                )}
            </Form>
        </CustomModal>
    );
}
