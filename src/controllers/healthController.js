import { checkBrokerConnection } from "../services/healthService.js";

export async function getHealth(req, res) {
    const brokerConnected = await checkBrokerConnection();

    if (brokerConnected) {
        return res.status(200).json({
            status: "ok",
            broker_connected: true
        });
    }

    return res.status(503).json({
        status: "degraded",
        broker_connected: false
    });
}