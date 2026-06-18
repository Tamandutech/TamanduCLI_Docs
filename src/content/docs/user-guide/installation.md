---
title: Instalação
description: Pré-requisitos e como executar o TamanduCLI pela primeira vez.
---

## Pré-requisitos

1. **Python 3.12+** (gerenciado pelo [uv](https://github.com/astral-sh/uv))
2. **Bluetooth** habilitado no computador
3. Um **dispositivo compatível** com Nordic UART Service e nome começando por **`TT`** (padrão da varredura)

### Instalar o uv

```bash
# macOS e Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Ou via pip
pip install uv
```

### Clonar o repositório

```bash
git clone https://github.com/Tamandutech/TamanduCLI.git
cd TamanduCLI
```

As dependências Python (Bleak, Prompt Toolkit, etc.) são resolvidas automaticamente pelo `uv` na primeira execução.

## Executar a CLI

Na raiz do repositório TamanduCLI:

```bash
uv run src/main.py
```

Você verá a mensagem de inicialização e a varredura BLE começará automaticamente.

## Verificar comandos disponíveis (sem BLE)

Para listar os comandos registrados sem conectar a um dispositivo:

```bash
uv run scripts/list_registered_commands.py
```

## Teste rápido do cliente BLE

```bash
uv run src/test_nus.py
```

Útil para validar Bluetooth e NUS antes de usar o console completo.

## Próximo passo

Após iniciar a CLI, siga [Conexão BLE](/TamanduCLI_Docs/user-guide/connecting/) para escolher o dispositivo e abrir o prompt de comandos.
