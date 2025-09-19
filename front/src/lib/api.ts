import type { ApiTypes } from "@back/index";
import { hc } from "hono/client";

const honoClient = hc<ApiTypes>("http://localhost:5173/");

export const api = honoClient.api;
