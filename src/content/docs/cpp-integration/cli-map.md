---
title: CliMap
description: cli::CliMap — registre handlers de comandos e despache mensagens wire.
---

## 🗺️ `cli::CliMap<MessageSize>`

**Registra** handlers de comandos e **despacha** comandos wire parseados para eles. Inclui um [`wire::Protocol<MessageSize>`](/cpp-integration/wire-protocol/) interno, repassado a cada handler para respostas.

```cpp
cli::CliMap<256> cli(pushMessage);
```

| Constante | Valor |
| --------- | ----- |
| `cli::kMaxRegisteredCommands` | 32 |

| Alias de tipo | Definição |
| ------------- | --------- |
| `Protocol` | `wire::Protocol<MessageSize>` |
| `HandlerFn` | `bool (*)(const wire::Command&, wire::WireView, Protocol&)` |
| `PushMessageFn` | `Protocol::PushMessageFn` |

---

## 🏗️ Construtor

**Constrói** o mapa com a **função de enfileiramento Bluetooth** compartilhada pelo emissor de protocolo interno.

#### 📝 Sintaxe

```cpp
explicit CliMap(PushMessageFn pushMessage)
```

#### 🔮 Exemplo

```cpp
static void pushMessage(const char* msg) { bleEnqueue(msg); }
cli::CliMap<256> cli(pushMessage);
```

#### ⏱ Complexidade

**O(1)**.

---

## 🔌 `protocol()`

**Retorna** uma referência ao emissor `wire::Protocol` **interno** (sobrecargas mutável e const).

#### 📝 Sintaxe

```cpp
Protocol& protocol()
const Protocol& protocol() const
```

#### 🔮 Exemplo

```cpp
cli.protocol().emitSingleResponse("status", {"ok"});
```

#### ⏱ Complexidade

**O(1)**.

---

## ➕ `registerCommand`

**Registra** ou **substitui** um handler para `name`. O nome é normalizado para **minúsculas** (chaves case-insensitive).

#### 📝 Sintaxe

```cpp
bool registerCommand(const char* name, HandlerFn handler)
```

Retorna `false` se:

- `name` ou `handler` for nulo
- o nome normalizado estiver vazio ou for ≥ `wire::kNameCap`
- `kMaxRegisteredCommands` (32) já tiver sido atingido

Se o comando já existir, seu handler é **atualizado** e a função retorna `true`.

#### 🔮 Exemplo

```cpp
static bool onHelp(const wire::Command& cmd, wire::WireView view,
                   wire::Protocol<256>& proto) {
  return proto.emitSingleResponse("help", {"ok"});
}

cli.registerCommand("help", onHelp);
cli.registerCommand("HELP", onHelp);  // atualiza a mesma entrada
```

#### ⏱ Complexidade

**O(n)** no número de comandos registrados.

---

## ➖ `unregisterCommand`

**Remove** um comando do mapa. A correspondência de nome é **case-insensitive**.

#### 📝 Sintaxe

```cpp
bool unregisterCommand(const char* name)
```

Retorna `false` se `name` for nulo ou o comando não estiver registrado.

#### 🔮 Exemplo

```cpp
cli.unregisterCommand("help");
```

#### ⏱ Complexidade

**O(n)** no número de comandos registrados.

---

## 🔍 `findHandler`

**Busca** o handler registrado para `name` (case-insensitive).

#### 📝 Sintaxe

```cpp
HandlerFn findHandler(const char* name) const
```

Retorna `nullptr` se não encontrado ou se `name` for nulo.

#### ⏱ Complexidade

**O(n)**.

---

## 🚀 `dispatch`

**Despacha** um [`Command`](/cpp-integration/wire-types/#-wirecommand) já parseado para o handler registrado.

#### 📝 Sintaxe

```cpp
bool dispatch(const wire::Command& cmd)
```

Constrói um [`WireView`](/cpp-integration/wire-types/#-wireview) a partir de `cmd` e chama o handler com o protocolo interno. Retorna `false` se não houver handler registrado para `cmd.name`.

#### 🔮 Exemplo

```cpp
wire::Command cmd;
wire::parseSegment("help(s,r)", 9, cmd);
cli.dispatch(cmd);
```

#### ⏱ Complexidade

**O(n)** para a busca do handler, mais o tempo de execução do handler.

---

## 📨 `processMessage`

**Faz parse** de uma mensagem BLE completa e **despacha** cada segmento de comando.

Aceita vários comandos separados por `;` (ex.: `"help(s,r);param_list(s,r);"`).

#### 📝 Sintaxe

```cpp
bool processMessage(const char* message)
```

| Valor de retorno | Significado |
| ---------------- | ----------- |
| `false` | Parse falhou, ou nenhum handler retornou `true` |
| `true` | Pelo menos um comando foi despachado e seu handler retornou `true` |

#### 🔮 Exemplo

```cpp
// Notificação BLE recebida:
cli.processMessage("help(s,r);unknown(s,r);");
// onHelp é executado; unknown é ignorado; retorna true se onHelp teve sucesso
```

#### ⏱ Complexidade

**O(|message| + k × n)**, em que **k** é a quantidade de comandos e **n** é o número de comandos registrados por busca.

---

## 📊 `registeredCount`

**Retorna** quantos comandos estão registrados no momento (0 … `kMaxRegisteredCommands`).

#### 📝 Sintaxe

```cpp
int registeredCount() const
```

#### ⏱ Complexidade

**O(1)**.
