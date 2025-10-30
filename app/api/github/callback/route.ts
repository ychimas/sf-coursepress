import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  try {
    console.log('Processing GitHub callback with code:', code)
    
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log('Token response:', tokenData)
    
    if (tokenData.access_token) {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
      const userData = await userResponse.json()
      console.log('User data:', userData.login)

      const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=1', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
      const reposData = await reposResponse.json()
      const latestRepo = reposData[0]?.full_name || ''
      console.log('Latest repo:', latestRepo)

      const cookieStore = await cookies()
      const isProduction = process.env.NODE_ENV === 'production'
      const cookieOptions = { 
        httpOnly: true, 
        secure: isProduction,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7 // 7 days
      }
      
      cookieStore.set('github_token', tokenData.access_token, cookieOptions)
      cookieStore.set('github_user', userData.login, cookieOptions)
      cookieStore.set('github_repo', latestRepo, cookieOptions)
      
      console.log('Cookies set successfully')
    } else {
      console.error('No access token received:', tokenData)
    }
  } catch (error) {
    console.error('GitHub OAuth error:', error)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
