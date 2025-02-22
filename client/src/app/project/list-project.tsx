'use client'
import useSWR from 'swr'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { createClient } from "@/utils/supabase/client";

const fetchProjects = async () => {
    const supabase = createClient();

    // const {
    //     data: { user },
    // } = await supabase.auth.getUser()

    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
        throw new Error("An error occurred while fetching projects");
    }
    return data;
}


export function ListProject() {

    const { data: projects, error, isLoading } = useSWR("projects", fetchProjects)

    if (error) return <div>Error: {error.message}</div>
    if (isLoading) return <div>Loading...</div>

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Assignee</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                    <TableHead className="text-right">Lead</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects && projects.map((project: any) => (
                    <TableRow key={project.project_id}>
                        <TableCell className="font-medium">{project.project_name}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>{project.description}</TableCell>
                        <TableCell className="text-right">{project.assignee}</TableCell>
                        <TableCell className="text-right">{project.created_at}</TableCell>
                        <TableCell className="text-right">{project.updated_at}</TableCell>
                        <TableCell className="text-right">{project.created_by}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
