---
title: Arquivos
description: Leia e grave arquivos locais com output_paths e pathlib.
---

Plugins que coletam listas ou guiam edição offline usam pastas na **raiz do repositório TamanduCLI**.

## Caminhos padrão

```python
from api.output_paths import OUTPUT_DIR, INPUT_DIR, ensure_output_dir, ensure_input_dir
```

| Constante | Caminho | Uso |
| --------- | ------- | --- |
| `OUTPUT_DIR` | `output/` | Snapshot **original** do dispositivo |
| `INPUT_DIR` | `input/` | Cópia para **edição** pelo usuário |

`_APP_ROOT` é a raiz do repo (pai de `src/`).

## Criar pastas

```python
ensure_output_dir()
ensure_input_dir()
```

Equivalente a `mkdir(parents=True, exist_ok=True)`.

## Gravar com sessão de lista

```python
from api.list_wire import ListWireCollectionSession

session = ListWireCollectionSession("param_list", record_raw_wire_lines=True)
# ... coletar ...
session.write_file_if_non_empty(OUTPUT_DIR / "param_list.txt")
```

Retorna `False` se não houver conteúdo.

## Padrão output → input (edição guiada)

Usado por `param_edit` e `map_edit`:

```python
import shutil
from api.output_paths import OUTPUT_DIR, INPUT_DIR

out_path = OUTPUT_DIR / "param_list.txt"
in_path = INPUT_DIR / "param_list.txt"

ensure_output_dir()
ensure_input_dir()
shutil.copy2(out_path, in_path)
ctx.log(f"Edite {in_path} e salve.", "GREEN")
```

Depois da edição, leia de `INPUT_DIR` e compare com `OUTPUT_DIR` (ex.: `difflib.unified_diff`).

## Leitura e escrita direta

```python
text = (OUTPUT_DIR / "map.txt").read_text(encoding="utf-8")
(INPUT_DIR / "map.txt").write_text(edited, encoding="utf-8")
```

Use sempre **`encoding="utf-8"`**.

## Caminhos customizados

Para arquivos fora de `output/`/`input/`, use `pathlib.Path` normalmente — a API não impede outros diretórios:

```python
from pathlib import Path

log_path = Path(__file__).resolve().parent / "my_plugin.log"
log_path.write_text("evento\n", encoding="utf-8")
```

Prefira `OUTPUT_DIR` / `INPUT_DIR` para artefatos compartilhados com fluxos existentes da CLI.

## Exemplo: exportar CSV após coleta

```python
@cli_command
async def cmd_export_map_csv(inv: WireCommand, ctx: CliHandlerContext) -> None:
    _ = inv
    # ... coletar map_get em session ...
    csv_path = OUTPUT_DIR / "map.csv"
    ensure_output_dir()
    csv_path.write_text(session.data or "", encoding="utf-8")
    ctx.log(f"💾 {csv_path}", "GREEN")
```

## Próximo passo

[Interface (prompt_toolkit)](/TamanduCLI_Docs/cli-plugin/prompt-toolkit/) — confirmações, menus e painéis.
