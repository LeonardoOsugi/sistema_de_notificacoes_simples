# 📬 Sistema de Notificações Simples

Uma API assíncrona para gerenciamento e disparo de notificações, construída em Node.js. O sistema utiliza uma arquitetura baseada em mensageria (RabbitMQ) para separar o recebimento da requisição do processamento real do envio (Worker), garantindo alta disponibilidade e escalabilidade.

## 🚀 Tecnologias Utilizadas
* **Node.js** (v24+)
* **Express** (Roteamento da API)
* **RabbitMQ / amqplib** (Fila de mensagens)
* **Docker** (Hospedagem local do servidor de mensageria)

---

## 🛠️ Como rodar o projeto localmente

Se você acabou de dar um *fork* ou *clone* neste repositório, siga o passo a passo abaixo para rodar a aplicação na sua máquina.

### 1. Pré-requisitos
Certifique-se de ter instalado em seu sistema:
* [Node.js](https://nodejs.org/) (Recomendado versão LTS)
* [Docker](https://www.docker.com/) (Para rodar o RabbitMQ)

### 2. Instalação das dependências
Abra o terminal na pasta raiz do projeto e instale os pacotes necessários:

```bash
npm install
```

### 3. Configuração de Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do projeto. Você pode copiar o modelo abaixo (que também é o padrão para testes locais):

```env
PORT=5000
RABBITMQ_URL=amqp://localhost
```

### 4. Subindo o servidor do RabbitMQ (Via Docker)
Para que a API consiga enfileirar as mensagens, precisamos da nossa "agência de correios" funcionando. Rode o comando abaixo no terminal para iniciar o RabbitMQ em segundo plano:

```bash
sudo docker run -d --name rabbitmq-server -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
*(Dica: Para acessar o painel de controle visual do RabbitMQ, abra `http://localhost:15672` no navegador. Login e senha padrão: `guest`).*

### 5. Iniciando a API
Com as dependências instaladas e o RabbitMQ rodando, inicie o servidor Node.js:

```bash
node --watch src/index.js
```
A API estará rodando e pronta para receber requisições em `http://localhost:5000`.

---

## 📖 Documentação das Rotas

### `POST /notify` (Rota Principal)
Responsável por receber a solicitação de notificação e postá-la na fila do RabbitMQ.

**Corpo da Requisição (JSON):**

```json
{
  "to": "usuario@email.com",
  "type": "email",
  "message": "Sua compra foi aprovada!"
}
```

**Resposta de Sucesso (202 Accepted):**

```json
{
  "status": "Pedido aceito",
  "detail": "Sua notificação foi enfileirada e será processada em breve."
}
```

---

## 👷 Próximos Passos (Para a Equipe)
A arquitetura do projeto já está definida com a separação em `routes`, `controllers` e `services`. As próximas implementações devem seguir este padrão lógico:

* [ ] **`GET /health`:** Criar rota de monitoramento para verificar a conexão com o RabbitMQ.
* [ ] **`GET /stats`:** Criar rota de relatórios para ler os envios registrados.
* [ ] **`POST /config`:** Criar rota de gerenciamento para ligar/desligar tipos de notificação.
* [ ] **Worker:** Desenvolver o script isolado que irá consumir a fila `notificacoes_fila` e simular o envio.
