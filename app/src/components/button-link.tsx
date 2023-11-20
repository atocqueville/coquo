import {Button} from '@nextui-org/button'; 
import Link from 'next/link';

export default function ButtonLink({ path, children }: { path: string, children: React.ReactNode }) {
    return (
      <Link href={`/${path}`}>
        <Button color='primary'>{children}</Button>
      </Link>
    )
  }