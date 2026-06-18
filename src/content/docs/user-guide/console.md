---
title: Console
description: Prompt de entrada, atalhos, autocompletar, cores e envio de texto bruto.
---

## O prompt

Cada linha que você digita aparece após:

```text
📤 Enviar:
```

Pressione **Enter** para enviar. Linhas vazias são ignoradas.

## Formas de digitar comandos

A CLI aceita **três** estilos de entrada:

### 1. Atalho (recomendado para comandos integrados)

Para comandos **já registrados** na CLI, basta o nome — com ou sem parênteses:

```text
help
help()
param_list
open_realtime
```

Isso é expandido automaticamente para o formato wire `nome(s,r,...);` antes do envio.

Com argumentos:

```text
echo(olá, mundo)
```

### 2. Protocolo wire completo

Para falar diretamente com o firmware no formato oficial:

```text
help(s,r);
param_get(s,r,"temperature");
battery_get(s,r);
```

Veja [Protocolo wire](/TamanduCLI_Docs/user-guide/wire-protocol/) para detalhes do formato.

### 3. Texto bruto (avançado)

Se a linha **não** for reconhecida como comando registrado nem como wire válido, a CLI pergunta:

```text
Entrada desconhecida ou não tratada. Enviar esta linha como texto bruto ao dispositivo?
```

Confirme apenas se souber que o firmware aceita aquela string exata.

## Autocompletar

O prompt oferece **Tab** com os nomes dos comandos registrados (case-insensitive). Útil para descobrir `help`, `param_list`, `map_edit`, etc.

## Atalhos de teclado no prompt

| Tecla | Ação |
| ----- | ---- |
| `(` | Insere `()` e posiciona o cursor entre os parênteses |
| `)` | Pula um `)` existente ou insere um novo |
| `"` | Insere aspas em par ou pula aspas de fechamento |

## Saída no terminal

Mensagens da CLI usam o prefixo **`[TamanduCLI]`** e **cores** para facilitar a leitura:

| Cor | Uso típico |
| --- | ---------- |
| Verde | Sucesso, conexão, confirmações |
| Amarelo | Avisos, timeouts parciais |
| Vermelho | Erros, falhas de envio |
| Ciano | Informações de coleta (listas, mapas) |

Respostas **espontâneas** do dispositivo também aparecem no terminal conforme chegam via BLE.

## Encerrar a sessão

```text
quit
exit
close
```

Ou **`Ctrl+C`** no prompt.

## Próximo passo

Consulte a [referência de comandos](/TamanduCLI_Docs/user-guide/commands/) para saber o que cada comando faz.
