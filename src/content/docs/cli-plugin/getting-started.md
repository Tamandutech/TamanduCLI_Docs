---
title: Primeiros passos
description: Crie seu primeiro plugin em src/commands/.
---

## 1. Crie o arquivo do plugin

O nome **deve** terminar em `_handlers.py`:

```text
src/commands/motion_handlers.py
```

Módulos com outro nome **não** são carregados automaticamente.

## 2. Registre um comando mínimo

```python
from __future__ import annotations

from api.command_handlers import CliHandlerContext, WireCommand, cli_command
from api.protocol_utils import format_message


@cli_command  # cmd_set_speed → comando "set_speed"
async def cmd_set_speed(inv: WireCommand, ctx: CliHandlerContext) -> None:
    speed = inv.arguments[0] if inv.arguments else "0"
    wire = format_message([WireCommand.single_request("set_speed", (speed,))])
    await ctx.send_wire(wire)
    ctx.log(f"📤 set_speed enviado: {speed}", "GREEN")
```

## 3. Execute e teste

```bash
uv run src/main.py
```

No prompt:

```text
set_speed(42)
# ou wire completo:
set_speed(s,r,42);
```

## 4. Confirme o registro

Sem BLE:

```bash
uv run scripts/list_registered_commands.py
```

Deve listar `set_speed` em **CLI commands**.

## Convenções de nome

| Função Python | Comando no prompt |
| ------------- | ----------------- |
| `cmd_help` | `help` |
| `cmd_param_list` | `param_list` |
| `@cli_command("open_realtime")` | `open_realtime` (nome explícito) |

## Onde colocar lógica complexa

| Complexidade | Abordagem |
| ------------ | --------- |
| Enviar um wire e logar | Só `@cli_command` + `ctx.send_wire` |
| Esperar uma resposta single | `ctx.incoming.wait_for` |
| Coletar lista multi-mensagem | `@register_ble_capture` + `ListWireCollectionSession` — ver [Receber listas](/TamanduCLI_Docs/cli-plugin/receive-lists/) |
| Enviar muitos bodies com ACK | `send_homogeneous_list_body_requests_batched` — ver [Enviar listas](/TamanduCLI_Docs/cli-plugin/send-lists/) |

## Módulo fora de `src/commands/`

Se o plugin ficar em outro pacote, adicione no **final** de `src/api/command_handlers.py`:

```python
import my_robot_commands  # noqa: F401
```

Prefira sempre `src/commands/*_handlers.py` para não editar o núcleo da API.

## Próximo passo

[Registrar comandos](/TamanduCLI_Docs/cli-plugin/register-commands/) — opções de `@cli_command` e handlers de mensagens do dispositivo.
