import { ChangelogContent } from './changelog-content';

export default function ChangelogPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="container flex items-center justify-between h-16 px-4">
                    <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                        Journal des modifications
                    </h1>
                </div>
            </header>
            <section className="container py-4 px-4 md:py-6">
                <ChangelogContent />
            </section>
        </div>
    );
}
