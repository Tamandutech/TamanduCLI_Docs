---
title: Emissor de protocolo
description: wire::Protocol — emita comandos single, respostas de lista e ACKs de lote.
---

## 📡 `wire::Protocol<MessageSize>`

**Emite** mensagens wire por meio de um callback `pushMessage` injetado. O transporte Bluetooth **não** é tratado pela biblioteca — apenas strings formatadas são entregues à sua fila.

```cpp
wire::Protocol<256> proto(pushMessage);
```

| Alias de tipo | Definição |
| ------------- | --------- |
| `PushMessageFn` | `void (*)(const char* msg)` |
| `ListRow` | `std::vector<const char*>` — campos de payload de uma linha de lista |

---

## 🏗️ Construtor

**Constrói** o emissor com a função que **enfileira cada mensagem wire concluída**.

#### 📝 Sintaxe

```cpp
explicit Protocol(PushMessageFn pushMessage)
```

#### 🔮 Exemplo

```cpp
static void pushMessage(const char* msg) { bleEnqueue(msg); }
wire::Protocol<256> proto(pushMessage);
```

#### ⏱ Complexidade

**O(1)**.

---

## 📤 `emitSingle`

**Emite** um comando single `nome(s,role,...);` e chama `pushMessage`.

#### 📝 Sintaxe

```cpp
bool emitSingle(char role, const char* cmdName,
                const std::vector<const char*>& parts) const
```

| Parâmetro | Significado |
| --------- | ----------- |
| `role` | `'r'` requisição ou `'s'` resposta |
| `cmdName` | Nome do comando |
| `parts` | Argumentos de payload após modo e role |

Retorna `false` se a mensagem exceder `MessageSize`.

#### 🔮 Exemplo

```cpp
proto.emitSingle('s', "help", {"ok", "ready"});
// envia: help(s,s,ok,ready);
```

#### ⏱ Complexidade

**O(comprimento total dos argumentos)**.

---

## 📤 `emitSingleRequest`

**Atalho** para `emitSingle('r', cmdName, parts)`.

#### 📝 Sintaxe

```cpp
bool emitSingleRequest(const char* cmdName,
                       const std::vector<const char*>& parts = {}) const
```

#### 🔮 Exemplo

```cpp
proto.emitSingleRequest("param_get", {"temperature"});
// envia: param_get(s,r,temperature);
```

#### ⏱ Complexidade

**O(comprimento total dos argumentos)**.

---

## 📤 `emitSingleResponse`

**Atalho** para `emitSingle('s', cmdName, parts)`.

#### 📝 Sintaxe

```cpp
bool emitSingleResponse(const char* cmdName,
                        const std::vector<const char*>& parts) const
```

#### 🔮 Exemplo

```cpp
proto.emitSingleResponse("param_get", {"42"});
// envia: param_get(s,s,42);
```

#### ⏱ Complexidade

**O(comprimento total dos argumentos)**.

---

## ↩️ `respondSingle`

**Responde** a uma **requisição** single recebida (`mode == 's'`, `role == 'r'`) usando o mesmo nome de comando.

#### 📝 Sintaxe

```cpp
bool respondSingle(const Command& req,
                   const std::vector<const char*>& parts) const
```

Retorna `false` se `req` não for uma requisição single válida.

#### 🔮 Exemplo

```cpp
// req parseado de param_get(s,r,temperature);
proto.respondSingle(req, {"23.5"});
// envia: param_get(s,s,23.5);
```

#### ⏱ Complexidade

**O(comprimento total dos argumentos)**.

---

## ✅ `emitBatchAck`

**Envia** um ACK de lote para coleta de listas no host.

Formato: `nome(s,s,<messageIndex>,<messageIndex>,ok);`

#### 📝 Sintaxe

```cpp
void emitBatchAck(const char* cmdName, int messageIndex) const
```

#### 🔮 Exemplo

```cpp
proto.emitBatchAck("param_list", 0);
// envia: param_list(s,s,0,0,ok);
```

#### ⏱ Complexidade

**O(1)**.

---

## 📝 `formatListBody`

**Formata** um body de lista em `buf` **sem** chamar `pushMessage`.

#### 📝 Sintaxe

```cpp
bool formatListBody(char* buf, size_t cap, const char* cmdName, char role,
                    int idx, const std::vector<const char*>& fields) const
```

