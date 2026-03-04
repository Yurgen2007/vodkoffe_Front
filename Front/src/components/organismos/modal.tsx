import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

type PropsModal = {
  ModalTitle?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: () => void;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
};
export default function Modall({
  ModalTitle,
  children,
  isOpen,
  onOpenChange,
  size,
}: PropsModal) {
  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      size={size ?? "md"}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              {ModalTitle}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
