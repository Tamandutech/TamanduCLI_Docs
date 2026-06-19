---
title: Enviar wire
description: Monte requisições e respostas wire e envie via Bluetooth com ctx.send_wire.
---

## `ctx.send_wire`

Método preferido nos handlers — garante `;` no final e usa o NUS conectado:

```python
ok = await ctx.send_wire("help(s,r);")
if not ok:
    ctx.log("⚠ Falha ao enviar", "RED")
```

## Montar mensagens com `WireCommand`

```python
from api.protocol_utils import WireCommand, format_message

# Single request
wire = format_message([WireCommand.single_request("battery_get", ())])
await ctx.send_wire(wire)

# Single request com argumentos
wire = format_message([WireCommand.single_request("param_get", ("temperature",))])
await ctx.send_wire(wire)

# Single response (se você estiver emulando o host)
wire = format_message([WireCommand.single_response("param_get", ("42",))])
```

`format_message` junta vários comandos com `;`:

```python
cmds = [
    WireCommand.single_request("map_clear", ()),
    WireCommand.single_request("map_SaveRuntime", ()),
]
await ctx.send_wire(format_message(cmds))
```

## Formato manual (string)

Válido se você já tiver a string pronta:

```python
await ctx.send_wire('param_get(s,r,"meu_param");')
```

## `format_wire_command` — um comando só

```python
from api.protocol_utils import format_wire_command

cmd = WireCommand.single_request("set_speed", ("100",))
segment = format_wire_command(cmd)  # sem ; final
await ctx.send_wire(segment + ";")
```

## List body individual

```python
body = WireCommand(
    "map_add",
    "list_body",
    is_response=False,
    index=0,
    arguments=("100", "50", "1", "0", "10"),
)
await ctx.send_wire(format_wire_command(body) + ";")
```

Para empacotar muitos bodies com header, veja [Enviar listas](/TamanduCLI_Docs/cli-plugin/send-lists/).

## Envio direto pelo NUS

```python
await ctx.nus.send_message("texto bruto sem protocolo")
```

Use apenas quando o firmware não espera wire formatado.

## Constantes úteis

```python
from api.protocol_utils import DEFAULT_WIRE_MESSAGE_MAX_BYTES  # padrão 256
```

Respeite o limite ao montar mensagens longas; listas grandes devem ser fatiadas.

## Exemplo completo

```python
from api.command_handlers import CliHandlerContext, WireCommand, cli_command
from api.protocol_utils import format_message


@cli_command
async def cmd_param_get(inv: WireCommand, ctx: CliHandlerContext) -> None:
    name = inv.arguments[0] if inv.arguments else "unknown"
    wire = format_message([WireCommand.single_request("param_get", (name,))])
    if not await ctx.send_wire(wire):
        return
    try:
        resp = await ctx.incoming.wait_for(
            "param_get",
            timeout=3.0,
            predicate=lambda c: c.kind == "single",
        )
        value = " ".join(resp.arguments)
        ctx.log(f"📥 {name} = {value}", "GREEN")
    except TimeoutError:
        ctx.log("⏱ Sem resposta de param_get", "YELLOW")
```

## Próximo passo

[Receber single](/TamanduCLI_Docs/cli-plugin/incoming-single/) — aguardar respostas e reagir a mensagens do dispositivo.
