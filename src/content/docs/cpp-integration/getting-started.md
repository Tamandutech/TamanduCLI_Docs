---
title: Primeiros passos
description: Configure pushMessage, registre handlers e processe payloads BLE recebidos.
---

Esta página descreve o padrão de **integração mínima** mostrado nos headers da biblioteca.

## 1. Implemente a saída de mensagens

A E/S Bluetooth (ou UART) é **sua** responsabilidade. A biblioteca apenas chama `pushMessage` com strings wire já formatadas:

```cpp
static void pushMessage(const char* msg) {
  bleEnqueue(msg);  // sua fila de transporte
}
```

## 2. Escreva um handler de comando

Os handlers recebem o comando parseado, uma vista do payload e o emissor de protocolo:

```cpp
#include "cli_map.hpp"

static bool onHelp(const wire::Command& cmd, wire::WireView view,
                   wire::Protocol<256>& proto) {
  return proto.emitSingleResponse("help", {"ok"});
}
```

Retorne `true` quando o comando for tratado com sucesso.

## 3. Registre comandos e processe mensagens

```cpp
cli::CliMap<256> cli(pushMessage);

cli.registerCommand("help", onHelp);
cli.registerCommand("param_list", onParamList);

// Chamado quando uma notificação BLE chega:
cli.processMessage("help(s,r);");
```

`processMessage` faz parse da string completa, despacha cada segmento para seu handler e retorna `true` se **pelo menos um** comando foi tratado.

## 4. Responda a requisições

Dentro de um handler, leia argumentos por meio de `WireView`:

```cpp
static bool onParamGet(const wire::Command& cmd, wire::WireView view,
                       wire::Protocol<256>& proto) {
  const char* name = view.arg(0);
  int value = 0;
  // ... ler parâmetro ...
  char buf[16];
  snprintf(buf, sizeof(buf), "%d", value);
  return proto.respondSingle(cmd, {buf});
}
```

Para respostas em lista, monte as linhas e deixe a biblioteca empacotar headers e bodies:

```cpp
std::vector<wire::Protocol<256>::ListRow> rows = {
  {"param_a", "1", "42"},
  {"param_b", "0", "hello"},
};
return proto.emitListResponseRows("param_list", rows);
```

## Limites

| Constante | Valor | Significado |
| --------- | ----- | ----------- |
| `cli::kMaxRegisteredCommands` | 32 | Máximo de handlers no `CliMap` |
| `wire::kMaxArgs` | 24 | Máximo de tokens por comando |
| `wire::kArgCap` | 160 | Máximo de bytes por argumento |
| `wire::kNameCap` | 64 | Tamanho máximo do nome do comando |
| `wire::kPackBudget` | 240 | Orçamento de bytes ao empacotar mensagens de lista |

Os nomes de comando são comparados de forma **case-insensitive** após o registro.
