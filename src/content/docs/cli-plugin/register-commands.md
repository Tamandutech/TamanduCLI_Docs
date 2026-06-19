---
title: Registrar comandos
description: Vincule funções Python a textos digitáveis no console com @cli_command e @incoming_command.
---

## Comandos digitados pelo usuário — `@cli_command`

Associa uma função **assíncrona** a um nome invocável no prompt.

### Inferir o nome da função

```python
from api.command_handlers import CliHandlerContext, WireCommand, cli_command


@cli_command
async def cmd_battery_status(inv: WireCommand, ctx: CliHandlerContext) -> None:
    ...
```

`cmd_battery_status` → comando **`battery_status`**.

### Nome explícito

```python
@cli_command("bat")
async def cmd_battery_status(inv: WireCommand, ctx: CliHandlerContext) -> None:
    ...
```

Comando **`bat`**.

### Registro manual

```python
from api.command_handlers import register_cli_command

async def my_handler(inv: WireCommand, ctx: CliHandlerContext) -> None:
    ...

register_cli_command("custom_name", my_handler)
```

## Comandos enviados pelo dispositivo — `@incoming_command`

Reage a mensagens wire **recebidas** via BLE (não digitadas pelo usuário).

Handler **síncrono**, recebe só `WireCommand`:

```python
from api.command_handlers import WireCommand, incoming_command


@incoming_command  # _incoming_status → "status"
def _incoming_status(cmd: WireCommand) -> None:
    print("Dispositivo enviou:", cmd.name, cmd.arguments)


@incoming_command("alarm")
def on_alarm(cmd: WireCommand) -> None:
    ...
```

### Ordem de processamento BLE

Cada notificação passa por:

1. Todos os **`@register_ble_capture`** (buffer opcional)
2. Parse → **`IncomingRouter.record_many`**
3. **`@register_ble_try_feed`** (primeiro que retorna `True` para o fluxo)
4. **`@incoming_command`** por comando parseado

## Carregamento automático

Ao importar `api.command_handlers`, a função `_load_command_handler_modules()` importa:

```text
src/commands/**/*_handlers.py
```

Não é necessário editar `main.py` para registrar plugins em `commands/`.

## Atalho do prompt

Comandos registrados aceitam forma curta (expandida antes do handler):

| Digitado | Normalizado |
| -------- | ----------- |
| `help` | `help(s,r);` |
| `help()` | `help(s,r);` |
| `echo(a,b)` | `echo(s,r,a,b);` |
| `help(s,r);` | inalterado |

Implementação: `normalize_cli_input` em `api/protocol_utils.py`.

## Verificar handlers

```bash
uv run scripts/list_registered_commands.py
```

Saída:

```text
CLI commands: echo, help, map_edit, ...
Incoming BLE: echo, ping, ...
```

## Próximo passo

[Ler parâmetros](/TamanduCLI_Docs/cli-plugin/read-parameters/) — o objeto `WireCommand` passado ao handler.
