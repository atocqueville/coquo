import {
    NextResponse,
    type MiddlewareConfig,
    type NextRequest,
} from 'next/server'
import { auth } from '@/auth'

// export default NextAuth(authConfig).auth
const protectedRoutes = ['/posts', '/create']

export default async function middleware(req: NextRequest) {
    const session = await auth()
    const isProtected = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    )
    if (!session && isProtected) {
        const absoluteUrl = new URL('/api/auth/signin', req.nextUrl.origin)
        return NextResponse.redirect(absoluteUrl)
    }

    return NextResponse.next()
}

export const config: MiddlewareConfig = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
