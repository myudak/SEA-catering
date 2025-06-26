"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, MoreVertical, Save, X } from "lucide-react";
import { updateUserAction } from "../action";
import { toast } from "sonner";

type User = {
  user_id: string;
  full_name: string | null;
  role: "admin" | "user" | null;
  created_at: string;
  profile_picture_url: string | null;
};

interface UsersTableProps {
  users: User[];
  filteredUsers: User[];
  editingUserId: string | null;
  setEditingUserId: (id: string | null) => void;
  setUsers: (users: User[]) => void;
  getTimeAgo: (dateString: string) => string;
  getRoleBadgeColor: (role: string | null) => string;
}

export default function UsersTable({
  users,
  filteredUsers,
  editingUserId,
  setEditingUserId,
  setUsers,
  getTimeAgo,
  getRoleBadgeColor,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="py-4 text-gray-600 dark:text-gray-400">
          {filteredUsers.length === 0
            ? "No users found matching your criteria."
            : `Showing ${filteredUsers.length} of ${users.length} users`}
        </TableCaption>
        <TableHeader>
          <TableRow className="border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              User
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Role
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Joined
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-900 dark:text-white">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user, index) =>
            editingUserId === user.user_id ? (
              <TableRow
                key={user.user_id}
                className="border-gray-200 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10"
              >
                <TableCell className="py-6">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-blue-800">
                      {user.profile_picture_url ? (
                        <AvatarImage
                          src={user.profile_picture_url}
                          alt={user.full_name || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                          {user.full_name
                            ? user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.full_name || (
                          <span className="italic text-gray-500 dark:text-gray-400">
                            No name set
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {user.user_id}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-6">
                  <form
                    action={async (formData: FormData) => {
                      const update = await updateUserAction(formData);

                      if (update.success) {
                        toast.success("User updated successfully");
                        setEditingUserId(null);

                        const response = await fetch("/api/admin/users");
                        const data = await response.json();
                        setUsers(data.users || []);
                      } else {
                        console.error("Update failed:", update.error);
                        toast.error(`Failed to update user: ${update.error}`);
                      }
                    }}
                    className="space-y-3"
                  >
                    <input type="hidden" name="user_id" value={user.user_id} />
                    <div>
                      <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Role
                      </Label>
                      <Select name="role" defaultValue={user.role || "user"}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Profile Picture URL
                      </Label>
                      <Input
                        name="profile_picture_url"
                        defaultValue={user.profile_picture_url || ""}
                        placeholder="https://example.com/image.jpg"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => setEditingUserId(null)}
                        className="gap-1"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </TableCell>

                <TableCell className="py-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(user.created_at)}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-right py-6">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Editing...
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow
                key={user.user_id}
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="py-6">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700">
                      {user.profile_picture_url ? (
                        <AvatarImage
                          src={user.profile_picture_url}
                          alt={user.full_name || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white font-semibold">
                          {user.full_name
                            ? user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.full_name || (
                          <span className="italic text-gray-500 dark:text-gray-400">
                            No name set
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {user.user_id}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role || "user"}
                  </span>
                </TableCell>

                <TableCell className="py-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(user.created_at)}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-right py-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingUserId(user.user_id)}
                      className=" gap-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
            <TableCell
              colSpan={3}
              className="font-semibold text-gray-900 dark:text-white"
            >
              Total Users
            </TableCell>
            <TableCell className="text-right font-bold text-lg text-gray-900 dark:text-white">
              {filteredUsers.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
