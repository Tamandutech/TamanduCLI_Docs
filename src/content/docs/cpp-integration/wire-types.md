---
title: Tipos e constantes wire
description: Constantes, Command, ListHeader e helpers de payload do WireView.
---

## Constantes

| Nome                | Valor | Descrição                                                                      |
| ------------------- | ----- | ------------------------------------------------------------------------------ |
| `wire::kMaxArgs`    | 24    | Máximo de argumentos por comando parseado                                      |
| `wire::kArgCap`     | 160   | Máximo de bytes por buffer de argumento                                        |
| `wire::kNameCap`    | 64    | Comprimento máximo do nome do comando                                          |
| `wire::kPackBudget` | 240   | Orçamento de bytes para empacotar header de lista + bodies em uma mensagem BLE |

---

## 📦 `wire::Command`

**Representação parseada** de um segmento wire `nome(modo,role,...);`.

| Campo       | Tipo                      | Descrição                                                 |
| ----------- | ------------------------- | --------------------------------------------------------- |
| `name`      | `char[kNameCap]`          | Nome do comando (ex.: `param_list`)                       |
| `mode`      | `char`                    | `s` single, `h` header, `b` body                          |
| `role`      | `char`                    | `r` requisição, `s` resposta                              |
| `bodyIndex` | `int`                     | Índice da linha quando `mode == 'b'`; caso contrário `-1` |
| `argc`      | `int`                     | Total de tokens em `argv` (inclui modo e role)            |
| `argv`      | `char[kMaxArgs][kArgCap]` | Argumentos brutos após unquote                            |

Preenchido por [`parseSegment`](/TamanduCLI_Docs/cpp-integration/wire-parsing/#-parsesegment) e [`parseMessage`](/TamanduCLI_Docs/cpp-integration/wire-parsing/#-parsemessage).

---

## 📦 `wire::ListHeader`

**Campos extraídos** de um comando header de lista `nome(h,role,T,C,B,j);`.

| Campo | Significado                            |
| ----- | -------------------------------------- |
| `T`   | Total de linhas na lista               |
| `C`   | Linhas de body nesta mensagem          |
| `B`   | Total de mensagens que compõem a lista |
| `j`   | Índice desta mensagem (`0` … `B-1`)    |

Preenchido por [`parseListHeader`](/TamanduCLI_Docs/cpp-integration/wire-parsing/#-parselistheader).

---

## 🔍 `wire::WireView`

**Vista conveniente** dos argumentos de payload, ignorando modo, role e (em bodies) o índice da linha.

Construa a partir de um `Command`:

```cpp
wire::WireView view{cmd};
```

#### 📝 `payloadStart()`

```cpp
int payloadStart() const
```

Retorna `3` quando `cmd.mode == 'b'`, caso contrário `2`.

#### ⏱ Complexidade

**O(1)**.

---

#### 📝 `payloadArgc()`

```cpp
int payloadArgc() const
```

Retorna o número de argumentos de **payload** (exclui modo, role e índice de body).

#### ⏱ Complexidade

**O(1)**.

---

#### 📝 `arg(i)`

```cpp
const char* arg(int i) const
```

Retorna o argumento de payload no índice relativo `i` (`0` = primeiro argumento útil). Retorna `""` se estiver fora do intervalo.

#### 🔮 Exemplo

```cpp
// Para param_get(s,r,"temperature");
const char* name = view.arg(0);  // "temperature"
```

#### ⏱ Complexidade

**O(1)**.

---

#### 📝 `asInt(i, out)`

```cpp
bool asInt(int i, int& out) const
```

Faz parse de `arg(i)` como inteiro decimal. Retorna `false` se o token for inválido.

#### 🔮 Exemplo

```cpp
int pin;
if (view.asInt(0, pin)) {
  digitalWrite(pin, HIGH);
}
```

#### ⏱ Complexidade

**O(k)**, em que **k** é o comprimento do token.

---

#### 📝 `asFloat(i, out)`

```cpp
bool asFloat(int i, float& out) const
```

Faz parse de `arg(i)` como ponto flutuante. Retorna `false` se for inválido.

#### ⏱ Complexidade

**O(k)**, em que **k** é o comprimento do token.

---

#### 📝 `asStr(i, buf, cap)`

```cpp
bool asStr(int i, char* buf, size_t cap) const
```

Copia `arg(i)` para `buf`. Retorna `false` se o valor não couber em `cap` bytes (incluindo terminador nulo).

#### ⏱ Complexidade

**O(k)**, em que **k** é o comprimento do token.
