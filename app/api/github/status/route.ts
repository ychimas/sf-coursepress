import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value
  const username = cookieStore.get('github_user')?.value
  const repository = cookieStore.get('github_repo')?.value

  if (!token || !username) {
    return NextResponse.json({ connected: false })
  }

  return NextResponse.json({
    connected: true,
    username,
    repository,
    branch: 'main'
  })
}
