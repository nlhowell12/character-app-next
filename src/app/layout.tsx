import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ThemeRegistry from "@/_utils/theme/ThemeRegistry";
import { Grid } from "@mui/material";
import Header from "./_components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rhedrah Character Builder",
  description: "Created for use in the Second Edition of the Rhedrah campaign",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeRegistry options={{ key: "mui-theme" }}>
            <Grid
              sx={{
                  marginLeft: "6rem",
                  marginTop: "5rem",
                }}
            >
              <Header />
              {children}
            </Grid>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
