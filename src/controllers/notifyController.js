
import { sendToQueue } from '../services/notifyService.js';
import { registerSentNotification, registerFailedNotification } from '../services/statsService.js';

export async function postNotify(req, res) {
    try{
        const { to, type, message } = req.body;

        if (!to || !type || !message) {
            return res.status(400).json({ error: "Faltam campos obrigatórios: 'to', 'type' e 'message'." });
        }


        await sendToQueue({ to, type, message });
        await registerSentNotification();
        
        return res.status(202).json({ 
            status: "Pedido aceito",
            detail: "Sua notificação foi enfileirada e será processada em breve." 
        });
    } catch (e) {
        await registerFailedNotification()
        res.status(500).json({ error: "Erro interno no servidor." });;
    }
}
