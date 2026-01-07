'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { routes } from '@/resources';
import { Flex, Spinner } from '@once-ui-system/core';
import NotFound from '@/app/not-found';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performChecks = async () => {
      setLoading(true);
      setIsRouteEnabled(false);

      const checkRouteEnabled = () => {
        if (!pathname) return false;

        // Normalize pathname by removing trailing slash (except for root)
        const normalizedPath =
          pathname === '/' ? '/' : pathname.replace(/\/$/, '');

        if (normalizedPath in routes) {
          return routes[normalizedPath as keyof typeof routes];
        }

        const dynamicRoutes = ['/blog', '/work'] as const;
        for (const route of dynamicRoutes) {
          if (normalizedPath?.startsWith(route) && routes[route]) {
            return true;
          }
        }

        return false;
      };

      const routeEnabled = checkRouteEnabled();
      setIsRouteEnabled(routeEnabled);

      // Note: Password protection is disabled for static export (GitHub Pages)
      // If you need password protection, you'll need to deploy to a platform
      // that supports server-side rendering (e.g., Vercel, Netlify with serverless functions)

      setLoading(false);
    };

    performChecks();
  }, [pathname]);

  if (loading) {
    return (
      <Flex fillWidth paddingY='128' horizontal='center'>
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
