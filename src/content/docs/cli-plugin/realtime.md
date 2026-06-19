---
title: Realtime
description: Registre variáveis para o monitor open_realtime.
---

O comando **`open_realtime`** (em `realtime_handlers.py`) exibe um painel TUI somente leitura. Novas variáveis são adicionadas com **`@register_realtime_variable`** — não é necessário alterar o handler do painel.

## Decorator básico

```python
from api.command_handlers import CliHandlerContext
from api.realtime import register_realtime_variable
from api.protocol_utils import WireCommand, format_message


@register_realtime_variable("battery", refresh_seconds=1.0, order=0)
async def get_realtime_battery_from_device(ctx: CliHandlerContext) -> str:
    wire = format_message([WireCommand.single_request("battery_get", ())])
    await ctx.send_wire(wire)
    resp = await ctx.incoming.wait_for(
        "battery_get",
        timeout=2.0,
        predicate=lambda c: c.kind == "single",
    )
    return " ".join(resp.arguments) or "unknown"
```

## Parâmetros do decorator

| Parâmetro | Default | Significado |
| --------- | ------- | ----------- |
| `name` | nome da função | Chave exibida no painel |
| `refresh_seconds` | `1.0` | Intervalo mínimo entre atualizações |
| `order` | `100` | Ordem de exibição (menor = primeiro) |

## Assinatura da função getter

Pode ser **síncrona** ou **assíncrona**, com ou sem contexto:

```python
@register_realtime_variable("uptime", refresh_seconds=5.0, order=10)
def get_uptime() -> str:
    return "42 s"


@register_realtime_variable("temp", refresh_seconds=2.0)
async def get_temp(ctx: CliHandlerContext) -> str:
    ...
```

Retorno convertido para `str` no painel. Tipos aceitos: `str`, `int`, `float`, `bool`, `None`.

## Registro em módulo `*_handlers.py`

Coloque getters no mesmo arquivo ou em outro `*_handlers.py` — o carregamento automático importa o módulo e executa os decoradores na importação.

## Usar o monitor

```text
open_realtime
```

- Painel **fullscreen**; prompt principal pausado
- **`q`**, **`Esc`** ou **`Ctrl+C`** fecha
- Erros por variável aparecem como `(stale: ...)` sem derrubar o painel

## Múltiplas variáveis

Cada `@register_realtime_variable` adiciona uma linha ao dicionário global `REALTIME_VARIABLES`. Ordene com `order`:

```python
@register_realtime_variable("battery", refresh_seconds=1.0, order=0)
async def get_battery(ctx: CliHandlerContext) -> str: ...

@register_realtime_variable("rssi", refresh_seconds=3.0, order=1)
async def get_rssi(ctx: CliHandlerContext) -> str: ...
```

## Boas práticas

- Use **timeout curto** em `wait_for` dentro de getters — o painel roda várias coroutines em paralelo
- Trate falhas BLE: exceções viram mensagem `stale` na UI
- Evite bloqueio longo; prefira requisições single rápidas

## Próximo passo

[Arquivos](/TamanduCLI_Docs/cli-plugin/files/) — ler e gravar artefatos em `output/` e `input/`.
