import { sql } from "bun";
import type { Integration } from "../types";

const useIntegration = () => {
    return {
        getAllEnabledIntegrations: async () => {
            const res = await sql`
                SELECT * FROM integration WHERE enabled = 1;
            `;

            return res as Integration[];
        }
    }
}

export default useIntegration;