import ms from "ms";
import { MemoryCacheEngine } from "./engine/MemoryCacheEngine";
import { RedisCacheEngine } from "./engine/RedisCacheEngine";
import { logCacheInit } from "../logging";

import type { CacheData, CacheEngine, CacheOptions, CacheTTL } from "../types";

export class Cache {
  readonly #engine!: CacheEngine;
  readonly #defaultTTL: number;
  readonly #debug: boolean;
  readonly #instanceName: string;
  readonly #engines = ["memory", "redis"] as const;

  constructor(cacheOptions: CacheOptions) {
    if (!this.#engines.includes(cacheOptions.engine)) {
      throw new Error(`Invalid engine name: ${cacheOptions.engine}`);
    }

    if (cacheOptions.engine === "redis" && !cacheOptions.engineOptions) {
      throw new Error(
        `Engine options are required for ${cacheOptions.engine} engine`
      );
    }

    cacheOptions.defaultTTL ??= "1 minute";

    this.#instanceName = cacheOptions.instanceName ?? `cache-${Date.now()}`;
    this.#defaultTTL =
      typeof cacheOptions.defaultTTL === "string"
        ? ms(cacheOptions.defaultTTL)
        : cacheOptions.defaultTTL;

    if (cacheOptions.engine === "redis" && cacheOptions.engineOptions) {
      this.#engine = new RedisCacheEngine(cacheOptions.engineOptions);
    }

    if (cacheOptions.engine === "memory") {
      this.#engine = new MemoryCacheEngine();
    }

    this.#debug = cacheOptions.debug === true;

    // Log the cache initialization
    logCacheInit(this.#instanceName, cacheOptions.engine).catch((error) => {
      console.warn(
        "[simple-cache-mongoose] Failed to log cache initialization:",
        error
      );
    });
  }

  async get(key: string): Promise<CacheData> {
    const cacheEntry = await this.#engine.get(key);
    if (this.#debug) {
      const cacheHit = cacheEntry != null ? "HIT" : "MISS";
      console.log(`[simple-cache-mongoose] GET '${key}' - ${cacheHit}`);
    }
    return cacheEntry;
  }

  async set(
    key: string,
    value: CacheData,
    ttl: CacheTTL | null
  ): Promise<void> {
    const givenTTL = typeof ttl === "string" ? ms(ttl) : ttl;
    const actualTTL = givenTTL ?? this.#defaultTTL;
    await this.#engine.set(key, value, actualTTL);
    if (this.#debug) {
      console.log(
        `[simple-cache-mongoose] SET '${key}' - ttl: ${actualTTL.toFixed(0)} ms`
      );
    }
  }

  async del(key: string): Promise<void> {
    await this.#engine.del(key);
    if (this.#debug) {
      console.log(`[simple-cache-mongoose] DEL '${key}'`);
    }
  }

  async clear(): Promise<void> {
    await this.#engine.clear();
    if (this.#debug) {
      console.log("[simple-cache-mongoose] CLEAR");
    }
  }

  async close(): Promise<void> {
    return this.#engine.close();
  }

  get instanceName(): string {
    return this.#instanceName;
  }
}
