---
title: Conexão BLE
description: Varredura, seleção de dispositivo e comportamento da conexão Bluetooth.
---

## Varredura automática

Ao iniciar `uv run src/main.py`, a CLI busca dispositivos BLE cujo **nome começa com `TT`**.

- Se **nenhum** dispositivo for encontrado, a varredura **repete a cada 1 segundo** até aparecer um.
- Quando um ou mais dispositivos forem listados, você passa à etapa de seleção.

## Selecionar o dispositivo

| Situação | Comportamento |
| -------- | ------------- |
| **Um** dispositivo encontrado | Conexão automática, sem menu |
| **Vários** dispositivos | Menu interativo com nome e endereço MAC |
| Cancelar (`Ctrl+C` no menu) | A CLI encerra sem conectar |

## Após conectar

O terminal exibe:

```text
🚀 Console BLE do robô pronto!
💡 Protocolo wire: name(s,r); name(h,r,size); name(b,r,idx,args…);
  • Atalho: nomes de comandos registrados viram name(s,r);
  • quit / exit / close — desconectar
```

A partir daí o prompt **`📤 Enviar:`** fica disponível para digitar comandos.

## Desconexão

A conexão termina quando você:

- Digita **`quit`**, **`exit`** ou **`close`**
- Pressiona **`Ctrl+C`** no prompt
- O dispositivo **desconecta** sozinho (a CLI avisa e encerra o loop)

Em todos os casos a CLI tenta **desconectar** de forma limpa ao sair.

## Dicas de conexão

- Mantenha o robô **ligado** e dentro do alcance BLE.
- Feche outros apps que possam estar usando o mesmo dispositivo BLE.
- Se a conexão falhar na primeira tentativa, reinicie a CLI e verifique se o nome do dispositivo usa o prefixo **`TT`** (ou ajuste o firmware/nome conforme o projeto).

## Próximo passo

Com o console aberto, leia [Console](/TamanduCLI_Docs/user-guide/console/) para saber como digitar comandos e interpretar o prompt.
