import Link from 'next/link'

export default function ButtonLink({
    path,
    children,
}: {
    path: string
    children: React.ReactNode
}) {
    return (
        <Link href={path}>
            <button color="primary">{children}</button>
        </Link>
    )
}
