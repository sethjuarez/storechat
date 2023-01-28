import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";


export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      profilePhotoSize: 48,
    }),
  ],
};
export default NextAuth(authOptions);
