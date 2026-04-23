'use client';

import { api } from '@/trpc/react';
import { DEMO_USER } from '@/utils/auth/demo-user';
import { Routes } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function useCreateBlankProject() {
    const { data: user } = api.user.get.useQuery();
    const { mutateAsync: createSandbox } = api.sandbox.create.useMutation();
    const { mutateAsync: createProject } = api.project.create.useMutation();
    const router = useRouter();
    const [isCreatingProject, setIsCreatingProject] = useState(false);

    const handleStartBlankProject = async () => {
        const userId = user?.id ?? DEMO_USER.id;
        setIsCreatingProject(true);
        try {
            const { sandboxId, previewUrl } = await createSandbox({
                title: `Blank project - ${userId}`,
            });

            const newProject = await createProject({
                project: {
                    name: 'New Project',
                    description: 'Your new blank project',
                    tags: ['blank'],
                },
                sandboxId,
                sandboxUrl: previewUrl,
                userId,
            });

            if (newProject) {
                router.push(`${Routes.PROJECT}/${newProject.id}`);
            }
        } catch (error) {
            console.error('Error creating blank project:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes('502') || errorMessage.includes('sandbox')) {
                toast.error('Sandbox service temporarily unavailable', {
                    description: 'Please try again in a few moments. Our servers may be experiencing high load.',
                });
            } else {
                toast.error('Failed to create project', {
                    description: errorMessage,
                });
            }
        } finally {
            setIsCreatingProject(false);
        }
    };

    return { handleStartBlankProject, isCreatingProject };
}
