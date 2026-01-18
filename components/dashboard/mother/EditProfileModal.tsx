import * as React from "react";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
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

export function EditProfileModal({
  children,
}: {
  children: React.ReactElement;
}) {
  const user = useAppSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          (children.props as any).onClick?.(e);
          setOpen(true);
        },
      })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                defaultValue={user?.userName || ""}
                className="col-span-3"
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
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setOpen(false)}>
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
