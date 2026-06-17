---
title: Parse wire
description: Faça parse de mensagens wire, segmentos, tokens e headers de lista.
---

Todas as funções ficam no namespace `wire`.

---

## ⚖️ `nameEq`

**Compara** duas strings C por **igualdade**.

```cpp
bool a = wire::nameEq("help", cmd.name);
```

#### 📝 Sintaxe

```cpp
bool nameEq(const char* a, const char* b)
```

#### ⏱ Complexidade

**O(n)** no comprimento das strings.

---

## ✂️ `trimView`

**Retorna** o intervalo `[a, b)` **sem espaços em branco** no início ou no fim de `s[0..n)`.

#### 📝 Sintaxe

```cpp
void trimView(const char* s, size_t n, size_t& a, size_t& b)
```

#### ⏱ Complexidade

**O(n)**.

---

## 🔪 `splitTopLevel`

**Divide** `s[0..n)` em segmentos no delimitador `delim`, **sem dividir** dentro de parênteses aninhados ou strings entre aspas `"..."`.

#### 📝 Sintaxe

```cpp
bool splitTopLevel(const char* s, size_t n, char delim,
                     std::vector<std::pair<size_t, size_t>>& ranges)
```

#### 🔮 Exemplo

```cpp
std::vector<std::pair<size_t, size_t>> ranges;
wire::splitTopLevel("a;b;c", 5, ';', ranges);
// ranges: [0,1), [2,3), [4,5)
```

#### ⏱ Complexidade

**O(n)**.

---

## 🎯 `findMatchingClose`

**Localiza** o `)` de fechamento que corresponde ao `(` em `openIdx`, respeitando strings e aninhamento.

#### 📝 Sintaxe

```cpp
bool findMatchingClose(const char* s, size_t openIdx, size_t n,
                         size_t& closeIdx)
```

#### ⏱ Complexidade

**O(n)** a partir de `openIdx`.

---

## 🔓 `unquoteField`

**Remove** aspas ao redor e **desfaz escapes** de `\\` e `\"` em `out`. Tokens sem aspas são copiados após trim, como estão.

#### 📝 Sintaxe

```cpp
bool unquoteField(const char* src, size_t len, char* out, size_t outCap)
```

#### 🔮 Exemplo

```cpp
char buf[wire::kArgCap];
wire::unquoteField("\"hello \\\"world\\\"\"", 18, buf, sizeof(buf));
// buf == "hello \"world\""
```

#### ⏱ Complexidade

**O(len)**.

---

## 📋 `copyTokenToArgv`

**Copia** um token bruto para `cmd.argv[idx]` após [`unquoteField`](#-unquotefield).

#### 📝 Sintaxe

```cpp
bool copyTokenToArgv(Command& cmd, int idx, const char* src, size_t len)
```

Retorna `false` se `idx` estiver fora do intervalo ou o token exceder `kArgCap`.

#### ⏱ Complexidade

**O(len)**.

---

## 🔢 `tokenIsPlainInteger`

Retorna `true` se `s` for um inteiro decimal, opcionalmente negativo (ex.: `42`, `-7`).

#### 📝 Sintaxe

```cpp
bool tokenIsPlainInteger(const char* s)
```

#### ⏱ Complexidade

**O(n)**.

---

## 🏷️ `tokenIsPlainIdentifier`

Retorna `true` se `s` for um identificador C válido (`[a-zA-Z_][a-zA-Z0-9_]*`).

#### 📝 Sintaxe

```cpp
bool tokenIsPlainIdentifier(const char* s)
```

#### ⏱ Complexidade

**O(n)**.

---

## ❓ `tokenNeedsQuotes`

Retorna `true` se `s` precisar de aspas na serialização (não for inteiro nem identificador puro).

#### 📝 Sintaxe

```cpp
bool tokenNeedsQuotes(const char* s)
```

#### ⏱ Complexidade

**O(n)**.

---

## 🔢 `parseFloat`

**Converte** uma string em `float`. Retorna `false` para entrada nula, vazia ou inválida.

#### 📝 Sintaxe

```cpp
bool parseFloat(const char* s, float& out)
```

#### 🔮 Exemplo

```cpp
float v;
wire::parseFloat("3.14", v);  // v == 3.14f
```

#### ⏱ Complexidade

**O(n)**.

---

## 🔢 `parseInt`

**Converte** uma string em `int` na base 10. Retorna `false` para entrada nula, vazia ou inválida.

#### 📝 Sintaxe

```cpp
bool parseInt(const char* s, int& out)
```

#### ⏱ Complexidade

**O(n)**.

---

## 📄 `parseSegment`

**Faz parse** de um segmento wire `nome(modo,role,...)` (ponto e vírgula opcional) em um [`Command`](/cpp-integration/wire-types/#-wirecommand).

#### 📝 Sintaxe

```cpp
bool parseSegment(const char* seg, size_t segLen, Command& out)
```

#### 🔮 Exemplo

```cpp
wire::Command cmd;
wire::parseSegment("help(s,r)", 9, cmd);
// cmd.name == "help", cmd.mode == 's', cmd.role == 'r'
```

#### ⏱ Complexidade

**O(segLen)**.

---

## 📨 `parseMessage`

**Faz parse** de uma mensagem completa com um ou mais comandos separados por `;`.

#### 📝 Sintaxe

```cpp
bool parseMessage(const char* msg, std::vector<Command>& out)
```

#### 🔮 Exemplo

```cpp
std::vector<wire::Command> commands;
wire::parseMessage("help(s,r);param_list(s,r);", commands);
// commands.size() == 2
```

Retorna `false` se `msg` for nulo ou algum segmento for inválido.

#### ⏱ Complexidade

**O(|msg|)**.

---

## 📑 `parseListHeader`

**Extrai** `T, C, B, j` de um comando header parseado (`mode == 'h'`, pelo menos 6 entradas em argv).

#### 📝 Sintaxe

```cpp
bool parseListHeader(const Command& cmd, ListHeader& hdr)
```

#### 🔮 Exemplo

```cpp
// param_list(h,s,5,1,1,0);
wire::ListHeader hdr;
wire::parseListHeader(cmd, hdr);
// hdr.T == 5, hdr.C == 1, hdr.B == 1, hdr.j == 0
```

#### ⏱ Complexidade

**O(1)**.

---

## 🔤 `commandKeyLower`

**Normaliza** o nome de um comando para **minúsculas** para busca case-insensitive.

#### 📝 Sintaxe

```cpp
std::string commandKeyLower(const char* name)
```

#### 🔮 Exemplo

```cpp
std::string key = wire::commandKeyLower("Param_List");
// key == "param_list"
```

#### ⏱ Complexidade

**O(n)**.
