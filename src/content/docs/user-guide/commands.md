---
title: Comandos
description: Referência dos comandos integrados do TamanduCLI para usuários finais.
---

Comandos **integrados** são digitados no prompt e tratados pela CLI antes (ou em vez) de enviar wire cru ao dispositivo.

## Resumo

| Comando | Descrição |
| ------- | --------- |
| `help` | Lista comandos suportados pelo firmware |
| `param_list` | Baixa a lista de parâmetros para `output/param_list.txt` |
| `param_edit` | Igual a `param_list`, depois guia edição e aplicação via `param_set` |
| `map_edit` | Baixa o mapa, guia edição em CSV e aplica no dispositivo |
| `open_realtime` | Abre painel somente leitura com variáveis em tempo real |
| `echo` | Exibe argumentos no terminal (teste local da CLI) |
| `ping` | Responde `pong` no terminal (teste local da CLI) |

Para listar a versão exata instalada:

```bash
uv run scripts/list_registered_commands.py
```

---

## `help`

Solicita ao firmware a lista de comandos disponíveis.

```text
help
```

**O que acontece:**

1. A CLI envia `help(s,r);` ao dispositivo
2. Coleta respostas em formato de **lista wire** (header + bodies)
3. Mostra um resumo numerado no terminal
4. Salva o resultado em **`output/help_response.txt`** (quando houver dados)

Se a coleta passar de **3 segundos**, resultados **parciais** ainda são exibidos.

---

## `param_list`

Baixa todos os parâmetros configuráveis do dispositivo.

```text
param_list
```

**O que acontece:**

1. Envia `param_list(s,r);`
2. Coleta a resposta em lista wire
3. Grava **`output/param_list.txt`** com as linhas wire recebidas
4. Exibe resumo no terminal (`nome = valor` por linha)

Timeout de coleta: **3 segundos** (parcial se exceder).

Para editar parâmetros, use **`param_edit`** em vez de editar o arquivo manualmente após `param_list`.

---

## `param_edit`

Fluxo completo: **baixar → editar → diff → aplicar**.

```text
param_edit
```

Resumo das etapas:

1. Executa a mesma coleta que `param_list`
2. Copia `output/param_list.txt` → **`input/param_list.txt`**
3. Pede confirmação para você **editar o arquivo em `input/`** no editor de texto
4. Mostra **diff** entre `output/` e `input/`
5. Com sua confirmação, envia **`param_set`** para cada linha alterada
6. Opcionalmente verifica a lista novamente

Detalhes em [Editar parâmetros](/TamanduCLI_Docs/user-guide/edit-parameters/).

---

## `map_edit`

Fluxo para o **mapa** do robô (trajetória / faixas em CSV).

```text
map_edit
```

Resumo das etapas:

1. Envia `map_get(s,r);` e coleta linhas `map_get(b,s,…)`
2. Salva CSV em **`output/map.txt`** e copia para **`input/map.txt`**
3. Você edita **`input/map.txt`** (colunas: `index,time,encMedia,trackStatus,offset`)
4. Diff e confirmação
5. Envia `map_clear`, depois `map_add` por linha, depois `map_SaveRuntime`

Detalhes em [Editar mapa](/TamanduCLI_Docs/user-guide/edit-map/).

---

## `open_realtime`

Abre um painel **fullscreen somente leitura** no terminal.

```text
open_realtime
```

Enquanto o painel está aberto:

- O prompt normal **fica pausado**
- Variáveis registradas são atualizadas periodicamente (ex.: **bateria** a cada 1 s)
- Pressione **`q`** ou **`Ctrl+C`** para fechar

Detalhes em [Monitor em tempo real](/TamanduCLI_Docs/user-guide/realtime/).

---

## `echo` e `ping`

Comandos de **teste local** — não enviam wire ao dispositivo por padrão:

```text
echo(teste, 123)
ping
```

- **`echo`**: imprime os argumentos no terminal
- **`ping`**: imprime `pong`

Úteis para verificar se a CLI está interpretando o prompt corretamente.

---

## Comandos do firmware (wire direto)

Para funções expostas pelo firmware mas **sem** atalho na CLI, use o formato wire completo:

```text
battery_get(s,r);
param_get(s,r,"nome_do_parametro");
set_speed(s,r,42);
```

O firmware precisa implementar cada comando. Use `help` para descobrir os nomes suportados no seu dispositivo.
