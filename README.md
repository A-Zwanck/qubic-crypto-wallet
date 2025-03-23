
# Qubic Wallet - Documentación Técnica

## Descripción General
Qubic Wallet es una aplicación de cartera digital que permite a los usuarios gestionar fondos, participar en proyectos DeFi y visualizar análisis de sus finanzas a través de un dashboard interactivo.

## Arquitectura Backend

### Supabase como Backend

Este proyecto utiliza [Supabase](https://supabase.com) como plataforma de backend, proporcionando:

- **Base de datos PostgreSQL**: Almacenamiento de datos estructurados
- **Autenticación y autorización**: Gestión de usuarios y sesiones
- **Row Level Security (RLS)**: Protección de datos a nivel de fila
- **API RESTful automática**: Endpoints generados automáticamente

### Estructura de la Base de Datos

El backend consta de las siguientes tablas principales:

#### Tabla `wallets`
Almacena información sobre las carteras de los usuarios.

| Campo       | Tipo     | Descripción                           |
|-------------|----------|---------------------------------------|
| id          | UUID     | Identificador único de la cartera     |
| user_id     | UUID     | ID del usuario propietario            |
| balance     | numeric  | Saldo actual de la cartera            |
| created_at  | timestamp| Fecha de creación                     |
| updated_at  | timestamp| Fecha de última actualización         |

#### Tabla `transactions`
Registra todas las transacciones realizadas en las carteras.

| Campo       | Tipo     | Descripción                           |
|-------------|----------|---------------------------------------|
| id          | UUID     | Identificador único de la transacción |
| user_id     | UUID     | ID del usuario relacionado            |
| wallet_id   | UUID     | ID de la cartera relacionada          |
| type        | text     | Tipo: 'deposit', 'withdraw'           |
| amount      | numeric  | Cantidad de la transacción            |
| status      | text     | Estado de la transacción              |
| details     | text     | Detalles adicionales (opcional)       |
| created_at  | timestamp| Fecha de la transacción               |

### Políticas de Seguridad (RLS)

Las políticas RLS garantizan que los usuarios solo puedan acceder a sus propios datos:

- Los usuarios solo pueden leer y modificar sus propias carteras
- Los usuarios solo pueden ver y crear transacciones asociadas a sus propias carteras

## Cómo Realizar Llamadas al Backend

### Configuración del Cliente

El cliente de Supabase ya está configurado en el proyecto en:

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

### Autenticación

#### Iniciar Sesión
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'contraseña'
});
```

#### Cerrar Sesión
```typescript
await supabase.auth.signOut();
```

#### Obtener Usuario Actual
```typescript
const { data: { session } } = await supabase.auth.getSession();
const currentUser = session?.user;
```

### Operaciones con Wallets

#### Obtener Wallet del Usuario
```typescript
const { data, error } = await supabase
  .from('wallets')
  .select('*')
  .limit(1)
  .maybeSingle();
```

#### Actualizar Saldo
```typescript
const { error } = await supabase
  .from('wallets')
  .update({ balance: newBalance })
  .eq('id', walletId);
```

### Operaciones con Transacciones

#### Crear una Transacción
```typescript
const { error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    wallet_id: walletId,
    type: 'deposit',
    amount: amount,
    status: 'completed'
  });
```

#### Obtener Historial de Transacciones
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('wallet_id', walletId)
  .order('created_at', { ascending: false });
```

## Servicios Disponibles

El proyecto incluye servicios pre-configurados para facilitar las operaciones comunes:

### Servicio de Wallet (`walletService.ts`)

```typescript
// Importar el servicio
import { 
  fetchUserWallet, 
  createUserWallet, 
  updateWalletBalance,
  getCurrentUserId 
} from '@/services/walletService';

// Ejemplos de uso
const { data: wallet } = await fetchUserWallet();
const { success } = await updateWalletBalance(walletId, newBalance);
```

### Servicio de Transacciones (`transactionService.ts`)

```typescript
// Importar el servicio
import { 
  createDepositTransaction,
  createWithdrawTransaction,
  createInvestmentTransaction,
  fetchUserTransactions
} from '@/services/transactionService';

// Ejemplos de uso
const { success } = await createDepositTransaction(userId, walletId, amount);
const { data: transactions } = await fetchUserTransactions(walletId);
```

## Flujo de Trabajo Recomendado

1. **Autenticación**: Asegúrate de que el usuario esté autenticado antes de acceder a datos protegidos
2. **Obtener ID de usuario**: Usa `getCurrentUserId()` para obtener el ID del usuario actual
3. **Obtener wallet**: Recupera la información de la wallet del usuario con `fetchUserWallet()`
4. **Realizar operaciones**: Ejecuta transacciones o actualizaciones según sea necesario
5. **Manejo de errores**: Siempre verifica si hay errores en las respuestas de Supabase

## Información Adicional

- **URL de la API**: https://enkmiehkaszodcdsmvao.supabase.co
- **Documentación de Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
