import amqp from 'amqplib';

export async function sendToQueue(notificationData) {
    try {
        // 1. Conecta ao servidor do RabbitMQ usando a URL do .env
        // (Se não achar no .env, tenta no localhost por garantia)
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        
        // 2. Cria um "canal" de comunicação dentro dessa conexão
        const channel = await connection.createChannel();
        
        // 3. Define o nome da fila que vamos usar
        const queueName = 'notificacoes_fila';
        
        // 4. Garante que a fila existe (se não existir, o RabbitMQ cria ela na hora)
        // O "durable: true" significa que a fila não some se o RabbitMQ reiniciar
        await channel.assertQueue(queueName, { durable: true });
        
        // 5. O RabbitMQ só entende "Buffers" (bytes). 
        // Então transformamos nosso JSON em string, e depois em Buffer.
        const messageBuffer = Buffer.from(JSON.stringify(notificationData));
        
        // 6. Envia a mensagem para a fila
        // "persistent: true" garante que a mensagem seja salva no disco do servidor
        channel.sendToQueue(queueName, messageBuffer, { persistent: true });
        
        console.log("Sucesso: Mensagem enviada para a fila RabbitMQ:", notificationData);
        
        // 7. Fecha o canal e a conexão de forma limpa após meio segundo
        setTimeout(() => {
            channel.close();
            connection.close();
        }, 500);

        // Retorna true para o Controller saber que deu tudo certo
        return true;

    } catch (error) {
        console.error("Falha catastrófica ao tentar enviar para o RabbitMQ:", error);
        
        // Lançamos o erro para frente. Assim, o 'catch' lá do seu Controller
        // vai pegar isso e devolver o Erro 500 para quem chamou a API.
        throw error; 
    }
}