'use client'
import { createClient } from "@/utils/supabase/client";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Button } from "@/components/ui/button"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import OptionAssigned from '@/app/project/components/option-assigned'
import { toast } from 'react-toastify';
import { mutate } from "swr";

const validationSchema = Yup.object({
    projectName: Yup.string()
        .required('This field cannot be empty')
        .min(10, 'Must be at least 10 characters'),
});

export default function FormCreateProject({ onClose }: { onClose?: () => void }) {
    const handleSubmit = async (
        values: { projectName: string; description: string; status: string; },
        { resetForm }: { resetForm: () => void }
    ) => {
        const supabase = createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase.from("projects").insert({
            project_name: values.projectName,
            description: values.description,
            status: values.status,
            created_by: user?.id,
        });

        if (error) {
            toast.error("Error creating project: " + error.message);
        } else {
            console.log("Project created successfully:", data);
            toast.success("Project created successfully!");
            resetForm();
            onClose && onClose();
            mutate("projects");
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    projectName: '',
                    description: '',
                    status: 'TODO',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="projectName">Project Name</label>
                                        <Field
                                            id="projectName"
                                            name="projectName"
                                            type="text"
                                            placeholder="Enter project name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
                                        />
                                        <ErrorMessage
                                            name="projectName"
                                            component="div"
                                            className="text-red-500 text-xs italic mt-1"
                                        />
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="description">Description</label>
                                        <Field
                                            id="description"
                                            name="description"
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter project description"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="text-red-500 text-xs italic mt-1"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <OptionAssigned />
                                    </div>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="status">Status</label>
                                        <div className="relative">
                                            <Field
                                                id="status"
                                                name="status"
                                                as="select"
                                                className="block w-full appearance-none rounded-md bg-white py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
                                            >
                                                <option value="TODO">Todo</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="DONE">Done</option>
                                            </Field>
                                            <ChevronDownIcon
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                Save changes
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}
