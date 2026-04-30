import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Постери / бекдропи з TMDb
      { protocol: "https", hostname: "image.tmdb.org" },
      // Обкладинки аніме з AniList
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "img.anili.st" },
      // YouTube превʼю (на випадок карток трейлерів)
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
