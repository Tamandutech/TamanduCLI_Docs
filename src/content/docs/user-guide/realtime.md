---
title: Monitor em tempo real
description: Painel open_realtime para acompanhar variáveis do dispositivo.
---

O comando **`open_realtime`** abre uma janela **fullscreen** no terminal que atualiza variáveis periodicamente — útil para acompanhar bateria, sensores ou outros valores sem digitar comandos manualmente a cada segundo.

## Abrir o monitor

```text
open_realtime
```

## O que você vê

Painel somente leitura com linhas no formato:

```text
 Realtime monitor (read-only)
 Press q or Ctrl-C to close.

 battery            : 3.7 V
```

Cada variável registrada aparece com nome alinhado à esquerda e valor à direita.

## Comportamento

| Aspecto | Detalhe |
| ------- | ------- |
| Prompt principal | **Pausado** enquanto o painel está aberto |
| Atualização | Intervalo definido por variável (ex.: bateria a cada **1 s**) |
| Erros | Exibidos abaixo da variável que falhou |
| Fechar | Tecla **`q`** ou **`Ctrl+C`** |

## Variável padrão: bateria

A instalação padrão registra a variável **`battery`**, que:

1. Envia `battery_get(s,r);` ao dispositivo
2. Aguarda resposta single (timeout **2 s**)
3. Extrai o valor numérico e exibe com sufixo **`V`**

Se o firmware não responder a `battery_get`, a linha mostra erro ou `unknown`.

## Sem variáveis registradas

Se nenhuma variável estiver configurada, a CLI avisa:

```text
⚠ Nenhuma variável realtime registrada.
```

Nesse caso o painel não abre. Variáveis extras exigem extensão da CLI por desenvolvedores (fora do escopo deste guia de usuário).

## Quando usar

- Verificar **tensão da bateria** durante testes de campo
- Monitorar um valor enquanto o robô executa outra tarefa
- Depurar se o firmware responde a comandos periódicos

Para leitura pontual sem painel, use wire direto:

```text
battery_get(s,r);
```

A resposta aparece no log normal do console.
