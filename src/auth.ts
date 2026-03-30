import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials){
        if(!credentials.email || !credentials.password){
          throw Error('Incomplete input credentials')
        }
        await connectDB()
        const email = credentials.email
        const password = credentials.password as string
        const user = await User.findOne({email})
        if(!user){
          throw Error("User doesn't exist")
        }
        const checkPass = await bcrypt.compare(password, user.password)
        if(!checkPass){
          throw Error('Invalide Credentials')
        }
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  ],
  callbacks: {
    async signIn({user, account}){
      if(account?.provider === "google"){
        await connectDB()
        const dbUser = await User.findOne({email: user.email})
        if(!dbUser){
          await User.create({
            name: user.name,
            email: user.email,
          })
        }
        user.id = dbUser._id,
        user.role = dbUser.role
      }
      return true
    },

    async jwt({token, user}){
      if(!user) return token
      token.id = user.id,
      token.name = user.name,
      token.email = user.email,
      token.role = user.role

      return token
    },

    async session({session, token}){
      if(session.user){
        session.user.id = token.id as string,
        session.user.name = token.name,
        session.user.email = token.email as string,
        session.user.role = token.role as string
      }

      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin"
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: process.env.AUTH_SECRET
})