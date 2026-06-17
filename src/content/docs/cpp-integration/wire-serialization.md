---
title: Serialização wire
description: Monte tokens wire, bodies de lista e headers de lista em buffers.
---

Helpers de baixo nível usados por [`wire::Protocol`](/TamanduCLI_Docs/cpp-integration/wire-protocol/) para montar mensagens de saída.

---

## ➕ `appendWireToken`

**Acrescenta** um token em `out`, adicionando **aspas e escapes** quando [`tokenNeedsQuotes`](/TamanduCLI_Docs/cpp-integration/wire-parsing/#-tokenneedsquotes) for `true`.

#### 📝 Sintaxe

```cpp
bool appendWireToken(char* out, size_t outCap, size_t& pos, const char* s)
```

#### 🔮 Exemplo

```cpp
char buf[128];
size_t pos = 0;
wire::appendWireToken(buf, sizeof(buf), pos, "hello world");
// buf == "\"hello world\""
```

#### ⏱ Complexidade

**O(|s|)**.

---

## ➕ `appendComma`

**Acrescenta** uma vírgula ao buffer wire em construção.

#### 📝 Sintaxe

```cpp
bool appendComma(char* buf, size_t cap, size_t& pos)
```

#### ⏱ Complexidade

**O(1)**.

---

## 📄 `appendListBody`

**Serializa** um body de lista `nome(b,role,idx,...);` em `buf`.

#### 📝 Sintaxe

```cpp
bool appendListBody(char* buf, size_t cap, size_t& pos,
                    const char* cmdName, char listMode, char listRole,
                    int idx, const std::vector<const char*>& fields)
```

#### 🔮 Exemplo

```cpp
char buf[256];
size_t pos = 0;
wire::appendListBody(buf, sizeof(buf), pos, "param_list", 'b', 's', 0,
                     {"param_a", "42"});
// buf == "param_list(b,s,0,param_a,42);"
```

#### ⏱ Complexidade

**O(comprimento total dos campos)**.

---

## 📑 `appendListHeader`

**Serializa** um header de lista `nome(h,role,T,C,B,j);` em `buf`.

#### 📝 Sintaxe

```cpp
bool appendListHeader(char* buf, size_t cap, size_t& pos,
                      const char* cmdName, char role,
                      int T, int C, int B, int j)
```

#### 🔮 Exemplo

```cpp
char buf[128];
size_t pos = 0;
wire::appendListHeader(buf, sizeof(buf), pos, "param_list", 's',
                       5, 2, 1, 0);
// buf == "param_list(h,s,5,2,1,0);"
```

#### ⏱ Complexidade

**O(1)** (snprintf pequeno e fixo).

---

## 📏 `listHeaderWireBytes`

**Retorna** o comprimento em bytes de um header de lista serializado (sem terminador nulo). Usado ao empacotar bodies sob [`kPackBudget`](/TamanduCLI_Docs/cpp-integration/wire-types/#constants).

#### 📝 Sintaxe

```cpp
size_t listHeaderWireBytes(const char* cmdName, char role,
                           int T, int C, int B, int j)
```

#### ⏱ Complexidade

**O(1)**.
