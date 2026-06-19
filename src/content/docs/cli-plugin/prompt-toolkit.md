---
title: Interface (prompt_toolkit)
description: Confirmações, menus de seleção e painéis TUI com prompt_toolkit.
---

O TamanduCLI usa **[prompt_toolkit](https://python-prompt-toolkit.readthedocs.io/)** para o prompt BLE, autocompletar, syntax highlight wire e diálogos. Seu plugin pode reutilizar as mesmas bibliotecas para UX mais rica.

## O que o `main.py` já fornece

| Recurso | Onde |
| ------- | ---- |
| Prompt principal | `PromptSession` com completer de comandos |
| Lexer wire | `WireCliLexer` |
| Parênteses/aspas automáticos | `build_cli_input_key_bindings()` |
| Seleção de dispositivo BLE | `ChoiceInput` |
| Linha extra async | `ctx.prompt_line(message)` |

## `ctx.log`

Imprime no terminal com cor (via `main.Terminal.log`):

```python
ctx.log("Operação concluída", "GREEN")
ctx.log("Aviso", "YELLOW")
ctx.log("Erro", "RED")
```

## `ctx.prompt_line` — pedir texto

Async — compatível com handlers `@cli_command`:

```python
name = await ctx.prompt_line("Nome do parâmetro: ")
```

Usa a mesma sessão Prompt Toolkit do console (completer e estilo wire).

## `confirm` — sim/não

Bloqueante; execute em executor para não travar o loop async:

```python
import asyncio
from prompt_toolkit.shortcuts import confirm

loop = asyncio.get_running_loop()
ok = await loop.run_in_executor(
    None,
    lambda: confirm("Aplicar alterações?"),
)
if not ok:
    ctx.log("Cancelado.", "YELLOW")
    return
```

Padrão usado em `param_edit` e `map_edit`.

## `ChoiceInput` — menu de opções

Exemplo do `main.py` (seleção de dispositivo BLE):

```python
from prompt_toolkit.shortcuts.choice_input import ChoiceInput

choice = await ChoiceInput(
    message="Escolha o modo:",
    options=[
        ("fast", "Rápido"),
        ("safe", "Seguro"),
    ],
    default="safe",
).prompt_async()

ctx.log(f"Modo: {choice}", "CYAN")
```

`options` é lista de `(valor, rótulo_exibido)`.

## `print_formatted_text` — saída formatada

```python
from prompt_toolkit import print_formatted_text
from prompt_toolkit.formatted_text import ANSI

print_formatted_text(ANSI("\033[32mTexto verde\033[0m"))
```

## Painel fullscreen — `Application`

Para UI persistente (como `open_realtime`), monte um `Application`:

```python
from prompt_toolkit.application import Application
from prompt_toolkit.key_binding import KeyBindings
from prompt_toolkit.layout import Layout, Window
from prompt_toolkit.layout.controls import FormattedTextControl

control = FormattedTextControl(text=lambda: [("", "Conteúdo\n")])
kb = KeyBindings()

@kb.add("q")
def _quit(event) -> None:
    event.app.exit()

app = Application(
    layout=Layout(Window(content=control)),
    key_bindings=kb,
    full_screen=True,
)
await app.run_async()
```

Enquanto `run_async()` estiver ativo, evite usar o prompt principal em paralelo.

## Executar UI bloqueante no executor

Funções síncronas do prompt_toolkit (`confirm`, alguns diálogos) **não** devem ser chamadas diretamente dentro de coroutines BLE — use `run_in_executor`, como nos handlers de edição.

## Dependência

Já incluída no `pyproject.toml` do TamanduCLI:

```text
prompt-toolkit>=3.0.52
```

## Referências no código

| Arquivo | Uso de prompt_toolkit |
| ------- | --------------------- |
| `src/main.py` | `PromptSession`, `ChoiceInput`, `patch_stdout` |
| `src/api/cli_prompt_lexer.py` | Destaque syntax wire |
| `src/api/cli_prompt_bindings.py` | Atalhos `(` `)` `"` |
| `src/commands/realtime_handlers.py` | Painel `Application` fullscreen |
| `src/commands/param_list_edit_handlers.py` | `confirm` |
| `src/commands/map_edit_handlers.py` | `confirm` |

## Documentação relacionada

- [Guia do usuário — Console](/TamanduCLI_Docs/user-guide/console/) — visão do operador
- [Receber listas](/TamanduCLI_Docs/cli-plugin/receive-lists/) — fluxos com confirmação após edição de arquivo
