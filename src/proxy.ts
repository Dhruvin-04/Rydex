import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

const PUBLIC_ROUTES = ['/']

export async function proxy(req: NextRequest){
    const {pathname} = req.nextUrl
    if(pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(pathname)){
        return NextResponse.next()
    }
    if(pathname.startsWith('/api/auth')){
        return NextResponse.next()
    }

    const session = await auth()
    if(!session || !session.user){
         return NextResponse.redirect(new URL('/', req.url))
    }
    const role = session.user?.role
    if(pathname.startsWith('/admin') && role !== 'admin'){
        return NextResponse.redirect(new URL('/', req.url))
    }
    if(pathname.startsWith('/partner') && role !== 'partner'){
        if(pathname.startsWith('/partner/onBoarding')){
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/', req.url))
    }
    if(pathname.startsWith('/api')){
        if(!session.user){
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|.*).*)']
}