#### ⏱ Complexidade

**O(comprimento total dos campos)**.

---

## 📝 `makeListBodySegment`

**Monta** um segmento de body completo `nome(b,role,idx,...);` como `std::string`. Retorna **string vazia** em caso de estouro de buffer.

#### 📝 Sintaxe

```cpp
std::string makeListBodySegment(const char* cmdName, char role, int idx,
                                const std::vector<const char*>& fields) const
```

#### 🔮 Exemplo

```cpp
auto seg = proto.makeListBodySegment("param_list", 's', 0, {"a", "1"});
// seg == "param_list(b,s,0,a,1);"
```

#### ⏱ Complexidade

**O(comprimento total dos campos)**.

---

## 📦 `emitListFromBodySegments`

**Empacota** segmentos de body já formatados em uma ou mais mensagens. Cada mensagem tem a forma:

```text
nome(h,role,T,C,B,j);body1;body2;...
```

Listas longas são **divididas** usando [`kPackBudget`](/cpp-integration/wire-types/#constants). Cada mensagem final é passada a `pushMessage`.

#### 📝 Sintaxe

```cpp
void emitListFromBodySegments(const char* cmdName, char role,
                              const std::vector<std::string>& bodies) const
```

#### 🔮 Exemplo

```cpp
std::vector<std::string> bodies = {
  "param_list(b,s,0,a,1);",
  "param_list(b,s,1,b,2);",
};
proto.emitListFromBodySegments("param_list", 's', bodies);
```

#### ⏱ Complexidade

**O(total de bytes dos bodies)**.

---

## 📦 `emitListResponse`

**Emite** uma lista com `role == 's'`. Wrapper em torno de `emitListFromBodySegments`.

#### 📝 Sintaxe

```cpp
bool emitListResponse(const char* cmdName,
                      const std::vector<std::string>& bodies) const
```

Sempre retorna `true` (erros de tamanho são silenciosos dentro do flush de chunks).

#### ⏱ Complexidade

**O(total de bytes dos bodies)**.

---

## 📦 `emitListRequest`

**Emite** uma lista com `role == 'r'`. Wrapper em torno de `emitListFromBodySegments`.

#### 📝 Sintaxe

```cpp
bool emitListRequest(const char* cmdName,
                     const std::vector<std::string>& bodies) const
```

#### ⏱ Complexidade

**O(total de bytes dos bodies)**.

---

## 📋 `emitListFromRows`

**Monta** segmentos de body a partir de linhas de payload, atribui índices **0, 1, 2, …** automaticamente, empacota headers e envia.

#### 📝 Sintaxe

```cpp
bool emitListFromRows(const char* cmdName, char role,
                      const std::vector<ListRow>& rows) const
```

Retorna `false` se alguma linha não couber em `MessageSize`.

#### 🔮 Exemplo

```cpp
std::vector<wire::Protocol<256>::ListRow> rows = {
  {"param_a", "read", "10"},
  {"param_b", "write", "0"},
};
proto.emitListFromRows("param_list", 's', rows);
```

#### ⏱ Complexidade

**O(total de bytes das linhas)**.

---

## 📋 `emitListResponseRows`

**Atalho** para `emitListFromRows` com `role == 's'`.

#### 📝 Sintaxe

```cpp
bool emitListResponseRows(const char* cmdName,
                          const std::vector<ListRow>& rows) const
```

#### ⏱ Complexidade

**O(total de bytes das linhas)**.

---

## 📋 `emitListRequestRows`

**Atalho** para `emitListFromRows` com `role == 'r'`.

#### 📝 Sintaxe

```cpp
bool emitListRequestRows(const char* cmdName,
                         const std::vector<ListRow>& rows) const
```

#### ⏱ Complexidade

**O(total de bytes das linhas)**.

---

## ↩️ `respondList`

**Responde** a uma **requisição** de header de lista (`mode == 'h'`, `role == 'r'`) com segmentos de body formatados.

#### 📝 Sintaxe

```cpp
bool respondList(const Command& reqHeader,
                 const std::vector<std::string>& bodies) const
```

Retorna `false` se `reqHeader` não for um header de requisição de lista válido.

#### ⏱ Complexidade

**O(total de bytes dos bodies)**.
