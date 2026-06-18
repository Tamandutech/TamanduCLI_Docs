---
title: Editar mapa
description: Fluxo map_edit para baixar, editar e aplicar o mapa do robô.
---

O comando **`map_edit`** gerencia o **mapa de trajetória** do robô: pontos com tempo, encoder, status de trilha e offset.

## Executar

```text
map_edit
```

## Passo 1 — Coleta `map_get`

1. A CLI envia `map_get(s,r);`
2. Aguarda linhas de resposta `map_get(b,s,…)` via BLE
3. Após **3 segundos sem novas linhas**, encerra a coleta
4. Converte cada body em uma linha **CSV** e grava **`output/map.txt`**

## Passo 2 — Copiar para edição

```text
output/map.txt  →  input/map.txt
```

Edite **`input/map.txt`** no editor de texto.

## Formato do arquivo CSV

Cada linha representa um ponto do mapa:

```text
index,time,encMedia,trackStatus,offset
0,100,50,1,0
1,200,55,1,10
2,300,60,0,20
```

| Coluna | Significado |
| ------ | ----------- |
| `index` | Índice do ponto |
| `time` | Tempo (unidade definida pelo firmware) |
| `encMedia` | Valor médio do encoder |
| `trackStatus` | Status da trilha |
| `offset` | Deslocamento |

Todas as colunas devem ser **inteiros**. Linhas vazias são ignoradas.

## Passo 3 — Confirmar e revisar diff

Como em `param_edit`, a CLI pergunta se você terminou a edição e mostra o **diff** entre `output/map.txt` e `input/map.txt`.

## Passo 4 — Aplicar no dispositivo

Ao confirmar que as mudanças são intencionais, a CLI envia nesta ordem:

1. **`map_clear`** — limpa o mapa atual no firmware
2. **`map_add`** — uma requisição por linha do `input/map.txt` (em lotes com ACK)
3. **`map_SaveRuntime`** — persiste o mapa na memória de execução

Se algum envio falhar, o fluxo **interrompe** e avisa no terminal.

## Erros comuns

| Problema | Solução |
| -------- | ------- |
| Nenhuma linha em 3 s | Verifique conexão BLE e se o firmware responde a `map_get` |
| Linha CSV inválida | Confira 5 colunas inteiras por linha |
| Diff vazio | Nenhuma alteração em `input/map.txt` |
| Aplicação cancelada | Nada é enviado ao dispositivo |

## Exemplo de sessão

```text
📤 Enviar: map_edit
[TamanduCLI] 💾 Salvo output/map.txt e copiado para input/map.txt — edite o arquivo em input/ e salve.
Terminou a edição? Continuar para ver diferenças e aplicar? [y/N]: y
...
Essas mudanças são intencionais? Serão enviados map_clear, map_add para cada linha de input/map.txt e depois map_SaveRuntime. [y/N]: y
[TamanduCLI] 📤 map_clear
[TamanduCLI] ✅ Enviados map_clear e 12 linha(s) map_add.
[TamanduCLI] 📤 map_SaveRuntime enviado.
```

## Somente visualizar o mapa

Se quiser apenas **baixar** sem o fluxo de edição guiado, envie wire direto (quando o firmware suportar) ou use `map_edit` e cancele antes de aplicar — o arquivo em `output/map.txt` já terá sido gravado na coleta inicial.
