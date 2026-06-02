import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statsFilePath = path.resolve(__dirname, "../../data/stats.json");

const emptyStats = {
    total_processed: 0,
    total_sent: 0,
    total_failed: 0,
    success_rate: 0,
    by_type: {},
    last_sent_at: null,
    last_failed_at: null,
    last_error: null
};

function normalizeStats(stats) {
    const normalizedStats = {
        ...emptyStats,
        ...stats,
        by_type: stats.by_type || {}
    };

    normalizedStats.total_processed = normalizedStats.total_sent + normalizedStats.total_failed;
    normalizedStats.success_rate = normalizedStats.total_processed === 0
        ? 0
        : Number(((normalizedStats.total_sent / normalizedStats.total_processed) * 100).toFixed(2));

    return normalizedStats;
}

async function ensureStatsFile() {
    await fs.mkdir(path.dirname(statsFilePath), { recursive: true });

    try {
        await fs.access(statsFilePath);
    } catch {
        await fs.writeFile(statsFilePath, JSON.stringify(emptyStats, null, 2));
    }
}

export async function getStats() {
    await ensureStatsFile();

    const fileContent = await fs.readFile(statsFilePath, "utf-8");
    return normalizeStats(JSON.parse(fileContent));
}

export async function registerSentNotification(type) {
    const notificationType = type || "unknown";
    const stats = await getStats();

    stats.total_sent += 1;
    stats.by_type[notificationType] = (stats.by_type[notificationType] || 0) + 1;
    stats.last_sent_at = new Date().toISOString();

    const updatedStats = normalizeStats(stats);
    await fs.writeFile(statsFilePath, JSON.stringify(updatedStats, null, 2));
    return updatedStats;
}

export async function registerFailedNotification(errorMessage) {
    const stats = await getStats();

    stats.total_failed += 1;
    stats.last_failed_at = new Date().toISOString();
    stats.last_error = errorMessage || "Erro desconhecido";

    const updatedStats = normalizeStats(stats);
    await fs.writeFile(statsFilePath, JSON.stringify(updatedStats, null, 2));
    return updatedStats;
}
