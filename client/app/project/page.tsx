'use client'
import { useState } from "react";
import FormCreateProject from "@/app/project/form-create-project";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ListProject } from "@/app/project/list-project";

export default function Project() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Project</h2>
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setShowModal(true)}>
                                Create Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] w-full max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create Project</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <FormCreateProject onClose={() => setShowModal(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <ListProject />
        </div>
    );
}
