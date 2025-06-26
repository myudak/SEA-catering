"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import TransitionLink from "@/components/TransitionLink";
import { ArrowLeft, Download, Shield } from "lucide-react";

interface HeaderProps {
  openDialogExport: boolean;
  setOpenDialogExport: (isOpen: boolean) => void;
  export2CSV: () => void;
}

export default function Header({
  openDialogExport,
  setOpenDialogExport,
  export2CSV,
}: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <TransitionLink
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </TransitionLink>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user roles, permissions, and profile information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setOpenDialogExport(true)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Dialog open={openDialogExport} onOpenChange={setOpenDialogExport}>
            <DialogContent>
              <div className="flex items-center justify-between mb-4">
                <DialogTitle>Export Users</DialogTitle>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click the button below to export all users as a CSV file.
              </p>
              <Button onClick={export2CSV} className="w-full ">
                Export Users
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
