import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const API_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

function getJwtExp(token: string): number {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
    return payload.exp * 1000;
  } catch {
    return Date.now() + 60 * 60 * 1000; // fallback: 1 hora
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: getJwtExp(refreshedTokens.access),
      refreshToken: refreshedTokens.refresh ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Erro ao renovar token de acesso:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${API_BASE_URL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          if (!data.access) {
            return null;
          }

          return {
            id: String(data.user?.id ?? "user-id"),
            name: data.user?.nome_completo ?? credentials.email.split("@")[0],
            email: credentials.email,
            role: data.user?.role,
            accessToken: data.access,
            refreshToken: data.refresh,
          };
        } catch (error) {
          console.error("Erro de conexão no login:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // 1. Primeiro login: persiste os dados e tokens recebidos do backend
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: getJwtExp(user.accessToken),
        };
      }

      // 2. Se o access token ainda não expirou, retorna o token atual
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // 3. Se o access token expirou, tenta renovar via refresh token
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};