import * as React from 'react';
import { GoodInternetApp } from './good-internet/GoodInternetApp.tsx';
import './good-internet/inputs.css';
import { currentRoute, interceptLinks, onNavigate } from './good-internet/navigate.ts';

// Every address is a Good Internet address. kept-ui reads its route from `#/kept/...`; here it's the path.
// useSyncExternalStore re-reads the path after subscribing, so a redirect fired by a child's
// effect (the auth gate) before this subscribes is still picked up.
function usePathRoute() {
  const route = React.useSyncExternalStore(onNavigate, currentRoute);
  React.useEffect(() => interceptLinks(), []);
  // Lets inputs.css restyle single screens without touching the synced screen files.
  React.useEffect(() => {
    document.documentElement.dataset.goodInternetRoute = route;
    return () => {
      delete document.documentElement.dataset.goodInternetRoute;
    };
  }, [route]);
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) first.current = false;
    else window.scrollTo(0, 0);
  }, [route]);
  return route;
}

export default function App() {
  const route = usePathRoute();
  return <GoodInternetApp route={route} />;
}
