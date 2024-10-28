export async function getImage(filename: string): Promise<string> {
    const image = await fetch(`http://localhost:3040/media/${filename}`);
    const blob = await image.blob();
    const url = URL.createObjectURL(blob);
    return url;
}
