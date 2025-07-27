## Getting Started

## Refs

- https://github.com/vercel/nextjs-postgres-nextauth-tailwindcss-template
- https://ui.shadcn.com/charts

## 🛠 Module Generator CLI

Este projeto fornece dois scripts auxiliares para acelerar a criação de novos módulos (páginas, modelos, APIs etc.) com base em um módulo já existente.

---

## 📦 Scripts

### 1. `cloneAndReplace.js`

Clona arquivos ou diretórios e substitui nomes no conteúdo e nos nomes dos arquivos, respeitando diferentes formatos de case (camelCase, PascalCase, snake_case, kebab-case).

### 2. `replace.js`

Realiza substituição de texto diretamente dentro dos arquivos existentes, sem clonar.

---

## 🚀 Script principal: `generate-module.sh`

Automatiza a criação completa de um novo módulo.

### ✅ Exemplo de uso:

```bash
bash generate-module.sh --from customer --to product \
  --replaces "customer:product,customers:products"
```

| Parâmetro    | Obrigatório | Descrição                                                                      |
| ------------ | ----------- | ------------------------------------------------------------------------------ |
| `--from`     | Sim         | Nome base do módulo existente (ex: `customer`)                                 |
| `--to`       | Sim         | Nome base do novo módulo que será criado (ex: `product`)                       |
| `--replaces` | Não         | Lista de substituições adicionais de texto (ex: `origem1:novo1,origem2:novo2`) |

## Atualizar pnpm

### Update to latest version

```bash
pnpm run update-pnpm
```

### Update to specific version

```bash
pnpm run update-pnpm 10.13.1
```
