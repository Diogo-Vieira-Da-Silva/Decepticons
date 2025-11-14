 📝 Relatório do Desenvolvimento — Sistema com MySQL, Node.js e Express

Durante o desenvolvimento deste projeto, a configuração inicial do MySQL e sua integração com o sistema ocorreu de forma fluida. Como já havia trabalhado com essa estrutura em projetos anteriores, consegui avançar rapidamente, aplicando os conhecimentos adquiridos anteriormente em aula. Inclusive, foi uma parte divertida do processo, especialmente ao criar e gerenciar os registros de soldados e médicos inspirados em Transformers.

A adição de novos personagens também foi simples e direta.
Os maiores desafios começaram a surgir ao implementar o sistema de busca, pois em um momento parecia que o botão de pesquisa estava interferindo no botão de adicionar registros. Após ajustes, tudo foi sendo esclarecido.

Entretanto, o maior obstáculo foi o botão de deletar. Enfrentei diversos erros relacionados ao uso de id e nome, que frequentemente resultavam em falhas. Com o tempo, consegui compreender melhor a lógica, revisar os métodos utilizados e encontrar soluções adequadas. Também aprendi novas técnicas durante o processo, graças ao apoio do Kilo Code e do próprio ChatGPT, que auxiliaram na correção dos problemas.

Foi um projeto desafiador, mas extremamente valioso para meu aprendizado. Hoje me sinto mais preparado e confiante para lidar com bancos de dados e integração backend.

⚙️ Como configurar o projeto
📌 1. Inicialização do Node.js

No terminal, execute:

npm init -y


Em seguida, instale as dependências principais:

npm install express mysql2


Esses pacotes são essenciais para que o servidor funcione e possa se comunicar com o MySQL.

📁 Estrutura recomendada do projeto

Crie a seguinte organização de arquivos:

/public
   ├── index.html
   ├── script.js
   └── style.css

server.js


A pasta public deve conter os arquivos do front-end
e o arquivo server.js será responsável pelo servidor Express e pela conexão com o MySQL.

▶️ Como executar o sistema

Após tudo configurado, basta rodar:

node server.js


O servidor iniciará e o projeto estará pronto para uso.