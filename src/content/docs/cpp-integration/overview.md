---
title: Integração C++
description: Biblioteca C++ do dispositivo TamanduCLI para parse, emissão de mensagens e despacho de comandos no protocolo wire.
---

A biblioteca **TamanduCLI Device C++** ajuda o firmware a lidar com o **protocolo wire** do TamanduCLI via Bluetooth (ou qualquer transporte em texto). Ela é dividida em dois namespaces:

| Namespace | Header          | Função                                                                                           |
| --------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `wire`    | `wprotocol.hpp` | Faz parse de mensagens recebidas, serializa comandos de saída, emite respostas single e de lista |
| `cli`     | `cli_map.hpp`   | Registra handlers de comandos e despacha comandos parseados                                      |

Ambos os headers ficam no repositório **TamanduCLI_DeviceCpp**. Inclua-os no seu projeto de firmware e linke com a biblioteca padrão C++ (`<vector>`, `<string>`, etc.).

## Recapitulação do protocolo wire

Os comandos usam sintaxe semelhante a chamadas em C++. Uma **mensagem** pode conter vários comandos separados por `;` (o separador é ignorado dentro de parênteses e strings entre aspas).

```text
nome(modo, req_ou_resp, ...argumentos);
```

| Parâmetro     | Significado       | Valores                                                  |
| ------------- | ----------------- | -------------------------------------------------------- |
| `modo`        | Tipo de comando   | `s` = single, `h` = header de lista, `b` = body de lista |
| `req_ou_resp` | Papel da mensagem | `r` = requisição, `s` = resposta                         |

Exemplo de mensagem com dois comandos:

```text
help(s,r);param_list(s,r);
```

## Parâmetro de template `MessageSize`

Tanto `wire::Protocol<MessageSize>` quanto `cli::CliMap<MessageSize>` recebem um tamanho de buffer em tempo de compilação (padrão **256**). Alinhe com o limite do seu transporte (ex.: Nordic UART Service).

## Fluxo típico no firmware

1. Implemente `pushMessage(const char* msg)` para enfileirar cada string wire para transmissão BLE.
2. Construa `cli::CliMap<256> cli(pushMessage)`.
3. Registre handlers com `registerCommand`.
4. A cada payload BLE recebido, chame `processMessage`.
5. Dentro dos handlers, use a referência `wire::Protocol` para `emitSingleResponse`, `emitListResponseRows`, etc.

Veja [Primeiros passos](/cpp-integration/getting-started/) para um exemplo completo.

## Mapa da documentação

- [Primeiros passos](/cpp-integration/getting-started/) — configuração ponta a ponta
- [Tipos e constantes wire](/cpp-integration/wire-types/) — `Command`, `ListHeader`, `WireView`
- [Parse wire](/cpp-integration/wire-parsing/) — `parseMessage`, helpers de token
- [Serialização wire](/cpp-integration/wire-serialization/) — montagem de strings wire
- [Emissor de protocolo](/cpp-integration/wire-protocol/) — `wire::Protocol<MessageSize>`
- [CliMap](/cpp-integration/cli-map/) — registro e despacho de comandos
