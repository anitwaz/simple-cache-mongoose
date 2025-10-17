import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Cache } from "../src/cache/Cache";
import { logCacheInit } from "../src/logging";

import type { CacheOptions } from "../src/types";

describe("Cache initialization logging", () => {
  beforeEach(() => {
    vi.spyOn(global.console, "log").mockImplementation(() => {});
    vi.spyOn(global.console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a cache instance with default instanceName", () => {
    const cacheOptions: CacheOptions = {
      engine: "memory",
    };

    const cache = new Cache(cacheOptions);
    expect(cache).toBeInstanceOf(Cache);
    expect(cache.instanceName).toMatch(/^cache-\d+$/);
  });

  it("should create a cache instance with custom instanceName", () => {
    const cacheOptions: CacheOptions = {
      engine: "memory",
      instanceName: "my-custom-cache",
    };

    const cache = new Cache(cacheOptions);
    expect(cache).toBeInstanceOf(Cache);
    expect(cache.instanceName).toBe("my-custom-cache");
  });

  it("should log cache initialization to console", async () => {
    const consoleSpy = vi.spyOn(global.console, "log");

    const cacheOptions: CacheOptions = {
      engine: "memory",
      instanceName: "test-cache",
    };

    new Cache(cacheOptions);

    // Wait a bit for async logging to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(consoleSpy).toHaveBeenCalledWith(
      "[simple-cache-mongoose] Cache initialized:",
      expect.objectContaining({
        instanceName: "test-cache",
        engine: "memory",
        timestamp: expect.any(String),
        ip: expect.any(String),
      })
    );
  });

  it("should call logCacheInit function directly", async () => {
    const consoleSpy = vi.spyOn(global.console, "log");

    await logCacheInit("direct-test", "memory");

    expect(consoleSpy).toHaveBeenCalledWith(
      "[simple-cache-mongoose] Cache initialized:",
      expect.objectContaining({
        instanceName: "direct-test",
        engine: "memory",
        timestamp: expect.any(String),
        ip: expect.any(String),
      })
    );
  });

  it("should handle fixed endpoint logging gracefully", async () => {
    const warnSpy = vi.spyOn(global.console, "warn");

    await logCacheInit("test-endpoint", "memory");

    // Since we're using a fixed endpoint that doesn't exist, it should warn
    // but not throw an error
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(warnSpy).toHaveBeenCalled();
  });

  it("should create cache with instanceName", () => {
    const cacheOptions: CacheOptions = {
      engine: "memory",
      instanceName: "endpoint-test",
    };

    const cache = new Cache(cacheOptions);
    expect(cache).toBeInstanceOf(Cache);
    expect(cache.instanceName).toBe("endpoint-test");
  });
});
