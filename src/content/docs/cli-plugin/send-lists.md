---
title: Enviar listas
description: Envie listas wire em lote com headers, fatiamento e ACK do dispositivo.
---

Listas no protocolo wire usam **`list_header`** (`h`) + **`list_body`** (`b`). Ao **enviar** do PC para o dispositivo, cada body é uma requisição `nome(b,r,índice,...args)`.

## Montar bodies homogêneos

Todos os bodies devem ter o **mesmo** `name`, `kind == "list_body"`, `is_response == False`:

```python
from api.protocol_utils import WireCommand

rows = [
    WireCommand("map_add", "list_body", False, 0, ("100", "50", "1", "0")),
    WireCommand("map_add", "list_body", False, 1, ("200", "55", "1", "10")),
]
```

## Envio em lote com ACK — recomendado

```python
from api.command_handlers import (
    DEFAULT_LIST_BATCH_ACK_TIMEOUT_SECONDS,
    DEFAULT_LIST_BATCH_MESSAGES_BEFORE_ACK,
    send_homogeneous_list_body_requests_batched,
)

ok = await send_homogeneous_list_body_requests_batched(
    ctx,
    rows,
    max_messages_before_ack=DEFAULT_LIST_BATCH_MESSAGES_BEFORE_ACK,  # 5
    ack_timeout=DEFAULT_LIST_BATCH_ACK_TIMEOUT_SECONDS,              # 30 s
)
```

**O que faz:**

1. Empacota bodies em mensagens `header;body1;body2;…` respeitando **256 bytes** (UTF-8)
2. Envia um **grupo** de até `max_messages_before_ack` mensagens
3. Aguarda ACK wire: `nome(s,s,lo,hi,ok);` com índices de mensagem
4. Repete até enviar todos os bodies

Referência: `map_edit_handlers.py` após `map_clear`.

## Empacotamento manual

```python
from api.protocol_utils import (
    WireCommand,
    WireListHeader,
    format_batched_wire_message,
    pack_list_body_requests_into_batched_wire_messages,
)

packed: list[str] = pack_list_body_requests_into_batched_wire_messages(rows)
for msg in packed:
    await ctx.send_wire(msg)
```

Cada string em `packed` já inclui header `nome(h,r,T,C,B,j);` e os bodies daquele chunk.

### Uma mensagem manual

```python
header = WireListHeader.single_message(total_row_count=2)
bodies = [
    WireCommand("param_set", "list_body", False, 1, ("a", "1")),
    WireCommand("param_set", "list_body", False, 2, ("b", "2")),
]
wire = format_batched_wire_message("param_set", header, bodies)
await ctx.send_wire(wire)
```

## Header — campos `T, C, B, j`

| Campo | Significado |
| ----- | ----------- |
| `T` | Total de linhas (`list_body`) na operação |
| `C` | Bodies **nesta** mensagem BLE |
| `B` | Total de mensagens BLE do envio |
| `j` | Índice desta mensagem (`0` … `B-1`) |

`WireListHeader.single_message(n)` produz `(T=n, C=1, B=1, j=0)` quando tudo cabe em uma mensagem.

## `batch_wire_messages` — comandos genéricos

Para fatiar **qualquer** sequência de `WireCommand` (não só listas homogêneas):

```python
from api.protocol_utils import batch_wire_messages

chunks = batch_wire_messages([cmd1, cmd2, cmd3], max_bytes=256)
for chunk in chunks:
    await ctx.send_wire(chunk)
```

## Tratamento de falha

`send_homogeneous_list_body_requests_batched` retorna `False` se:

- `ctx.send_wire` falhar
- ACK não chegar dentro de `ack_timeout`

Interrompa o fluxo e informe o usuário com `ctx.log`.

## Próximo passo

[Receber listas](/TamanduCLI_Docs/cli-plugin/receive-lists/) — coletar respostas `h`/`b` do dispositivo.
