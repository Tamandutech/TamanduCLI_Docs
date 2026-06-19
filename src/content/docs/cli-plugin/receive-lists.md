---
title: Receber listas
description: Colete respostas de lista multi-mensagem do dispositivo via BLE.
---

Respostas de lista chegam como várias notificações BLE: **`nome(h,s,T,C,B,j);`** seguido de um ou mais **`nome(b,s,índice,...);`**.

## `ListWireCollectionSession`

Classe em `api.list_wire` que acumula headers e bodies até ter as linhas `1..T`.

```python
from api.list_wire import ListWireCollectionSession, feed_list_wire_collection_from_ble_text

session = ListWireCollectionSession("param_list", record_raw_wire_lines=True)
session.feed_wire(cmd)  # cmd parseado de uma notificação

completed = await session.wait_until_done(timeout=3.0)
# session.rows — dict índice → (nome, valor)
# session.expected_row_total — T do header
```

### Gravar arquivo

```python
from pathlib import Path

path = Path("output/param_list.txt")
session.write_file_if_non_empty(path)
```

Com `record_raw_wire_lines=True`, o arquivo contém as linhas wire originais.

## Padrão completo com hooks BLE

Quando respostas podem chegar **antes** do handler enviar a requisição, use **capture** + **try_feed** (como em `help_handlers.py` e `param_list_edit_handlers.py`).

### 1. Buffer global (capture)

```python
from collections import deque
from api.command_handlers import register_ble_capture
from api.list_wire import ble_message_has_list_wire_response

_recent: deque[str] = deque(maxlen=64)

@register_ble_capture
def capture_my_list(message: str) -> None:
    for line in message.replace("\r\n", "\n").split("\n"):
        s = line.strip()
        if s and ble_message_has_list_wire_response("my_list", s):
            _recent.append(s)
```

### 2. Sessão ativa (try_feed)

```python
from api.command_handlers import register_ble_try_feed

_active_session: ListWireCollectionSession | None = None

@register_ble_try_feed
def try_feed_my_list(message: str) -> bool:
    if _active_session is None:
        return False
    return feed_list_wire_collection_from_ble_text(_active_session, message)
```

Retornar `True` **consome** a notificação (não dispara `@incoming_command` genérico).

### 3. Handler do comando

```python
@cli_command
async def cmd_my_list(inv: WireCommand, ctx: CliHandlerContext) -> None:
    global _active_session
    session = ListWireCollectionSession("my_list")
    _active_session = session
    try:
        for buffered in list(_recent):
            feed_list_wire_collection_from_ble_text(session, buffered)
        await ctx.send_wire(format_message([WireCommand.single_request("my_list", ())]))
        completed = await session.wait_until_done(3.0)
        for idx in sorted(session.rows.keys()):
            if idx == 0:
                continue
            name, value = session.rows[idx]
            ctx.log(f"  [{idx}] {name} = {value}", "WHITE")
    finally:
        _active_session = None
        _recent.clear()
```

## `ble_message_has_list_wire_response`

Helper que testa se um texto BLE contém resposta `list_header` ou `list_body` para um comando:

```python
from api.list_wire import ble_message_has_list_wire_response

ble_message_has_list_wire_response("help", "help(h,s,5,1,1,0);")
```

## Interpretar `session.rows`

| Índice | Conteúdo |
| ------ | -------- |
| `0` | Tupla `("header", str(T))` — total esperado |
| `1..T` | `(nome_campo, valor_ou_resto)` por linha de body |

## Timeout parcial

Se `wait_until_done` retornar `False`, ainda é possível usar linhas parciais em `session.rows` e avisar o usuário.

## Referências no repositório

| Módulo | Comando | Arquivo de saída |
| ------ | ------- | ---------------- |
| `help_handlers.py` | `help` | `output/help_response.txt` |
| `param_list_edit_handlers.py` | `param_list` | `output/param_list.txt` |
| `map_edit_handlers.py` | `map_get` (interno ao `map_edit`) | `output/map.txt` |

## Próximo passo

[Realtime](/TamanduCLI_Docs/cli-plugin/realtime/) — expor valores periódicos no monitor `open_realtime`.
