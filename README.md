# Demo for handling deep links after auth in React Navigation

This repo demonstrates how to handle deep links that require authentication using React Navigation.

It has 3 approaches:

- [`main`](https://github.com/callstackincubator/react-navigation-deep-link-auth-demo) branch - built-in unstable API (`UNSTABLE_routeNamesChangeBehavior: 'lastUnhandled'`)
- [`remount-container`](https://github.com/callstackincubator/react-navigation-deep-link-auth-demo/tree/remount-container) branch - remounting the navigation container after auth
- [`manual-navigate`](https://github.com/callstackincubator/react-navigation-deep-link-auth-demo/tree/manual-navigate) branch - manually navigate to correct screen after auth
