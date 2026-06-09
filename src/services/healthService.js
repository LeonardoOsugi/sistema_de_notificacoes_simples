import amqp from "amqplib";

const brokerUrl = process.env.RABBITMQ_URL || "amqp://localhost";

export async function checkBrokerConnection() {
    let connection;
    let channel;

    try {
        connection = await amqp.connect(brokerUrl);
        channel = await connection.createChannel();
        return true;
    } catch {
        return false;
    } finally {
        if (channel) {
            await channel.close().catch(() => {});
        }

        if (connection) {
            await connection.close().catch(() => {});
        }
    }
}