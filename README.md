# 📬 Sistema de Notificações Simples

Uma API assíncrona para gerenciamento e disparo de notificações, construída em Node.js. O sistema utiliza uma arquitetura baseada em mensageria para separar o recebimento da requisição do processamento real do envio (Worker), garantindo alta disponibilidade e escalabilidade [2].

Projeto desenvolvido para a disciplina de Sistemas Distribuídos, implementando as premissas de **Desacoplamento** e **Assincronismo** [3, 4].

## 🚀 Tecnologias Utilizadas
* **Node.js** (v24+) [2]
* **Express** (Roteamento da API) [2]
* **LavinMQ / RabbitMQ** (Servidor de mensageria AMQP) [1, 2]
* **Render** (Hospedagem em nuvem PaaS) [1]
* **Docker** (Hospedagem local do servidor de mensageria para desenvolvimento) [2]

## 🧠 Arquitetura do Sistema (Ambiente de Produção)
O projeto foi desenhado dividindo as responsabilidades para operar de forma distribuída na nuvem:
1. **API (Produtor):** Hospedada no **Render**, recebe a requisição do usuário e a posta na fila, respondendo instantaneamente [1, 3].
2. **LavinMQ (Middleware):** A nossa "agência de correios" na nuvem, que armazena as mensagens de forma segura aguardando processamento [1, 3].
3. **Worker (Consumidor):** O serviço isolado que escuta a fila de mensagens, processa os dados e simula o envio final [3, 5].

## ☁️ Sistema na Nuvem
O sistema está validado, publicado e operando na nuvem. Utilizamos o **Render** para a hospedagem da API e o **LavinMQ** como serviço de mensageria. Essa abordagem foi escolhida pela facilidade de integração em nuvem e isenção de custos para testes e validação de ambientes distribuídos [1].

## 🛠 Como rodar o projeto localmente

### 1. Pré-requisitos
* Node.js (Recomendado versão LTS) [6]
* Docker (Para rodar o RabbitMQ localmente, caso não utilize a nuvem) [6]

### 2. Instalação das dependências
```bash
npm install

3. Configuração de Variáveis de Ambiente
Crie um arquivo chamado .env na raiz do projeto. Configure de acordo com o seu ambiente:

# Para conectar ao LavinMQ na nuvem, use a URL gerada pelo serviço:
RABBITMQ_URL=amqp://[usuario]:[senha]@[host-do-lavinmq]

# OU para testes puramente locais com Docker:
# RABBITMQ_URL=amqp://localhost

PORT=5000

4. Subindo o servidor local de mensageria (Via Docker)
Caso decida rodar a mensageria localmente ao invés do LavinMQ, inicie o RabbitMQ via Docker:

docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

(Para acessar o painel visual do RabbitMQ local, abra http://localhost:15672 no navegador. Login e senha padrão: guest).
5. Iniciando a API

npm start

A API estará pronta para receber requisições em http://localhost:5000.
📖 Documentação das Rotas
POST /notify (Rota Principal)
Responsável por receber a solicitação de notificação e postá-la na fila.

    Resposta de Sucesso: 202 Accepted (Pedido aceito para processamento futuro).

GET /stats (Relatórios Simples)
Retorna o total de notificações processadas, enviadas e com falhas, organizadas por tipo.

    Resposta de Sucesso: 200 OK.
    Detalhes: O Worker alimenta os dados em data/stats.json através das funções do arquivo src/services/statsService.js.

POST /config (Gerenciamento)
Permite habilitar ou desabilitar serviços de envio de notificação sem a necessidade de derrubar a API.
👷 Status de Implementação e Próximos Passos

    [x] GET /stats: Criar rota de relatórios para ler os envios registrados.
    [x] POST /config: Criar rota de gerenciamento para ligar/desligar tipos de notificação.
    [x] Deploy Cloud: Hospedar a solução publicamente na nuvem (Finalizado utilizando Render e LavinMQ).
    [X] GET /health: Criar rota de monitoramento para verificar a conexão com o servidor de mensageria.
    [X] Worker: Refinar o script isolado que irá consumir a fila e simular os envios finais
