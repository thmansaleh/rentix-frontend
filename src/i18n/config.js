import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export const locales = ['en', 'ar'];
export const defaultLocale = 'ar';

export default getRequestConfig(async () => {
  // This can either be defined statically at the top-level if no request
  // is involved, or dynamically if you read from headers().
  const headersList = await headers();
  const locale = headersList.get('x-locale') || defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
