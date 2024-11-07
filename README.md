# yamli-cache

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3aa4660f-b047-47f6-aaba-38cb6ab53164.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/3aa4660f-b047-47f6-aaba-38cb6ab53164)
[![codecov](https://codecov.io/gh/ragaeeb/yamli-cache/graph/badge.svg?token=PSUQMW9KFL)](https://codecov.io/gh/ragaeeb/yamli-cache)
[![Node.js CI](https://github.com/ragaeeb/yamli-cache/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/yamli-cache/actions/workflows/build.yml)
![GitHub License](https://img.shields.io/github/license/ragaeeb/yamli-cache)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/yamli-cache)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)
![npm](https://img.shields.io/npm/dm/yamli-cache)
[![Size](https://deno.bundlejs.com/badge?q=yamli-cache@1.0.2&badge=detailed)](https://bundlejs.com/?q=yamli-cache%401.0.2)

A cache layer for the Yamli service to avoid unnecessary remote lookups by caching frequently requested data locally.

[LIVE DEMO](https://ragaeeb.github.io/yamli-cache)

## Features

-   Caches transliteration responses from the Yamli API.
-   Reduces redundant network requests by checking cached values first.
-   Allows for customization with preloaded initial cache values.

## Installation

```bash
# Using Bun (recommended)
bun add yamli-cache

# Or using npm
npm install yamli-cache
```

## Usage

### Initializing the Cache

To initialize the cache, use the `initCache` function. You can pass an initial cache value to preload any frequently requested data.

```typescript
import { initCache } from 'yamli-cache';

const Yamli = {
    /* Yamli object with necessary properties */
};
const initialCache = { hello: ['مرحبا', 'هلا'] };

const cache = initCache(Yamli, initialCache);
```

### Example Code

This example demonstrates how to initialize and use the cache.

```javascript
// this example uses the local storage to store the cache
import { disableAnalytics, initCache } from 'yamli-cache';

const loadCache = () => JSON.parse(localStorage.getItem('yamliCache')) || {};

disableAnalytics(window.Yamli);

const cache = initCache(window.Yamli, loadCache());

// Recommendation: save your cache on exit so they can be persisted
window.addEventListener('beforeunload', () => {
    const currentCache = loadCache();
    // recommendation: spread the current cache with the one in storage in case user opened up your site in more than one tab so you don't accidentally lose data that was saved from another tab
    localStorage.setItem('yamliCache', JSON.stringify({ ...currentCache, ...cache }));
});
```

## API Reference

### `initCache`

Initializes a cache for Yamli requests to intercept and store responses, reducing network load.

#### Parameters

-   `Yamli` - The main Yamli object containing the request functions and configurations.
-   `initialValue` - Optional. An initial cache to preload frequently requested data.

#### Returns

-   `YamliCache` - The initialized cache object that stores words and their mapped transliterations.

## License

MIT
