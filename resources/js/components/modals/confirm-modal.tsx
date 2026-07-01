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
        message = null
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
                            <div className="grid grid-cols-2 gap-1">
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