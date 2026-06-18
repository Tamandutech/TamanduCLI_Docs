---
title: Editar parâmetros
description: Fluxo param_list e param_edit com arquivos output/ e input/.
---

Os parâmetros do dispositivo são expostos como uma **lista wire** (`param_list`). A CLI automatiza coleta, edição em arquivo e reaplicação com `param_set`.

## Somente consultar: `param_list`

```text
param_list
```

Resultado:

- Arquivo **`output/param_list.txt`** com linhas no formato wire
- Resumo no terminal: `[índice] nome = valor`

Use quando só precisa **ver** ou **exportar** os parâmetros atuais.

## Editar e aplicar: `param_edit`

```text
param_edit
```

### Passo 1 — Coleta

Igual ao `param_list`. Se `output/param_list.txt` ficar vazio, o fluxo para com aviso.

### Passo 2 — Copiar para edição

A CLI copia automaticamente:

```text
output/param_list.txt  →  input/param_list.txt
```

Abra **`input/param_list.txt`** no seu editor de texto favorito.

### Passo 3 — Editar o arquivo

Cada linha não vazia deve ser um comando wire **`param_list` de resposta**:

```text
param_list(h,s,5,2,1,0);
param_list(b,s,1,"param_a","42","descrição");
param_list(b,s,2,"param_b","0","outro");
```

| Tipo de linha | Formato |
| ------------- | ------- |
| Header | `param_list(h,s,T,C,B,j);` — metadados da lista |
| Body | `param_list(b,s,índice,nome,valor,descrição);` — uma linha por parâmetro |

**Dica:** altere apenas os **valores** nas linhas `b` existentes, a menos que saiba o que está fazendo com headers e índices.

### Passo 4 — Confirmar edição

Volte ao terminal. A CLI pergunta:

```text
Terminou a edição? Continuar para ver diferenças e aplicar?
```

### Passo 5 — Revisar o diff

É exibido um **diff unificado** entre:

- `output/param_list.txt` (original do dispositivo)
- `input/param_list.txt` (sua versão)

Se não houver diferenças, nada é enviado.

### Passo 6 — Aplicar

Ao confirmar, a CLI envia **`param_set`** para cada linha `param_list(b,s,…)` válida do arquivo editado.

Erros comuns que impedem aplicação:

- Linhas com formato wire inválido
- Cabeçalho ausente ou índices faltando
- Arquivo editado incompleto

Corrija **`input/param_list.txt`** e execute **`param_edit`** novamente.

## Estrutura das pastas

| Arquivo | Papel |
| ------- | ----- |
| `output/param_list.txt` | Snapshot **original** lido do robô |
| `input/param_list.txt` | Versão **sua** para editar e aplicar |

Não edite `output/` — ele é sobrescrito na próxima coleta.

## Timeout

A coleta inicial espera até **3 segundos** por todas as mensagens da lista. Listas grandes podem aparecer como **parciais**; o arquivo ainda é salvo com o que chegou.

## Exemplo de sessão

```text
📤 Enviar: param_edit
[TamanduCLI] 💾 Gravado output/param_list.txt e copiado para input/param_list.txt — edite o arquivo em input/ e salve.
Terminou a edição? Continuar para ver diferenças e aplicar? [y/N]: y
[TamanduCLI] --- Diferenças (output/param_list.txt → input/param_list.txt) ---
...
Aplicar essas mudanças? Será enviado param_set para cada linha param_list(b,s,…) de input/param_list.txt. [y/N]: y
```
