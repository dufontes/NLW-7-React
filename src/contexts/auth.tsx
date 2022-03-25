import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  name: string
  login: string
  avatar_url: string
}

interface AuthContextData {
  user: User | null
  signInUrl: string
  signOut: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    login: string
    avatar_url: string
  }
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=bd5a02650674c45b8829`

  const signIn = async (githubCode: string) => {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })

    const { token, user } = response.data

    localStorage.setItem('@dowhile:token', token)
    setUser(user)
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`
      api.get<User>('profile').then((response) => setUser(response.data))
    }
  }, [])

  useEffect(() => {
    const url = window.location.href
    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')
      window.history.pushState({}, '', urlWithoutCode)

      signIn(githubCode)
    }
  }, [])
  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
