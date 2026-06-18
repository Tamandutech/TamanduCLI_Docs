---
title: Guia do usuário
description: Como usar o TamanduCLI para conectar, enviar comandos e interagir com robôs via Bluetooth.
---

O **TamanduCLI** é um console de texto para falar com robôs e outros dispositivos embarcados que expõem o **Nordic UART Service (NUS)** em Bluetooth Low Energy. Este guia documenta o aplicativo disponível no repositório [TamanduCLI](https://github.com/Tamandutech/TamanduCLI).

Com ele você pode:

- **Conectar** a um dispositivo BLE próximo
- **Enviar comandos** ao firmware e ver respostas no terminal
- **Listar e editar parâmetros** do dispositivo (`param_list`, `param_edit`)
- **Baixar, editar e aplicar mapas** (`map_edit`)
- **Monitorar variáveis em tempo real** (`open_realtime`)
- **Consultar a ajuda** do firmware (`help`)

## Para quem é este guia

Este guia é para **usuários finais** e operadores que usam a CLI no dia a dia — sem precisar escrever código Python ou integrar firmware.

Se você desenvolve firmware em C++, veja a seção [Integração C++](/TamanduCLI_Docs/cpp-integration/overview/).

## Visão geral do fluxo

```text
1. Instalar dependências (uv)
2. Executar: uv run src/main.py
3. Escolher o dispositivo BLE na lista
4. Digitar comandos no prompt 📤 Enviar:
5. Ler respostas no terminal
6. Digitar quit, exit ou close para desconectar
```

## Conteúdo deste guia

| Página | O que você aprende |
| ------ | ------------------ |
| [Instalação](/TamanduCLI_Docs/user-guide/installation/) | Pré-requisitos e como iniciar a CLI |
| [Conexão BLE](/TamanduCLI_Docs/user-guide/connecting/) | Varredura, seleção de dispositivo e reconexão |
| [Console](/TamanduCLI_Docs/user-guide/console/) | Prompt, atalhos, autocompletar e envio de texto bruto |
| [Comandos](/TamanduCLI_Docs/user-guide/commands/) | Referência dos comandos integrados |
| [Editar parâmetros](/TamanduCLI_Docs/user-guide/edit-parameters/) | Fluxo `param_list` e `param_edit` |
| [Editar mapa](/TamanduCLI_Docs/user-guide/edit-map/) | Fluxo `map_edit` |
| [Monitor em tempo real](/TamanduCLI_Docs/user-guide/realtime/) | Janela `open_realtime` |
| [Protocolo wire](/TamanduCLI_Docs/user-guide/wire-protocol/) | Formato avançado das mensagens |

## Arquivos gerados pela CLI

Durante o uso, a CLI grava arquivos nas pastas **`output/`** e **`input/`** na raiz do repositório [TamanduCLI](https://github.com/Tamandutech/TamanduCLI):

| Pasta | Uso |
| ----- | --- |
| `output/` | Cópia **original** lida do dispositivo (somente leitura de referência) |
| `input/` | Cópia para **você editar** antes de aplicar mudanças |

Nunca edite diretamente em `output/` — sempre trabalhe em `input/` quando o comando pedir edição.
