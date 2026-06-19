---
title: Ler parâmetros
description: Como o handler recebe o comando e os argumentos digitados pelo usuário.
---

## Assinatura do handler

```python
async def cmd_foo(inv: WireCommand, ctx: CliHandlerContext) -> None:
    ...
```

| Parâmetro | Conteúdo |
| --------- | -------- |
| `inv` | Comando parseado a partir da linha digitada |
| `ctx` | Transporte BLE, buffer de entrada, UI — ver [Enviar wire](/TamanduCLI_Docs/cli-plugin/send-wire/) |

## Campos de `WireCommand`

```python
from api.protocol_utils import WireCommand
```

| Campo | Tipo | Significado |
| ----- | ---- | ----------- |
| `name` | `str` | Nome do comando (ex.: `param_get`) |
| `kind` | `"single"` \| `"list_header"` \| `"list_body"` | Tipo wire |
| `is_response` | `bool` | `False` = requisição (`r`), `True` = resposta (`s`) |
| `index` | `int` | Índice da linha em `list_body`; `0` em single/header |
| `arguments` | `tuple[str, ...]` | Argumentos de payload (já sem aspas wire) |

Para invocações via atalho `nome(arg1, arg2)`, os argumentos ficam em **`inv.arguments`**.

## Exemplos de leitura

### Sem argumentos

```text
help
```

```python
async def cmd_help(inv: WireCommand, ctx: CliHandlerContext) -> None:
    extra = inv.arguments  # ()
```

### Com argumentos

```text
set_speed(42)
# inv.arguments == ("42",)
```

```python
speed = inv.arguments[0] if inv.arguments else "0"
```

### Vários argumentos

```text
echo(hello, "mundo com espaço")
# inv.arguments == ("hello", "mundo com espaço")
```

### Wire completo digitado

```text
param_get(s,r,"temperature");
```

```python
# inv.name == "param_get"
# inv.kind == "single"
# inv.is_response == False
# inv.arguments == ("temperature",)
```

## Helpers de parse

Importe de `api.command_handlers` ou `api.protocol_utils`:

```python
from api.protocol_utils import unquote_field, split_top_level_commas

# Tokens individuais já vêm unquoted em inv.arguments.
# Para parsear strings customizadas:
parts = split_top_level_commas('a, "b,c", 42')
```

## `CliHandlerContext`

| Membro | Uso |
| ------ | --- |
| `ctx.nus` | Cliente Nordic UART (`send_message`) |
| `ctx.incoming` | Router FIFO de comandos recebidos |
| `ctx.prompt_line(msg)` | Pede uma linha ao usuário (async) |
| `ctx.log(msg, color)` | Log colorido no terminal |
| `ctx.send_wire(text)` | Envia mensagem wire (adiciona `;` se faltar) |

Cores comuns: `"WHITE"`, `"GREEN"`, `"YELLOW"`, `"RED"`, `"CYAN"`.

## Múltiplos comandos na mesma linha

Se o usuário digitar vários comandos registrados separados por `;`, `dispatch_cli_command` chama **cada** handler em sequência.

## Próximo passo

[Enviar wire](/TamanduCLI_Docs/cli-plugin/send-wire/) — montar e enviar mensagens ao dispositivo.
