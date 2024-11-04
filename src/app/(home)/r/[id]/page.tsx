export default async function RecipePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    return <div>My Recipe id: {id}</div>;
}
