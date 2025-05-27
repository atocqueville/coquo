import { Children } from 'react';

type PageContainerProps = {
    children: React.ReactNode;
};

export function PageTitle({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="container flex items-center justify-between h-16 px-4">
                <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                    {title}
                </h1>
            </div>
        </header>
    );
}

export function PageContainer({ children }: PageContainerProps) {
    const childrenArray = Children.toArray(children);
    return (
        <div className="flex flex-col">
            {childrenArray[0]}
            <section className="flex-1 container px-4 py-6">
                {childrenArray[1]}
            </section>
            <footer className="h-16 md:h-0"></footer>
        </div>
    );
}
