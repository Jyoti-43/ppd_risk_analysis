import * as React from "react";
import { useAppSelector, useAppDispatch } from "@/src/app/Hooks/hook";
import {
  selectCurrentUser,
  updateUserName,
} from "@/src/app/redux/feature/user/userSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useUpdateNameMutation } from "@/src/app/redux/services/authApi";

export function EditProfileModal({
  children,
}: {
  children: React.ReactElement;
}) {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [updateName, { isLoading: isUpdating }] = useUpdateNameMutation();
  const [newName, setNewName] = useState(user?.userName || "");

  // Reset name when modal opens
  React.useEffect(() => {
    if (open) setNewName(user?.userName || "");
  }, [open, user?.userName]);

  const handleSave = async () => {
    if (!newName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    try {
      const res = await updateName({ name: newName }).unwrap();
      console.log(res);
      dispatch(updateUserName(newName));
      alert("Name updated successfully");
      setOpen(false);
    } catch (error) {
      console.log(error);
      alert("Failed to update name");
    }
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          (children.props as any).onClick?.(e);
          setOpen(true);
        },
      })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] p-5">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newName}
                className="col-span-3"
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                defaultValue={user?.email || ""}
                className="col-span-3"
                disabled
              />
              <p className="col-span-4  text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={isUpdating || newName === user?.userName}
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
