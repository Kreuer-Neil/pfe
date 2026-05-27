import ModalCast from "@/components/modals/modal-cast";
import Button from "@/components/buttons/button";
import CustomModal from "@/components/modals/custom-modal";
import {ReactNode} from "react";
import {useTranslation} from "react-i18next";

type ConfirmModalProps = {
    showModal: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string | null;
}

export default function ConfirmModal(
    {
        showModal,
        onClose,
        onConfirm,
        title,
        message = null
    }: ConfirmModalProps): ReactNode {
    const {t} = useTranslation('modals');
    return (
        <CustomModal showModal={showModal} onClose={onClose} id="confirm">
            <ModalCast closeModal={onClose} title={title}>
                {message ?
                    <p>{message}</p>
                    : null}
                <div className="grid grid-cols-2 gap-1">
                    <Button textContent={t('confirm')} onClick={onConfirm}/>
                    <Button textContent={t('cancel')} onClick={onClose}/>
                </div>
            </ModalCast>
        </CustomModal>
    );
}
