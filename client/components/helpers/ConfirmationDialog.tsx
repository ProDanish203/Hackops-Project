import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const ConfirmationDialog = ({
  open,
  setOpen,
  alertType,
  onAccept,
}: {
  open: boolean;
  setOpen: any;
  alertType: string;
  onAccept: () => void;
}) => {
  const handleAction = () => {
    onAccept();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {alertType === "delete"
              ? "This action cannot be undone. This will permanently delete your account and remove your data from our servers"
              : "Are you sure you want to confirm this action? This will cancel the order and notify the user."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="dark:bg-neutral-900 dark:hover:bg-neutral-950"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            className="bg-red-500 hover:bg-red-600 text-darkText"
          >
            {alertType === "delete" ? "Delete" : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
