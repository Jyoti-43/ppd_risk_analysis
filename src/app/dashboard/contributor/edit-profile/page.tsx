"use client";

import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContributorEditProfile() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>
            Manage your contributor profile settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue={user?.userName || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline">Discard Changes</Button>
            <Button className="bg-primary hover:bg-[#ff5286]">
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
