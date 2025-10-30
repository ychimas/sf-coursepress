import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  try {
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
    
    if (tokenData.access_token) {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
      const userData = await userResponse.json()

      const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=1', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })
      const reposData = await reposResponse.json()
      const latestRepo = reposData[0]?.full_name || ''

      const cookieStore = await cookies()
      cookieStore.set('github_token', tokenData.access_token, { httpOnly: true, secure: true })
      cookieStore.set('github_user', userData.login, { httpOnly: true, secure: true })
      cookieStore.set('github_repo', latestRepo, { httpOnly: true, secure: true })
    }
  } catch (error) {
    console.error('GitHub OAuth error:', error)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
