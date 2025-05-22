import Image from 'next/image';
import { poppins } from '@/app/fonts';

export default function CustomAuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className={`container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0`}
        >
            <div
                className={`${poppins.className} hidden h-full bg-emerald-500 lg:block`}
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                <Image
                    alt="Healthy food"
                    src="/healthy-food.jpg"
                    className="object-cover"
                    fill
                    sizes="50vw"
                    priority
                />
                <div
                    style={{ top: '150px' }}
                    className="grid grid-rows-3 gap-10 absolute text-white text-7xl left-7"
                >
                    <div>Cook.</div>
                    <div>Create.</div>
                    <div>Collect.</div>
                </div>
            </div>
            {children}
        </div>
    );
}
