/**
 * Cache Service
 *
 */
const AIM = require('@astro-my/aim-sdk');
const { cacheSetting } = require('@config/vars');

const { cacheHost, cachePort, cacheCluster } = cacheSetting;

const cache = AIM.Cache({
  cacheHost,
  cachePort,
  cacheCluster
});

cache.run();

module.exports = cache;
