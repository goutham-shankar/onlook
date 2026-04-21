import { type Metadata } from 'next';
import { ImportGithubProjectProvider } from './_context';

export const metadata: Metadata = {
    title: 'Onlook',
    description: 'Onlook – Import Github Project',
};

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ImportGithubProjectProvider totalSteps={3}>{children}</ImportGithubProjectProvider>
    );
}
