---
title: Receber single
description: Aguarde respostas single e registre handlers para mensagens do dispositivo.
---

## Buffer de entrada — `IncomingRouter`

Toda notificação BLE parseada é gravada em **`ctx.incoming`**. Handlers assíncronos podem **esperar** um comando específico sem bloquear o loop de eventos.

## `wait_for` — esperar uma resposta

```python
resp = await ctx.incoming.wait_for(
    "battery_get",           # nome do comando
    is_response=True,        # default: True (role 's')
    timeout=5.0,
    predicate=lambda c: c.kind == "single",
)
```

| Parâmetro | Significado |
| --------- | ----------- |
| `name` | Nome do comando (case-insensitive) |
| `is_response` | `True` para respostas `(...,s,...)` |
| `timeout` | Segundos até `TimeoutError` |
| `predicate` | Filtro extra opcional |

Retorno: **`WireCommand`** correspondente (removido do buffer FIFO).

### Esperar requisição do dispositivo

```python
req = await ctx.incoming.wait_for(
    "remote_cmd",
    is_response=False,
    timeout=10.0,
)
```

### Limpar o buffer

```python
ctx.incoming.clear()
```

## `@incoming_command` — reação síncrona

Para efeitos colaterais em **toda** mensagem recebida (log, alarme):

```python
from api.command_handlers import WireCommand, incoming_command


@incoming_command
def _incoming_telemetry(cmd: WireCommand) -> None:
    if cmd.name.lower() != "telemetry":
        return
    # cmd.kind, cmd.arguments disponíveis
    print("Telemetria:", cmd.arguments)
```

**Nota:** se um `@register_ble_try_feed` retornar `True`, o dispatch **não** chega aos `@incoming_command` naquela notificação.

## Single request vs response

| `inv.is_response` | Papel wire | Quem envia |
| ----------------- | ---------- | ---------- |
| `False` | `r` requisição | Normalmente PC → dispositivo |
| `True` | `s` resposta | Normalmente dispositivo → PC |

Ao **enviar**, use `WireCommand.single_request`. Ao **receber** com `wait_for`, filtre `is_response=True`.

## Exemplo: pedir e imprimir

```python
@cli_command
async def cmd_battery_get(inv: WireCommand, ctx: CliHandlerContext) -> None:
    _ = inv
    await ctx.send_wire(format_message([WireCommand.single_request("battery_get", ())]))
    try:
        resp = await ctx.incoming.wait_for("battery_get", timeout=2.0)
        ctx.log(f"🔋 {' '.join(resp.arguments)}", "GREEN")
    except TimeoutError:
        ctx.log("⏱ Timeout aguardando battery_get", "YELLOW")
```

## Exemplo: responder a requisição do dispositivo

Se o firmware enviar `status(s,r);` pedindo dados ao PC:

```python
@incoming_command("status")
def _incoming_status_req(cmd: WireCommand) -> None:
    if cmd.is_response or cmd.kind != "single":
        return
    # Responder exigiria acesso ao NUS — prefira lógica async em @cli_command
    # ou enfileirar trabalho; incoming handlers são síncronos.
```

Para **responder** do Python, o padrão usual é um handler `@cli_command` que envia `WireCommand.single_response`, ou processamento async com referência ao `ctx` guardada em estado de sessão.

## Próximo passo

[Enviar listas](/TamanduCLI_Docs/cli-plugin/send-lists/) — múltiplos `list_body` com header e ACK em lote.
