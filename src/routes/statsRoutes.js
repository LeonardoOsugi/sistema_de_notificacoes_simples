import { Router } from "express";

import { getStats } from "../services/statsService.js";

const router = Router();

router.get("/stats", async (req, res) => {
    try {
        const stats = await getStats();
        return res.status(200).json(stats);
    } catch (error) {
        console.error("Erro ao buscar estatisticas:", error);
        return res.status(500).json({ error: "Erro interno ao buscar estatisticas." });
    }
});

export default router;
