import './globals.scss';
import '../icons/icons.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './tailwind.css';

import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { UiProviders } from '@/components/common/UIProvider/ui-provider';

const SITE_NAME = 'AIDA Sales';
const DEFAULT_DESCRIPTION =
  'AI conversation intelligence for sales, support, and contact centers. Analyze calls, track quality, coach teams, and grow revenue with actionable insights.';
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  'https://aida-sales.uz';
const DEVELOPER_NAME = 'Torgomyan.Studio';
const DEVELOPER_URL = 'https://torgomyan-studio.am/';
const CONTACT_PHONE = '+998999999999';
const CONTACT_PHONE_DISPLAY = '+998 90 099 91 09';
const CONTACT_EMAIL = 'aida@sales.uz';
const CONTACT_ADDRESS = 'Tashkent, Bakhodir St., 44a';
const WEBSITE_LANGUAGE = ['en', 'ru', 'uz'];

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — AI Conversation Intelligence Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'conversation intelligence',
    'call analytics',
    'sales coaching',
    'speech analytics',
    'contact center QA',
    'customer service quality',
    'ai call transcription',
    'manager dashboards',
    'sales performance insights',
    'aida sales',
  ].join(', '),
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — AI Conversation Intelligence`,
    description: DEFAULT_DESCRIPTION,
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — AI Conversation Intelligence`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
  manifest: '/manifest.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}#website`,
        url: BASE_URL,
        name: SITE_NAME,
        inLanguage: WEBSITE_LANGUAGE.join(','),
        description: DEFAULT_DESCRIPTION,
        publisher: {
          '@id': `${BASE_URL}#organization`,
        },
        creator: {
          '@id': `${DEVELOPER_URL}#organization`,
        },
      },
      {
        '@type': ['Organization', 'SoftwareApplication'],
        '@id': `${BASE_URL}#organization`,
        name: SITE_NAME,
        url: BASE_URL,
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        logo: `${BASE_URL}/landing/img/logo.svg`,
        image: `${BASE_URL}/landing/img/logo.svg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: CONTACT_ADDRESS,
          addressLocality: 'Tashkent',
          addressCountry: 'UZ',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            telephone: CONTACT_PHONE,
            email: CONTACT_EMAIL,
            availableLanguage: WEBSITE_LANGUAGE,
          },
        ],
        areaServed: 'Worldwide',
      },
      {
        '@type': 'Organization',
        '@id': `${DEVELOPER_URL}#organization`,
        name: DEVELOPER_NAME,
        url: DEVELOPER_URL,
      },
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}#webpage`,
        url: BASE_URL,
        name: SITE_NAME,
        inLanguage: WEBSITE_LANGUAGE.join(','),
        about: {
          '@id': `${BASE_URL}#organization`,
        },
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning={true} className="light">
      <head>
        <link rel="stylesheet" href="/landing/css/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Unbounded:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-foreground bg-background">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
          <NextTopLoader />
            <UiProviders>
              {children}
            </UiProviders>
      </body>
    </html>
  );
}
