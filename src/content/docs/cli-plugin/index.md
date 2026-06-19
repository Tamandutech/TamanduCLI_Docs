---
title: Plugins CLI
description: Estenda o TamanduCLI com comandos customizados em src/commands/ usando a API Python.
---

Esta seção documenta como **estender** o [TamanduCLI](https://github.com/Tamandutech/TamanduCLI) com plugins Python: novos comandos digitáveis no console, envio/recebimento BLE, listas wire, monitor realtime e interação com arquivos locais.

## O que é um plugin

Um plugin é um módulo Python em **`src/commands/`** cujo nome termina em **`_handlers.py`**. Ele é **importado automaticamente** na inicialização da CLI e registra handlers via decoradores da API.

Exemplos no repositório:

| Arquivo | Comandos |
| ------- | -------- |
| `help_handlers.py` | `help` |
| `param_list_edit_handlers.py` | `param_list`, `param_edit` |
| `map_edit_handlers.py` | `map_edit` |
| `realtime_handlers.py` | `open_realtime` + variável `battery` |

## Pacotes da API

| Módulo | Uso |
| ------ | --- |
| `api.command_handlers` | Registro de comandos, contexto, hooks BLE, dispatch |
| `api.protocol_utils` | `WireCommand`, `format_message`, parse/format wire |
| `api.incoming` | `IncomingRouter.wait_for` — esperar respostas single |
| `api.list_wire` | Coleta de listas, envio em lote com ACK |
| `api.realtime` | `@register_realtime_variable` |
| `api.output_paths` | Pastas `output/` e `input/` |

## Fluxo de uma invocação

```text
Usuário digita no prompt
    → normalize_cli_input (atalho name → name(s,r,...))
    → dispatch_cli_command
    → seu handler @cli_command(inv, ctx)
        → ctx.send_wire(...)           # envia ao dispositivo
        → ctx.incoming.wait_for(...)   # espera resposta
        → ctx.log(...)                 # imprime no terminal
```

Notificações BLE chegam em paralelo via `dispatch_ble_notification` → `IncomingRouter.record_many`.

## Pré-requisitos

- Repositório TamanduCLI clonado
- `uv run src/main.py` funcionando (ver [Guia do usuário](/TamanduCLI_Docs/user-guide/installation/))
- Familiaridade básica com [Protocolo wire](/TamanduCLI_Docs/user-guide/wire-protocol/)

## Mapa da documentação

| Página | Conteúdo |
| ------ | -------- |
| [Primeiros passos](/TamanduCLI_Docs/cli-plugin/getting-started/) | Criar o primeiro módulo `*_handlers.py` |
| [Registrar comandos](/TamanduCLI_Docs/cli-plugin/register-commands/) | `@cli_command`, nomes, carregamento automático |
| [Ler parâmetros](/TamanduCLI_Docs/cli-plugin/read-parameters/) | `WireCommand`, argumentos do usuário |
| [Enviar wire](/TamanduCLI_Docs/cli-plugin/send-wire/) | `ctx.send_wire`, `format_message` |
| [Receber single](/TamanduCLI_Docs/cli-plugin/incoming-single/) | `wait_for`, `@incoming_command` |
| [Enviar listas](/TamanduCLI_Docs/cli-plugin/send-lists/) | Batch, headers, ACK |
| [Receber listas](/TamanduCLI_Docs/cli-plugin/receive-lists/) | `ListWireCollectionSession`, capture/try_feed |
| [Realtime](/TamanduCLI_Docs/cli-plugin/realtime/) | `@register_realtime_variable` |
| [Arquivos](/TamanduCLI_Docs/cli-plugin/files/) | `output/`, `input/` |
| [Interface (prompt_toolkit)](/TamanduCLI_Docs/cli-plugin/prompt-toolkit/) | Confirmações, menus, painéis |
