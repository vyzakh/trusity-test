import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

import Button from "./button";

type ConfirmModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  description?: string;
};

export default function ConfirmModal({
  isOpen,
  isLoading,
  onCancel,
  onConfirm,
  message,
  title,
  description,
}: ConfirmModalProps) {
  return (
    <Modal
      hideCloseButton={isLoading}
      isDismissable={!isLoading}
      isKeyboardDismissDisabled={isLoading}
      isOpen={isOpen}
      size="sm"
      onOpenChange={() => !isLoading && onCancel()}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <p>{message}</p>
          {description && (
            <p className="text-default-500 text-sm">{description}</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button disabled={isLoading} variant="flat" onPress={onCancel}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={isLoading}
            isLoading={isLoading}
            onPress={onConfirm}
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
