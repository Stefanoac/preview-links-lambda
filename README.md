# ts serverless boilerplate

**[Substitua a seção abaixo pela descrição do seu projeto]**
Boilerplate para serverless em TS, ele já vem com várias ferramentas já configuradas como lint, testes, build, CI...
**IMPORTANTE: não se esqueça de alterar o texto "ts-serverless-boilerplate" nos campos "repository" e "name" no package.json para o nome do seu repositório, além dos campos "service" e "functions" no serverless.yml**

## Como iniciar o desenvolvimento

- Instale a versão 12 do [NodeJS](https://nodejs.org/en/download/).
- Configure seu ambiente para ter acesso à pacotes privados como documentado [nessa doc](https://www.notion.so/movidesk/Como-autenticar-e-usar-nossas-bibliotecas-internas-23337b30b8e94009b7f8d3d9321730e4).
- Abra seu CLI preferido e rode os comandos.

````.cli
$ npm i -g yarn
$ yarn
$ yarn start
````

### `yarn start`

Executa os testes em watch.

## Como publicar

A publicação de pacotes acontecerá ao criar uma nova release no Github, cheque [essa doc](https://docs.github.com/en/enterprise/2.15/user/articles/creating-releases) pra mais informações, pro nome da versão, dê uma [olhadinha aqui](https://docs.npmjs.com/about-semantic-versioning).

### `yarn lint`

"Linta" a aplicação utilizando os padrões os padrões de código descritos [aqui](https://github.com/movidesk/frontend-chapter/blob/master/estilo_codigo_padrao.md).

### `yarn test`

Testa a aplicação através do Jest, hoje a cobertura padrão em libs é de 100%, para mais informações sobre testes cheque [essa doc](https://github.com/movidesk/frontend-chapter/blob/master/testing.md).

### `yarn deploy`

Faz o deploy para AWS somente através da criação de novas versões.
