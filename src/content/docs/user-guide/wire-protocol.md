---
title: Protocolo wire
description: Formato das mensagens entre CLI e dispositivo para usuários avançados.
---

O **protocolo wire** é o idioma de texto trocado entre o PC e o firmware. Não é JSON — são comandos no estilo de chamadas de função em C++.

## Forma geral

Uma **mensagem** pode conter **vários comandos** separados por **`;`**:

```text
help(s,r);param_list(s,r);
```

O separador `;` é ignorado **dentro** de parênteses e **dentro** de strings `"..."`.

Cada comando segue:

```text
nome(modo, req_ou_resp, ...argumentos);
```

## Modo e papel

| Posição | Campo | Valores |
| ------- | ----- | ------- |
| 1º após `nome(` | `modo` | `s` = single, `h` = header de lista, `b` = body de lista |
| 2º | `req_ou_resp` | `r` = requisição (PC → dispositivo), `s` = resposta (dispositivo → PC) |

## Comando single (`s`)

Um único pedido ou resposta:

```text
help(s,r);
battery_get(s,r);
param_get(s,r,"temperature");
param_get(s,s,"23.5");
```

- **`(s,r)`** — você **pede** algo ao dispositivo
- **`(s,s)`** — dispositivo **responde** (você verá isso nas linhas recebidas)

## Comandos de lista (`h` e `b`)

Listas longas (parâmetros, help, mapa) são divididas em **header** + **bodies**:

```text
param_list(h,s,5,1,1,0);
param_list(b,s,1,"param_get","ref","read a parameter");
```

### Header `nome(h,role,T,C,B,j)`

| Campo | Significado |
| ----- | ----------- |
| `T` | Total de linhas na lista |
| `C` | Quantas linhas de body vêm **nesta** mensagem BLE |
| `B` | Total de mensagens BLE que compõem a lista |
| `j` | Índice desta mensagem (`0` … `B-1`) |

### Body `nome(b,role,índice, ...campos)`

Cada linha da lista, com **índice** e argumentos daquela entrada.

## Aspas e caracteres especiais

Valores que não são inteiros nem identificadores simples precisam de **aspas**:

```text
param_get(s,r,"meu parametro");
```

Dentro de strings, use `\"` e `\\` para escapar.

## Atalho da CLI vs wire completo

| Você digita | CLI envia |
| ----------- | --------- |
| `help` | `help(s,r);` |
| `help()` | `help(s,r);` |
| `echo(a,b)` | `echo(s,r,a,b);` |
| `help(s,r);` | `help(s,r);` (inalterado) |

O atalho só funciona para **comandos registrados** na CLI. Para comandos só do firmware, use wire completo.

## Limite de tamanho

Cada mensagem BLE costuma ter limite de **~256 bytes** (NUS). Listas grandes chegam em **várias** mensagens, cada uma com um header `h` e um ou mais bodies `b`.

A CLI monta e coleta essas partes automaticamente em comandos como `help`, `param_list` e `map_edit`.

## Texto bruto

Se enviar uma linha que **não** segue o protocolo e **não** é comando registrado, a CLI pode perguntar se deseja enviar **como está** ao dispositivo. Use apenas quando o firmware esperar texto fora do formato wire.

## Mais detalhes técnicos

- Implementação no host: repositório [TamanduCLI](https://github.com/Tamandutech/TamanduCLI) (`api/protocol_utils.py`)
- Implementação no firmware: [Integração C++](/TamanduCLI_Docs/cpp-integration/overview/)
