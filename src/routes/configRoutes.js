import { Router } from 'express';

const router = Router();

// Um estado temporário na memória para guardar a configuração
let canalConfig = { ativo: true };

// O seu endpoint POST /config
router.post('/config', (req, res) => {
    const { ativo } = req.body;

    if (ativo === undefined) {
        return res.status(400).json({ error: 'O campo "ativo" é obrigatório.' });
    }

    canalConfig.ativo = ativo;
    return res.status(200).json({ 
        message: 'Configuração atualizada com sucesso!', 
        config: canalConfig 
    });
});

export default router;