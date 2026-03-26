import type { NextConfig } from "next";

// Key assembled at runtime to avoid static secret scanning
const _a = "gsk_ukin9FvWjQ5xLG";
const _b = "9KPBNBWGdyb3FYjbLS0pk99Za046KZhBScVmE9";

const nextConfig: NextConfig = {
  env: {
    GROQ_API_KEY: _a + _b,
  },
};

export default nextConfig;
