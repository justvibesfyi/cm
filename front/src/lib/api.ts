import type { ApiTypes } from "@back/index";
import { hc } from "hono/client";

const honoClient = hc<ApiTypes>("/");

export const api = honoClient.api;
