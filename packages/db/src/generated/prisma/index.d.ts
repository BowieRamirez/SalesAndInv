
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ProductColorVariant
 * 
 */
export type ProductColorVariant = $Result.DefaultSelection<Prisma.$ProductColorVariantPayload>
/**
 * Model Warehouse
 * 
 */
export type Warehouse = $Result.DefaultSelection<Prisma.$WarehousePayload>
/**
 * Model StockItem
 * 
 */
export type StockItem = $Result.DefaultSelection<Prisma.$StockItemPayload>
/**
 * Model StockMovement
 * 
 */
export type StockMovement = $Result.DefaultSelection<Prisma.$StockMovementPayload>
/**
 * Model StockTransfer
 * 
 */
export type StockTransfer = $Result.DefaultSelection<Prisma.$StockTransferPayload>
/**
 * Model Lead
 * 
 */
export type Lead = $Result.DefaultSelection<Prisma.$LeadPayload>
/**
 * Model Quotation
 * 
 */
export type Quotation = $Result.DefaultSelection<Prisma.$QuotationPayload>
/**
 * Model QuotationLineItem
 * 
 */
export type QuotationLineItem = $Result.DefaultSelection<Prisma.$QuotationLineItemPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  MANAGEMENT: 'MANAGEMENT',
  SALES: 'SALES',
  ACCOUNTING: 'ACCOUNTING',
  INVENTORY: 'INVENTORY',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const StockStatus: {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
};

export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus]


export const ProductBadge: {
  BEST_SELLER: 'BEST_SELLER',
  SALE: 'SALE',
  HOT: 'HOT'
};

export type ProductBadge = (typeof ProductBadge)[keyof typeof ProductBadge]


export const OrderStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]


export const QuotationStatus: {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  IN_REVIEW: 'IN_REVIEW',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED'
};

export type QuotationStatus = (typeof QuotationStatus)[keyof typeof QuotationStatus]


export const CrmStage: {
  NEW: 'NEW',
  QUOTED: 'QUOTED',
  NEGOTIATING: 'NEGOTIATING',
  CONFIRMED: 'CONFIRMED',
  CLOSED: 'CLOSED'
};

export type CrmStage = (typeof CrmStage)[keyof typeof CrmStage]


export const PaymentType: {
  DOWN_PAYMENT: 'DOWN_PAYMENT',
  PARTIAL: 'PARTIAL',
  FULL: 'FULL'
};

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType]


export const PaymentStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const StockState: {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  DELIVERED: 'DELIVERED'
};

export type StockState = (typeof StockState)[keyof typeof StockState]


export const StockMovementType: {
  IN: 'IN',
  OUT: 'OUT',
  TRANSFER: 'TRANSFER',
  ADJUSTMENT: 'ADJUSTMENT',
  DAMAGED: 'DAMAGED'
};

export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type StockStatus = $Enums.StockStatus

export const StockStatus: typeof $Enums.StockStatus

export type ProductBadge = $Enums.ProductBadge

export const ProductBadge: typeof $Enums.ProductBadge

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

export type QuotationStatus = $Enums.QuotationStatus

export const QuotationStatus: typeof $Enums.QuotationStatus

export type CrmStage = $Enums.CrmStage

export const CrmStage: typeof $Enums.CrmStage

export type PaymentType = $Enums.PaymentType

export const PaymentType: typeof $Enums.PaymentType

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type StockState = $Enums.StockState

export const StockState: typeof $Enums.StockState

export type StockMovementType = $Enums.StockMovementType

export const StockMovementType: typeof $Enums.StockMovementType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productColorVariant`: Exposes CRUD operations for the **ProductColorVariant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductColorVariants
    * const productColorVariants = await prisma.productColorVariant.findMany()
    * ```
    */
  get productColorVariant(): Prisma.ProductColorVariantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.warehouse`: Exposes CRUD operations for the **Warehouse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Warehouses
    * const warehouses = await prisma.warehouse.findMany()
    * ```
    */
  get warehouse(): Prisma.WarehouseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockItem`: Exposes CRUD operations for the **StockItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockItems
    * const stockItems = await prisma.stockItem.findMany()
    * ```
    */
  get stockItem(): Prisma.StockItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockMovement`: Exposes CRUD operations for the **StockMovement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockMovements
    * const stockMovements = await prisma.stockMovement.findMany()
    * ```
    */
  get stockMovement(): Prisma.StockMovementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockTransfer`: Exposes CRUD operations for the **StockTransfer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockTransfers
    * const stockTransfers = await prisma.stockTransfer.findMany()
    * ```
    */
  get stockTransfer(): Prisma.StockTransferDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lead`: Exposes CRUD operations for the **Lead** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leads
    * const leads = await prisma.lead.findMany()
    * ```
    */
  get lead(): Prisma.LeadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quotation`: Exposes CRUD operations for the **Quotation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quotations
    * const quotations = await prisma.quotation.findMany()
    * ```
    */
  get quotation(): Prisma.QuotationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quotationLineItem`: Exposes CRUD operations for the **QuotationLineItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuotationLineItems
    * const quotationLineItems = await prisma.quotationLineItem.findMany()
    * ```
    */
  get quotationLineItem(): Prisma.QuotationLineItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Product: 'Product',
    ProductColorVariant: 'ProductColorVariant',
    Warehouse: 'Warehouse',
    StockItem: 'StockItem',
    StockMovement: 'StockMovement',
    StockTransfer: 'StockTransfer',
    Lead: 'Lead',
    Quotation: 'Quotation',
    QuotationLineItem: 'QuotationLineItem',
    Order: 'Order',
    Payment: 'Payment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "product" | "productColorVariant" | "warehouse" | "stockItem" | "stockMovement" | "stockTransfer" | "lead" | "quotation" | "quotationLineItem" | "order" | "payment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ProductColorVariant: {
        payload: Prisma.$ProductColorVariantPayload<ExtArgs>
        fields: Prisma.ProductColorVariantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductColorVariantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductColorVariantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>
          }
          findFirst: {
            args: Prisma.ProductColorVariantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductColorVariantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>
          }
          findMany: {
            args: Prisma.ProductColorVariantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>[]
          }
          create: {
            args: Prisma.ProductColorVariantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>
          }
          createMany: {
            args: Prisma.ProductColorVariantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductColorVariantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>[]
          }
          delete: {
            args: Prisma.ProductColorVariantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>
          }
          update: {
            args: Prisma.ProductColorVariantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>
          }
          deleteMany: {
            args: Prisma.ProductColorVariantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductColorVariantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductColorVariantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>[]
          }
          upsert: {
            args: Prisma.ProductColorVariantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductColorVariantPayload>
          }
          aggregate: {
            args: Prisma.ProductColorVariantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductColorVariant>
          }
          groupBy: {
            args: Prisma.ProductColorVariantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductColorVariantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductColorVariantCountArgs<ExtArgs>
            result: $Utils.Optional<ProductColorVariantCountAggregateOutputType> | number
          }
        }
      }
      Warehouse: {
        payload: Prisma.$WarehousePayload<ExtArgs>
        fields: Prisma.WarehouseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WarehouseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WarehouseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          findFirst: {
            args: Prisma.WarehouseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WarehouseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          findMany: {
            args: Prisma.WarehouseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>[]
          }
          create: {
            args: Prisma.WarehouseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          createMany: {
            args: Prisma.WarehouseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WarehouseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>[]
          }
          delete: {
            args: Prisma.WarehouseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          update: {
            args: Prisma.WarehouseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          deleteMany: {
            args: Prisma.WarehouseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WarehouseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WarehouseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>[]
          }
          upsert: {
            args: Prisma.WarehouseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          aggregate: {
            args: Prisma.WarehouseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWarehouse>
          }
          groupBy: {
            args: Prisma.WarehouseGroupByArgs<ExtArgs>
            result: $Utils.Optional<WarehouseGroupByOutputType>[]
          }
          count: {
            args: Prisma.WarehouseCountArgs<ExtArgs>
            result: $Utils.Optional<WarehouseCountAggregateOutputType> | number
          }
        }
      }
      StockItem: {
        payload: Prisma.$StockItemPayload<ExtArgs>
        fields: Prisma.StockItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>
          }
          findFirst: {
            args: Prisma.StockItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>
          }
          findMany: {
            args: Prisma.StockItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>[]
          }
          create: {
            args: Prisma.StockItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>
          }
          createMany: {
            args: Prisma.StockItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>[]
          }
          delete: {
            args: Prisma.StockItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>
          }
          update: {
            args: Prisma.StockItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>
          }
          deleteMany: {
            args: Prisma.StockItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StockItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>[]
          }
          upsert: {
            args: Prisma.StockItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockItemPayload>
          }
          aggregate: {
            args: Prisma.StockItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockItem>
          }
          groupBy: {
            args: Prisma.StockItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockItemCountArgs<ExtArgs>
            result: $Utils.Optional<StockItemCountAggregateOutputType> | number
          }
        }
      }
      StockMovement: {
        payload: Prisma.$StockMovementPayload<ExtArgs>
        fields: Prisma.StockMovementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockMovementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockMovementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findFirst: {
            args: Prisma.StockMovementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockMovementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findMany: {
            args: Prisma.StockMovementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          create: {
            args: Prisma.StockMovementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          createMany: {
            args: Prisma.StockMovementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockMovementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          delete: {
            args: Prisma.StockMovementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          update: {
            args: Prisma.StockMovementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          deleteMany: {
            args: Prisma.StockMovementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockMovementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StockMovementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          upsert: {
            args: Prisma.StockMovementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          aggregate: {
            args: Prisma.StockMovementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockMovement>
          }
          groupBy: {
            args: Prisma.StockMovementGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockMovementGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockMovementCountArgs<ExtArgs>
            result: $Utils.Optional<StockMovementCountAggregateOutputType> | number
          }
        }
      }
      StockTransfer: {
        payload: Prisma.$StockTransferPayload<ExtArgs>
        fields: Prisma.StockTransferFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockTransferFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockTransferFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>
          }
          findFirst: {
            args: Prisma.StockTransferFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockTransferFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>
          }
          findMany: {
            args: Prisma.StockTransferFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>[]
          }
          create: {
            args: Prisma.StockTransferCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>
          }
          createMany: {
            args: Prisma.StockTransferCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockTransferCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>[]
          }
          delete: {
            args: Prisma.StockTransferDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>
          }
          update: {
            args: Prisma.StockTransferUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>
          }
          deleteMany: {
            args: Prisma.StockTransferDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockTransferUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StockTransferUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>[]
          }
          upsert: {
            args: Prisma.StockTransferUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockTransferPayload>
          }
          aggregate: {
            args: Prisma.StockTransferAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockTransfer>
          }
          groupBy: {
            args: Prisma.StockTransferGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockTransferGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockTransferCountArgs<ExtArgs>
            result: $Utils.Optional<StockTransferCountAggregateOutputType> | number
          }
        }
      }
      Lead: {
        payload: Prisma.$LeadPayload<ExtArgs>
        fields: Prisma.LeadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findFirst: {
            args: Prisma.LeadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findMany: {
            args: Prisma.LeadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          create: {
            args: Prisma.LeadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          createMany: {
            args: Prisma.LeadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          delete: {
            args: Prisma.LeadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          update: {
            args: Prisma.LeadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          deleteMany: {
            args: Prisma.LeadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          upsert: {
            args: Prisma.LeadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          aggregate: {
            args: Prisma.LeadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLead>
          }
          groupBy: {
            args: Prisma.LeadGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeadGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeadCountArgs<ExtArgs>
            result: $Utils.Optional<LeadCountAggregateOutputType> | number
          }
        }
      }
      Quotation: {
        payload: Prisma.$QuotationPayload<ExtArgs>
        fields: Prisma.QuotationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuotationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuotationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          findFirst: {
            args: Prisma.QuotationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuotationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          findMany: {
            args: Prisma.QuotationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>[]
          }
          create: {
            args: Prisma.QuotationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          createMany: {
            args: Prisma.QuotationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuotationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>[]
          }
          delete: {
            args: Prisma.QuotationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          update: {
            args: Prisma.QuotationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          deleteMany: {
            args: Prisma.QuotationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuotationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuotationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>[]
          }
          upsert: {
            args: Prisma.QuotationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          aggregate: {
            args: Prisma.QuotationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuotation>
          }
          groupBy: {
            args: Prisma.QuotationGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuotationGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuotationCountArgs<ExtArgs>
            result: $Utils.Optional<QuotationCountAggregateOutputType> | number
          }
        }
      }
      QuotationLineItem: {
        payload: Prisma.$QuotationLineItemPayload<ExtArgs>
        fields: Prisma.QuotationLineItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuotationLineItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuotationLineItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          findFirst: {
            args: Prisma.QuotationLineItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuotationLineItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          findMany: {
            args: Prisma.QuotationLineItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>[]
          }
          create: {
            args: Prisma.QuotationLineItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          createMany: {
            args: Prisma.QuotationLineItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuotationLineItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>[]
          }
          delete: {
            args: Prisma.QuotationLineItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          update: {
            args: Prisma.QuotationLineItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          deleteMany: {
            args: Prisma.QuotationLineItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuotationLineItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuotationLineItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>[]
          }
          upsert: {
            args: Prisma.QuotationLineItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          aggregate: {
            args: Prisma.QuotationLineItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuotationLineItem>
          }
          groupBy: {
            args: Prisma.QuotationLineItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuotationLineItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuotationLineItemCountArgs<ExtArgs>
            result: $Utils.Optional<QuotationLineItemCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    product?: ProductOmit
    productColorVariant?: ProductColorVariantOmit
    warehouse?: WarehouseOmit
    stockItem?: StockItemOmit
    stockMovement?: StockMovementOmit
    stockTransfer?: StockTransferOmit
    lead?: LeadOmit
    quotation?: QuotationOmit
    quotationLineItem?: QuotationLineItemOmit
    order?: OrderOmit
    payment?: PaymentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    colorVariants: number
    stockItems: number
    quotationItems: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    colorVariants?: boolean | ProductCountOutputTypeCountColorVariantsArgs
    stockItems?: boolean | ProductCountOutputTypeCountStockItemsArgs
    quotationItems?: boolean | ProductCountOutputTypeCountQuotationItemsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountColorVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductColorVariantWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountStockItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountQuotationItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationLineItemWhereInput
  }


  /**
   * Count Type WarehouseCountOutputType
   */

  export type WarehouseCountOutputType = {
    stockItems: number
    transfersFrom: number
    transfersTo: number
  }

  export type WarehouseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stockItems?: boolean | WarehouseCountOutputTypeCountStockItemsArgs
    transfersFrom?: boolean | WarehouseCountOutputTypeCountTransfersFromArgs
    transfersTo?: boolean | WarehouseCountOutputTypeCountTransfersToArgs
  }

  // Custom InputTypes
  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WarehouseCountOutputType
     */
    select?: WarehouseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeCountStockItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockItemWhereInput
  }

  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeCountTransfersFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockTransferWhereInput
  }

  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeCountTransfersToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockTransferWhereInput
  }


  /**
   * Count Type StockItemCountOutputType
   */

  export type StockItemCountOutputType = {
    movements: number
  }

  export type StockItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movements?: boolean | StockItemCountOutputTypeCountMovementsArgs
  }

  // Custom InputTypes
  /**
   * StockItemCountOutputType without action
   */
  export type StockItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItemCountOutputType
     */
    select?: StockItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StockItemCountOutputType without action
   */
  export type StockItemCountOutputTypeCountMovementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
  }


  /**
   * Count Type LeadCountOutputType
   */

  export type LeadCountOutputType = {
    quotations: number
  }

  export type LeadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotations?: boolean | LeadCountOutputTypeCountQuotationsArgs
  }

  // Custom InputTypes
  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadCountOutputType
     */
    select?: LeadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountQuotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationWhereInput
  }


  /**
   * Count Type QuotationCountOutputType
   */

  export type QuotationCountOutputType = {
    lineItems: number
  }

  export type QuotationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | QuotationCountOutputTypeCountLineItemsArgs
  }

  // Custom InputTypes
  /**
   * QuotationCountOutputType without action
   */
  export type QuotationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationCountOutputType
     */
    select?: QuotationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuotationCountOutputType without action
   */
  export type QuotationCountOutputTypeCountLineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationLineItemWhereInput
  }


  /**
   * Count Type OrderCountOutputType
   */

  export type OrderCountOutputType = {
    payments: number
  }

  export type OrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | OrderCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: OrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    role: $Enums.Role | null
    branchId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    role: $Enums.Role | null
    branchId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    role: number
    branchId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    branchId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    branchId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    branchId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    role: $Enums.Role
    branchId: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    branchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    branchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    branchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    branchId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "role" | "branchId" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      role: $Enums.Role
      branchId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly branchId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    price: Decimal | null
    originalPrice: Decimal | null
    rating: Decimal | null
    reviewCount: number | null
    widthCm: Decimal | null
    depthCm: Decimal | null
    heightCm: Decimal | null
    weightKg: Decimal | null
  }

  export type ProductSumAggregateOutputType = {
    price: Decimal | null
    originalPrice: Decimal | null
    rating: Decimal | null
    reviewCount: number | null
    widthCm: Decimal | null
    depthCm: Decimal | null
    heightCm: Decimal | null
    weightKg: Decimal | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    material: string | null
    price: Decimal | null
    originalPrice: Decimal | null
    badge: $Enums.ProductBadge | null
    stockStatus: $Enums.StockStatus | null
    description: string | null
    rating: Decimal | null
    reviewCount: number | null
    widthCm: Decimal | null
    depthCm: Decimal | null
    heightCm: Decimal | null
    weightKg: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    material: string | null
    price: Decimal | null
    originalPrice: Decimal | null
    badge: $Enums.ProductBadge | null
    stockStatus: $Enums.StockStatus | null
    description: string | null
    rating: Decimal | null
    reviewCount: number | null
    widthCm: Decimal | null
    depthCm: Decimal | null
    heightCm: Decimal | null
    weightKg: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    category: number
    material: number
    price: number
    originalPrice: number
    badge: number
    stockStatus: number
    description: number
    images: number
    rating: number
    reviewCount: number
    widthCm: number
    depthCm: number
    heightCm: number
    weightKg: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    price?: true
    originalPrice?: true
    rating?: true
    reviewCount?: true
    widthCm?: true
    depthCm?: true
    heightCm?: true
    weightKg?: true
  }

  export type ProductSumAggregateInputType = {
    price?: true
    originalPrice?: true
    rating?: true
    reviewCount?: true
    widthCm?: true
    depthCm?: true
    heightCm?: true
    weightKg?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    material?: true
    price?: true
    originalPrice?: true
    badge?: true
    stockStatus?: true
    description?: true
    rating?: true
    reviewCount?: true
    widthCm?: true
    depthCm?: true
    heightCm?: true
    weightKg?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    material?: true
    price?: true
    originalPrice?: true
    badge?: true
    stockStatus?: true
    description?: true
    rating?: true
    reviewCount?: true
    widthCm?: true
    depthCm?: true
    heightCm?: true
    weightKg?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    material?: true
    price?: true
    originalPrice?: true
    badge?: true
    stockStatus?: true
    description?: true
    images?: true
    rating?: true
    reviewCount?: true
    widthCm?: true
    depthCm?: true
    heightCm?: true
    weightKg?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal
    originalPrice: Decimal | null
    badge: $Enums.ProductBadge | null
    stockStatus: $Enums.StockStatus
    description: string
    images: string[]
    rating: Decimal
    reviewCount: number
    widthCm: Decimal
    depthCm: Decimal
    heightCm: Decimal
    weightKg: Decimal
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    material?: boolean
    price?: boolean
    originalPrice?: boolean
    badge?: boolean
    stockStatus?: boolean
    description?: boolean
    images?: boolean
    rating?: boolean
    reviewCount?: boolean
    widthCm?: boolean
    depthCm?: boolean
    heightCm?: boolean
    weightKg?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    colorVariants?: boolean | Product$colorVariantsArgs<ExtArgs>
    stockItems?: boolean | Product$stockItemsArgs<ExtArgs>
    quotationItems?: boolean | Product$quotationItemsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    material?: boolean
    price?: boolean
    originalPrice?: boolean
    badge?: boolean
    stockStatus?: boolean
    description?: boolean
    images?: boolean
    rating?: boolean
    reviewCount?: boolean
    widthCm?: boolean
    depthCm?: boolean
    heightCm?: boolean
    weightKg?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    material?: boolean
    price?: boolean
    originalPrice?: boolean
    badge?: boolean
    stockStatus?: boolean
    description?: boolean
    images?: boolean
    rating?: boolean
    reviewCount?: boolean
    widthCm?: boolean
    depthCm?: boolean
    heightCm?: boolean
    weightKg?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    material?: boolean
    price?: boolean
    originalPrice?: boolean
    badge?: boolean
    stockStatus?: boolean
    description?: boolean
    images?: boolean
    rating?: boolean
    reviewCount?: boolean
    widthCm?: boolean
    depthCm?: boolean
    heightCm?: boolean
    weightKg?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "name" | "category" | "material" | "price" | "originalPrice" | "badge" | "stockStatus" | "description" | "images" | "rating" | "reviewCount" | "widthCm" | "depthCm" | "heightCm" | "weightKg" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    colorVariants?: boolean | Product$colorVariantsArgs<ExtArgs>
    stockItems?: boolean | Product$stockItemsArgs<ExtArgs>
    quotationItems?: boolean | Product$quotationItemsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      colorVariants: Prisma.$ProductColorVariantPayload<ExtArgs>[]
      stockItems: Prisma.$StockItemPayload<ExtArgs>[]
      quotationItems: Prisma.$QuotationLineItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      category: string
      material: string
      price: Prisma.Decimal
      originalPrice: Prisma.Decimal | null
      badge: $Enums.ProductBadge | null
      stockStatus: $Enums.StockStatus
      description: string
      images: string[]
      rating: Prisma.Decimal
      reviewCount: number
      widthCm: Prisma.Decimal
      depthCm: Prisma.Decimal
      heightCm: Prisma.Decimal
      weightKg: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    colorVariants<T extends Product$colorVariantsArgs<ExtArgs> = {}>(args?: Subset<T, Product$colorVariantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    stockItems<T extends Product$stockItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$stockItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    quotationItems<T extends Product$quotationItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$quotationItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly slug: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly category: FieldRef<"Product", 'String'>
    readonly material: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'Decimal'>
    readonly originalPrice: FieldRef<"Product", 'Decimal'>
    readonly badge: FieldRef<"Product", 'ProductBadge'>
    readonly stockStatus: FieldRef<"Product", 'StockStatus'>
    readonly description: FieldRef<"Product", 'String'>
    readonly images: FieldRef<"Product", 'String[]'>
    readonly rating: FieldRef<"Product", 'Decimal'>
    readonly reviewCount: FieldRef<"Product", 'Int'>
    readonly widthCm: FieldRef<"Product", 'Decimal'>
    readonly depthCm: FieldRef<"Product", 'Decimal'>
    readonly heightCm: FieldRef<"Product", 'Decimal'>
    readonly weightKg: FieldRef<"Product", 'Decimal'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.colorVariants
   */
  export type Product$colorVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    where?: ProductColorVariantWhereInput
    orderBy?: ProductColorVariantOrderByWithRelationInput | ProductColorVariantOrderByWithRelationInput[]
    cursor?: ProductColorVariantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductColorVariantScalarFieldEnum | ProductColorVariantScalarFieldEnum[]
  }

  /**
   * Product.stockItems
   */
  export type Product$stockItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    where?: StockItemWhereInput
    orderBy?: StockItemOrderByWithRelationInput | StockItemOrderByWithRelationInput[]
    cursor?: StockItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockItemScalarFieldEnum | StockItemScalarFieldEnum[]
  }

  /**
   * Product.quotationItems
   */
  export type Product$quotationItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    where?: QuotationLineItemWhereInput
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    cursor?: QuotationLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ProductColorVariant
   */

  export type AggregateProductColorVariant = {
    _count: ProductColorVariantCountAggregateOutputType | null
    _min: ProductColorVariantMinAggregateOutputType | null
    _max: ProductColorVariantMaxAggregateOutputType | null
  }

  export type ProductColorVariantMinAggregateOutputType = {
    id: string | null
    productId: string | null
    name: string | null
    hex: string | null
  }

  export type ProductColorVariantMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    name: string | null
    hex: string | null
  }

  export type ProductColorVariantCountAggregateOutputType = {
    id: number
    productId: number
    name: number
    hex: number
    _all: number
  }


  export type ProductColorVariantMinAggregateInputType = {
    id?: true
    productId?: true
    name?: true
    hex?: true
  }

  export type ProductColorVariantMaxAggregateInputType = {
    id?: true
    productId?: true
    name?: true
    hex?: true
  }

  export type ProductColorVariantCountAggregateInputType = {
    id?: true
    productId?: true
    name?: true
    hex?: true
    _all?: true
  }

  export type ProductColorVariantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductColorVariant to aggregate.
     */
    where?: ProductColorVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductColorVariants to fetch.
     */
    orderBy?: ProductColorVariantOrderByWithRelationInput | ProductColorVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductColorVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductColorVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductColorVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductColorVariants
    **/
    _count?: true | ProductColorVariantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductColorVariantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductColorVariantMaxAggregateInputType
  }

  export type GetProductColorVariantAggregateType<T extends ProductColorVariantAggregateArgs> = {
        [P in keyof T & keyof AggregateProductColorVariant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductColorVariant[P]>
      : GetScalarType<T[P], AggregateProductColorVariant[P]>
  }




  export type ProductColorVariantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductColorVariantWhereInput
    orderBy?: ProductColorVariantOrderByWithAggregationInput | ProductColorVariantOrderByWithAggregationInput[]
    by: ProductColorVariantScalarFieldEnum[] | ProductColorVariantScalarFieldEnum
    having?: ProductColorVariantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductColorVariantCountAggregateInputType | true
    _min?: ProductColorVariantMinAggregateInputType
    _max?: ProductColorVariantMaxAggregateInputType
  }

  export type ProductColorVariantGroupByOutputType = {
    id: string
    productId: string
    name: string
    hex: string
    _count: ProductColorVariantCountAggregateOutputType | null
    _min: ProductColorVariantMinAggregateOutputType | null
    _max: ProductColorVariantMaxAggregateOutputType | null
  }

  type GetProductColorVariantGroupByPayload<T extends ProductColorVariantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductColorVariantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductColorVariantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductColorVariantGroupByOutputType[P]>
            : GetScalarType<T[P], ProductColorVariantGroupByOutputType[P]>
        }
      >
    >


  export type ProductColorVariantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    name?: boolean
    hex?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productColorVariant"]>

  export type ProductColorVariantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    name?: boolean
    hex?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productColorVariant"]>

  export type ProductColorVariantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    name?: boolean
    hex?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productColorVariant"]>

  export type ProductColorVariantSelectScalar = {
    id?: boolean
    productId?: boolean
    name?: boolean
    hex?: boolean
  }

  export type ProductColorVariantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "name" | "hex", ExtArgs["result"]["productColorVariant"]>
  export type ProductColorVariantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductColorVariantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductColorVariantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductColorVariantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductColorVariant"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      name: string
      hex: string
    }, ExtArgs["result"]["productColorVariant"]>
    composites: {}
  }

  type ProductColorVariantGetPayload<S extends boolean | null | undefined | ProductColorVariantDefaultArgs> = $Result.GetResult<Prisma.$ProductColorVariantPayload, S>

  type ProductColorVariantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductColorVariantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductColorVariantCountAggregateInputType | true
    }

  export interface ProductColorVariantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductColorVariant'], meta: { name: 'ProductColorVariant' } }
    /**
     * Find zero or one ProductColorVariant that matches the filter.
     * @param {ProductColorVariantFindUniqueArgs} args - Arguments to find a ProductColorVariant
     * @example
     * // Get one ProductColorVariant
     * const productColorVariant = await prisma.productColorVariant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductColorVariantFindUniqueArgs>(args: SelectSubset<T, ProductColorVariantFindUniqueArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductColorVariant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductColorVariantFindUniqueOrThrowArgs} args - Arguments to find a ProductColorVariant
     * @example
     * // Get one ProductColorVariant
     * const productColorVariant = await prisma.productColorVariant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductColorVariantFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductColorVariantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductColorVariant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductColorVariantFindFirstArgs} args - Arguments to find a ProductColorVariant
     * @example
     * // Get one ProductColorVariant
     * const productColorVariant = await prisma.productColorVariant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductColorVariantFindFirstArgs>(args?: SelectSubset<T, ProductColorVariantFindFirstArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductColorVariant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductColorVariantFindFirstOrThrowArgs} args - Arguments to find a ProductColorVariant
     * @example
     * // Get one ProductColorVariant
     * const productColorVariant = await prisma.productColorVariant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductColorVariantFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductColorVariantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductColorVariants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductColorVariantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductColorVariants
     * const productColorVariants = await prisma.productColorVariant.findMany()
     * 
     * // Get first 10 ProductColorVariants
     * const productColorVariants = await prisma.productColorVariant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productColorVariantWithIdOnly = await prisma.productColorVariant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductColorVariantFindManyArgs>(args?: SelectSubset<T, ProductColorVariantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductColorVariant.
     * @param {ProductColorVariantCreateArgs} args - Arguments to create a ProductColorVariant.
     * @example
     * // Create one ProductColorVariant
     * const ProductColorVariant = await prisma.productColorVariant.create({
     *   data: {
     *     // ... data to create a ProductColorVariant
     *   }
     * })
     * 
     */
    create<T extends ProductColorVariantCreateArgs>(args: SelectSubset<T, ProductColorVariantCreateArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductColorVariants.
     * @param {ProductColorVariantCreateManyArgs} args - Arguments to create many ProductColorVariants.
     * @example
     * // Create many ProductColorVariants
     * const productColorVariant = await prisma.productColorVariant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductColorVariantCreateManyArgs>(args?: SelectSubset<T, ProductColorVariantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductColorVariants and returns the data saved in the database.
     * @param {ProductColorVariantCreateManyAndReturnArgs} args - Arguments to create many ProductColorVariants.
     * @example
     * // Create many ProductColorVariants
     * const productColorVariant = await prisma.productColorVariant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductColorVariants and only return the `id`
     * const productColorVariantWithIdOnly = await prisma.productColorVariant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductColorVariantCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductColorVariantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductColorVariant.
     * @param {ProductColorVariantDeleteArgs} args - Arguments to delete one ProductColorVariant.
     * @example
     * // Delete one ProductColorVariant
     * const ProductColorVariant = await prisma.productColorVariant.delete({
     *   where: {
     *     // ... filter to delete one ProductColorVariant
     *   }
     * })
     * 
     */
    delete<T extends ProductColorVariantDeleteArgs>(args: SelectSubset<T, ProductColorVariantDeleteArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductColorVariant.
     * @param {ProductColorVariantUpdateArgs} args - Arguments to update one ProductColorVariant.
     * @example
     * // Update one ProductColorVariant
     * const productColorVariant = await prisma.productColorVariant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductColorVariantUpdateArgs>(args: SelectSubset<T, ProductColorVariantUpdateArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductColorVariants.
     * @param {ProductColorVariantDeleteManyArgs} args - Arguments to filter ProductColorVariants to delete.
     * @example
     * // Delete a few ProductColorVariants
     * const { count } = await prisma.productColorVariant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductColorVariantDeleteManyArgs>(args?: SelectSubset<T, ProductColorVariantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductColorVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductColorVariantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductColorVariants
     * const productColorVariant = await prisma.productColorVariant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductColorVariantUpdateManyArgs>(args: SelectSubset<T, ProductColorVariantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductColorVariants and returns the data updated in the database.
     * @param {ProductColorVariantUpdateManyAndReturnArgs} args - Arguments to update many ProductColorVariants.
     * @example
     * // Update many ProductColorVariants
     * const productColorVariant = await prisma.productColorVariant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductColorVariants and only return the `id`
     * const productColorVariantWithIdOnly = await prisma.productColorVariant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductColorVariantUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductColorVariantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductColorVariant.
     * @param {ProductColorVariantUpsertArgs} args - Arguments to update or create a ProductColorVariant.
     * @example
     * // Update or create a ProductColorVariant
     * const productColorVariant = await prisma.productColorVariant.upsert({
     *   create: {
     *     // ... data to create a ProductColorVariant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductColorVariant we want to update
     *   }
     * })
     */
    upsert<T extends ProductColorVariantUpsertArgs>(args: SelectSubset<T, ProductColorVariantUpsertArgs<ExtArgs>>): Prisma__ProductColorVariantClient<$Result.GetResult<Prisma.$ProductColorVariantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductColorVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductColorVariantCountArgs} args - Arguments to filter ProductColorVariants to count.
     * @example
     * // Count the number of ProductColorVariants
     * const count = await prisma.productColorVariant.count({
     *   where: {
     *     // ... the filter for the ProductColorVariants we want to count
     *   }
     * })
    **/
    count<T extends ProductColorVariantCountArgs>(
      args?: Subset<T, ProductColorVariantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductColorVariantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductColorVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductColorVariantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductColorVariantAggregateArgs>(args: Subset<T, ProductColorVariantAggregateArgs>): Prisma.PrismaPromise<GetProductColorVariantAggregateType<T>>

    /**
     * Group by ProductColorVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductColorVariantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductColorVariantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductColorVariantGroupByArgs['orderBy'] }
        : { orderBy?: ProductColorVariantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductColorVariantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductColorVariantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductColorVariant model
   */
  readonly fields: ProductColorVariantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductColorVariant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductColorVariantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductColorVariant model
   */
  interface ProductColorVariantFieldRefs {
    readonly id: FieldRef<"ProductColorVariant", 'String'>
    readonly productId: FieldRef<"ProductColorVariant", 'String'>
    readonly name: FieldRef<"ProductColorVariant", 'String'>
    readonly hex: FieldRef<"ProductColorVariant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProductColorVariant findUnique
   */
  export type ProductColorVariantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductColorVariant to fetch.
     */
    where: ProductColorVariantWhereUniqueInput
  }

  /**
   * ProductColorVariant findUniqueOrThrow
   */
  export type ProductColorVariantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductColorVariant to fetch.
     */
    where: ProductColorVariantWhereUniqueInput
  }

  /**
   * ProductColorVariant findFirst
   */
  export type ProductColorVariantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductColorVariant to fetch.
     */
    where?: ProductColorVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductColorVariants to fetch.
     */
    orderBy?: ProductColorVariantOrderByWithRelationInput | ProductColorVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductColorVariants.
     */
    cursor?: ProductColorVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductColorVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductColorVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductColorVariants.
     */
    distinct?: ProductColorVariantScalarFieldEnum | ProductColorVariantScalarFieldEnum[]
  }

  /**
   * ProductColorVariant findFirstOrThrow
   */
  export type ProductColorVariantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductColorVariant to fetch.
     */
    where?: ProductColorVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductColorVariants to fetch.
     */
    orderBy?: ProductColorVariantOrderByWithRelationInput | ProductColorVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductColorVariants.
     */
    cursor?: ProductColorVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductColorVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductColorVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductColorVariants.
     */
    distinct?: ProductColorVariantScalarFieldEnum | ProductColorVariantScalarFieldEnum[]
  }

  /**
   * ProductColorVariant findMany
   */
  export type ProductColorVariantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductColorVariants to fetch.
     */
    where?: ProductColorVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductColorVariants to fetch.
     */
    orderBy?: ProductColorVariantOrderByWithRelationInput | ProductColorVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductColorVariants.
     */
    cursor?: ProductColorVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductColorVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductColorVariants.
     */
    skip?: number
    distinct?: ProductColorVariantScalarFieldEnum | ProductColorVariantScalarFieldEnum[]
  }

  /**
   * ProductColorVariant create
   */
  export type ProductColorVariantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductColorVariant.
     */
    data: XOR<ProductColorVariantCreateInput, ProductColorVariantUncheckedCreateInput>
  }

  /**
   * ProductColorVariant createMany
   */
  export type ProductColorVariantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductColorVariants.
     */
    data: ProductColorVariantCreateManyInput | ProductColorVariantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductColorVariant createManyAndReturn
   */
  export type ProductColorVariantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * The data used to create many ProductColorVariants.
     */
    data: ProductColorVariantCreateManyInput | ProductColorVariantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductColorVariant update
   */
  export type ProductColorVariantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductColorVariant.
     */
    data: XOR<ProductColorVariantUpdateInput, ProductColorVariantUncheckedUpdateInput>
    /**
     * Choose, which ProductColorVariant to update.
     */
    where: ProductColorVariantWhereUniqueInput
  }

  /**
   * ProductColorVariant updateMany
   */
  export type ProductColorVariantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductColorVariants.
     */
    data: XOR<ProductColorVariantUpdateManyMutationInput, ProductColorVariantUncheckedUpdateManyInput>
    /**
     * Filter which ProductColorVariants to update
     */
    where?: ProductColorVariantWhereInput
    /**
     * Limit how many ProductColorVariants to update.
     */
    limit?: number
  }

  /**
   * ProductColorVariant updateManyAndReturn
   */
  export type ProductColorVariantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * The data used to update ProductColorVariants.
     */
    data: XOR<ProductColorVariantUpdateManyMutationInput, ProductColorVariantUncheckedUpdateManyInput>
    /**
     * Filter which ProductColorVariants to update
     */
    where?: ProductColorVariantWhereInput
    /**
     * Limit how many ProductColorVariants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductColorVariant upsert
   */
  export type ProductColorVariantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductColorVariant to update in case it exists.
     */
    where: ProductColorVariantWhereUniqueInput
    /**
     * In case the ProductColorVariant found by the `where` argument doesn't exist, create a new ProductColorVariant with this data.
     */
    create: XOR<ProductColorVariantCreateInput, ProductColorVariantUncheckedCreateInput>
    /**
     * In case the ProductColorVariant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductColorVariantUpdateInput, ProductColorVariantUncheckedUpdateInput>
  }

  /**
   * ProductColorVariant delete
   */
  export type ProductColorVariantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
    /**
     * Filter which ProductColorVariant to delete.
     */
    where: ProductColorVariantWhereUniqueInput
  }

  /**
   * ProductColorVariant deleteMany
   */
  export type ProductColorVariantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductColorVariants to delete
     */
    where?: ProductColorVariantWhereInput
    /**
     * Limit how many ProductColorVariants to delete.
     */
    limit?: number
  }

  /**
   * ProductColorVariant without action
   */
  export type ProductColorVariantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductColorVariant
     */
    select?: ProductColorVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductColorVariant
     */
    omit?: ProductColorVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductColorVariantInclude<ExtArgs> | null
  }


  /**
   * Model Warehouse
   */

  export type AggregateWarehouse = {
    _count: WarehouseCountAggregateOutputType | null
    _min: WarehouseMinAggregateOutputType | null
    _max: WarehouseMaxAggregateOutputType | null
  }

  export type WarehouseMinAggregateOutputType = {
    id: string | null
    name: string | null
    branchCode: string | null
    address: string | null
  }

  export type WarehouseMaxAggregateOutputType = {
    id: string | null
    name: string | null
    branchCode: string | null
    address: string | null
  }

  export type WarehouseCountAggregateOutputType = {
    id: number
    name: number
    branchCode: number
    address: number
    _all: number
  }


  export type WarehouseMinAggregateInputType = {
    id?: true
    name?: true
    branchCode?: true
    address?: true
  }

  export type WarehouseMaxAggregateInputType = {
    id?: true
    name?: true
    branchCode?: true
    address?: true
  }

  export type WarehouseCountAggregateInputType = {
    id?: true
    name?: true
    branchCode?: true
    address?: true
    _all?: true
  }

  export type WarehouseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warehouse to aggregate.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Warehouses
    **/
    _count?: true | WarehouseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WarehouseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WarehouseMaxAggregateInputType
  }

  export type GetWarehouseAggregateType<T extends WarehouseAggregateArgs> = {
        [P in keyof T & keyof AggregateWarehouse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWarehouse[P]>
      : GetScalarType<T[P], AggregateWarehouse[P]>
  }




  export type WarehouseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WarehouseWhereInput
    orderBy?: WarehouseOrderByWithAggregationInput | WarehouseOrderByWithAggregationInput[]
    by: WarehouseScalarFieldEnum[] | WarehouseScalarFieldEnum
    having?: WarehouseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WarehouseCountAggregateInputType | true
    _min?: WarehouseMinAggregateInputType
    _max?: WarehouseMaxAggregateInputType
  }

  export type WarehouseGroupByOutputType = {
    id: string
    name: string
    branchCode: string
    address: string
    _count: WarehouseCountAggregateOutputType | null
    _min: WarehouseMinAggregateOutputType | null
    _max: WarehouseMaxAggregateOutputType | null
  }

  type GetWarehouseGroupByPayload<T extends WarehouseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WarehouseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WarehouseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WarehouseGroupByOutputType[P]>
            : GetScalarType<T[P], WarehouseGroupByOutputType[P]>
        }
      >
    >


  export type WarehouseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    branchCode?: boolean
    address?: boolean
    stockItems?: boolean | Warehouse$stockItemsArgs<ExtArgs>
    transfersFrom?: boolean | Warehouse$transfersFromArgs<ExtArgs>
    transfersTo?: boolean | Warehouse$transfersToArgs<ExtArgs>
    _count?: boolean | WarehouseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["warehouse"]>

  export type WarehouseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    branchCode?: boolean
    address?: boolean
  }, ExtArgs["result"]["warehouse"]>

  export type WarehouseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    branchCode?: boolean
    address?: boolean
  }, ExtArgs["result"]["warehouse"]>

  export type WarehouseSelectScalar = {
    id?: boolean
    name?: boolean
    branchCode?: boolean
    address?: boolean
  }

  export type WarehouseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "branchCode" | "address", ExtArgs["result"]["warehouse"]>
  export type WarehouseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stockItems?: boolean | Warehouse$stockItemsArgs<ExtArgs>
    transfersFrom?: boolean | Warehouse$transfersFromArgs<ExtArgs>
    transfersTo?: boolean | Warehouse$transfersToArgs<ExtArgs>
    _count?: boolean | WarehouseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WarehouseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WarehouseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WarehousePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Warehouse"
    objects: {
      stockItems: Prisma.$StockItemPayload<ExtArgs>[]
      transfersFrom: Prisma.$StockTransferPayload<ExtArgs>[]
      transfersTo: Prisma.$StockTransferPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      branchCode: string
      address: string
    }, ExtArgs["result"]["warehouse"]>
    composites: {}
  }

  type WarehouseGetPayload<S extends boolean | null | undefined | WarehouseDefaultArgs> = $Result.GetResult<Prisma.$WarehousePayload, S>

  type WarehouseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WarehouseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WarehouseCountAggregateInputType | true
    }

  export interface WarehouseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Warehouse'], meta: { name: 'Warehouse' } }
    /**
     * Find zero or one Warehouse that matches the filter.
     * @param {WarehouseFindUniqueArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WarehouseFindUniqueArgs>(args: SelectSubset<T, WarehouseFindUniqueArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Warehouse that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WarehouseFindUniqueOrThrowArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WarehouseFindUniqueOrThrowArgs>(args: SelectSubset<T, WarehouseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Warehouse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseFindFirstArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WarehouseFindFirstArgs>(args?: SelectSubset<T, WarehouseFindFirstArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Warehouse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseFindFirstOrThrowArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WarehouseFindFirstOrThrowArgs>(args?: SelectSubset<T, WarehouseFindFirstOrThrowArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Warehouses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Warehouses
     * const warehouses = await prisma.warehouse.findMany()
     * 
     * // Get first 10 Warehouses
     * const warehouses = await prisma.warehouse.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const warehouseWithIdOnly = await prisma.warehouse.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WarehouseFindManyArgs>(args?: SelectSubset<T, WarehouseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Warehouse.
     * @param {WarehouseCreateArgs} args - Arguments to create a Warehouse.
     * @example
     * // Create one Warehouse
     * const Warehouse = await prisma.warehouse.create({
     *   data: {
     *     // ... data to create a Warehouse
     *   }
     * })
     * 
     */
    create<T extends WarehouseCreateArgs>(args: SelectSubset<T, WarehouseCreateArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Warehouses.
     * @param {WarehouseCreateManyArgs} args - Arguments to create many Warehouses.
     * @example
     * // Create many Warehouses
     * const warehouse = await prisma.warehouse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WarehouseCreateManyArgs>(args?: SelectSubset<T, WarehouseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Warehouses and returns the data saved in the database.
     * @param {WarehouseCreateManyAndReturnArgs} args - Arguments to create many Warehouses.
     * @example
     * // Create many Warehouses
     * const warehouse = await prisma.warehouse.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Warehouses and only return the `id`
     * const warehouseWithIdOnly = await prisma.warehouse.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WarehouseCreateManyAndReturnArgs>(args?: SelectSubset<T, WarehouseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Warehouse.
     * @param {WarehouseDeleteArgs} args - Arguments to delete one Warehouse.
     * @example
     * // Delete one Warehouse
     * const Warehouse = await prisma.warehouse.delete({
     *   where: {
     *     // ... filter to delete one Warehouse
     *   }
     * })
     * 
     */
    delete<T extends WarehouseDeleteArgs>(args: SelectSubset<T, WarehouseDeleteArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Warehouse.
     * @param {WarehouseUpdateArgs} args - Arguments to update one Warehouse.
     * @example
     * // Update one Warehouse
     * const warehouse = await prisma.warehouse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WarehouseUpdateArgs>(args: SelectSubset<T, WarehouseUpdateArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Warehouses.
     * @param {WarehouseDeleteManyArgs} args - Arguments to filter Warehouses to delete.
     * @example
     * // Delete a few Warehouses
     * const { count } = await prisma.warehouse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WarehouseDeleteManyArgs>(args?: SelectSubset<T, WarehouseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Warehouses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Warehouses
     * const warehouse = await prisma.warehouse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WarehouseUpdateManyArgs>(args: SelectSubset<T, WarehouseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Warehouses and returns the data updated in the database.
     * @param {WarehouseUpdateManyAndReturnArgs} args - Arguments to update many Warehouses.
     * @example
     * // Update many Warehouses
     * const warehouse = await prisma.warehouse.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Warehouses and only return the `id`
     * const warehouseWithIdOnly = await prisma.warehouse.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WarehouseUpdateManyAndReturnArgs>(args: SelectSubset<T, WarehouseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Warehouse.
     * @param {WarehouseUpsertArgs} args - Arguments to update or create a Warehouse.
     * @example
     * // Update or create a Warehouse
     * const warehouse = await prisma.warehouse.upsert({
     *   create: {
     *     // ... data to create a Warehouse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Warehouse we want to update
     *   }
     * })
     */
    upsert<T extends WarehouseUpsertArgs>(args: SelectSubset<T, WarehouseUpsertArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Warehouses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseCountArgs} args - Arguments to filter Warehouses to count.
     * @example
     * // Count the number of Warehouses
     * const count = await prisma.warehouse.count({
     *   where: {
     *     // ... the filter for the Warehouses we want to count
     *   }
     * })
    **/
    count<T extends WarehouseCountArgs>(
      args?: Subset<T, WarehouseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WarehouseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Warehouse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WarehouseAggregateArgs>(args: Subset<T, WarehouseAggregateArgs>): Prisma.PrismaPromise<GetWarehouseAggregateType<T>>

    /**
     * Group by Warehouse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WarehouseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WarehouseGroupByArgs['orderBy'] }
        : { orderBy?: WarehouseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WarehouseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWarehouseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Warehouse model
   */
  readonly fields: WarehouseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Warehouse.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WarehouseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    stockItems<T extends Warehouse$stockItemsArgs<ExtArgs> = {}>(args?: Subset<T, Warehouse$stockItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transfersFrom<T extends Warehouse$transfersFromArgs<ExtArgs> = {}>(args?: Subset<T, Warehouse$transfersFromArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transfersTo<T extends Warehouse$transfersToArgs<ExtArgs> = {}>(args?: Subset<T, Warehouse$transfersToArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Warehouse model
   */
  interface WarehouseFieldRefs {
    readonly id: FieldRef<"Warehouse", 'String'>
    readonly name: FieldRef<"Warehouse", 'String'>
    readonly branchCode: FieldRef<"Warehouse", 'String'>
    readonly address: FieldRef<"Warehouse", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Warehouse findUnique
   */
  export type WarehouseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse findUniqueOrThrow
   */
  export type WarehouseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse findFirst
   */
  export type WarehouseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warehouses.
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warehouses.
     */
    distinct?: WarehouseScalarFieldEnum | WarehouseScalarFieldEnum[]
  }

  /**
   * Warehouse findFirstOrThrow
   */
  export type WarehouseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warehouses.
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warehouses.
     */
    distinct?: WarehouseScalarFieldEnum | WarehouseScalarFieldEnum[]
  }

  /**
   * Warehouse findMany
   */
  export type WarehouseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouses to fetch.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Warehouses.
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    distinct?: WarehouseScalarFieldEnum | WarehouseScalarFieldEnum[]
  }

  /**
   * Warehouse create
   */
  export type WarehouseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * The data needed to create a Warehouse.
     */
    data: XOR<WarehouseCreateInput, WarehouseUncheckedCreateInput>
  }

  /**
   * Warehouse createMany
   */
  export type WarehouseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Warehouses.
     */
    data: WarehouseCreateManyInput | WarehouseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Warehouse createManyAndReturn
   */
  export type WarehouseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * The data used to create many Warehouses.
     */
    data: WarehouseCreateManyInput | WarehouseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Warehouse update
   */
  export type WarehouseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * The data needed to update a Warehouse.
     */
    data: XOR<WarehouseUpdateInput, WarehouseUncheckedUpdateInput>
    /**
     * Choose, which Warehouse to update.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse updateMany
   */
  export type WarehouseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Warehouses.
     */
    data: XOR<WarehouseUpdateManyMutationInput, WarehouseUncheckedUpdateManyInput>
    /**
     * Filter which Warehouses to update
     */
    where?: WarehouseWhereInput
    /**
     * Limit how many Warehouses to update.
     */
    limit?: number
  }

  /**
   * Warehouse updateManyAndReturn
   */
  export type WarehouseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * The data used to update Warehouses.
     */
    data: XOR<WarehouseUpdateManyMutationInput, WarehouseUncheckedUpdateManyInput>
    /**
     * Filter which Warehouses to update
     */
    where?: WarehouseWhereInput
    /**
     * Limit how many Warehouses to update.
     */
    limit?: number
  }

  /**
   * Warehouse upsert
   */
  export type WarehouseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * The filter to search for the Warehouse to update in case it exists.
     */
    where: WarehouseWhereUniqueInput
    /**
     * In case the Warehouse found by the `where` argument doesn't exist, create a new Warehouse with this data.
     */
    create: XOR<WarehouseCreateInput, WarehouseUncheckedCreateInput>
    /**
     * In case the Warehouse was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WarehouseUpdateInput, WarehouseUncheckedUpdateInput>
  }

  /**
   * Warehouse delete
   */
  export type WarehouseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter which Warehouse to delete.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse deleteMany
   */
  export type WarehouseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warehouses to delete
     */
    where?: WarehouseWhereInput
    /**
     * Limit how many Warehouses to delete.
     */
    limit?: number
  }

  /**
   * Warehouse.stockItems
   */
  export type Warehouse$stockItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    where?: StockItemWhereInput
    orderBy?: StockItemOrderByWithRelationInput | StockItemOrderByWithRelationInput[]
    cursor?: StockItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockItemScalarFieldEnum | StockItemScalarFieldEnum[]
  }

  /**
   * Warehouse.transfersFrom
   */
  export type Warehouse$transfersFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    where?: StockTransferWhereInput
    orderBy?: StockTransferOrderByWithRelationInput | StockTransferOrderByWithRelationInput[]
    cursor?: StockTransferWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockTransferScalarFieldEnum | StockTransferScalarFieldEnum[]
  }

  /**
   * Warehouse.transfersTo
   */
  export type Warehouse$transfersToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    where?: StockTransferWhereInput
    orderBy?: StockTransferOrderByWithRelationInput | StockTransferOrderByWithRelationInput[]
    cursor?: StockTransferWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockTransferScalarFieldEnum | StockTransferScalarFieldEnum[]
  }

  /**
   * Warehouse without action
   */
  export type WarehouseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warehouse
     */
    omit?: WarehouseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
  }


  /**
   * Model StockItem
   */

  export type AggregateStockItem = {
    _count: StockItemCountAggregateOutputType | null
    _avg: StockItemAvgAggregateOutputType | null
    _sum: StockItemSumAggregateOutputType | null
    _min: StockItemMinAggregateOutputType | null
    _max: StockItemMaxAggregateOutputType | null
  }

  export type StockItemAvgAggregateOutputType = {
    qtyAvailable: number | null
    qtyReserved: number | null
    qtyInProduction: number | null
    minThreshold: number | null
  }

  export type StockItemSumAggregateOutputType = {
    qtyAvailable: number | null
    qtyReserved: number | null
    qtyInProduction: number | null
    minThreshold: number | null
  }

  export type StockItemMinAggregateOutputType = {
    id: string | null
    productId: string | null
    warehouseId: string | null
    sku: string | null
    qtyAvailable: number | null
    qtyReserved: number | null
    qtyInProduction: number | null
    minThreshold: number | null
    state: $Enums.StockState | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StockItemMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    warehouseId: string | null
    sku: string | null
    qtyAvailable: number | null
    qtyReserved: number | null
    qtyInProduction: number | null
    minThreshold: number | null
    state: $Enums.StockState | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StockItemCountAggregateOutputType = {
    id: number
    productId: number
    warehouseId: number
    sku: number
    qtyAvailable: number
    qtyReserved: number
    qtyInProduction: number
    minThreshold: number
    state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StockItemAvgAggregateInputType = {
    qtyAvailable?: true
    qtyReserved?: true
    qtyInProduction?: true
    minThreshold?: true
  }

  export type StockItemSumAggregateInputType = {
    qtyAvailable?: true
    qtyReserved?: true
    qtyInProduction?: true
    minThreshold?: true
  }

  export type StockItemMinAggregateInputType = {
    id?: true
    productId?: true
    warehouseId?: true
    sku?: true
    qtyAvailable?: true
    qtyReserved?: true
    qtyInProduction?: true
    minThreshold?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StockItemMaxAggregateInputType = {
    id?: true
    productId?: true
    warehouseId?: true
    sku?: true
    qtyAvailable?: true
    qtyReserved?: true
    qtyInProduction?: true
    minThreshold?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StockItemCountAggregateInputType = {
    id?: true
    productId?: true
    warehouseId?: true
    sku?: true
    qtyAvailable?: true
    qtyReserved?: true
    qtyInProduction?: true
    minThreshold?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StockItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockItem to aggregate.
     */
    where?: StockItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockItems to fetch.
     */
    orderBy?: StockItemOrderByWithRelationInput | StockItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockItems
    **/
    _count?: true | StockItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockItemMaxAggregateInputType
  }

  export type GetStockItemAggregateType<T extends StockItemAggregateArgs> = {
        [P in keyof T & keyof AggregateStockItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockItem[P]>
      : GetScalarType<T[P], AggregateStockItem[P]>
  }




  export type StockItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockItemWhereInput
    orderBy?: StockItemOrderByWithAggregationInput | StockItemOrderByWithAggregationInput[]
    by: StockItemScalarFieldEnum[] | StockItemScalarFieldEnum
    having?: StockItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockItemCountAggregateInputType | true
    _avg?: StockItemAvgAggregateInputType
    _sum?: StockItemSumAggregateInputType
    _min?: StockItemMinAggregateInputType
    _max?: StockItemMaxAggregateInputType
  }

  export type StockItemGroupByOutputType = {
    id: string
    productId: string
    warehouseId: string
    sku: string
    qtyAvailable: number
    qtyReserved: number
    qtyInProduction: number
    minThreshold: number
    state: $Enums.StockState
    createdAt: Date
    updatedAt: Date
    _count: StockItemCountAggregateOutputType | null
    _avg: StockItemAvgAggregateOutputType | null
    _sum: StockItemSumAggregateOutputType | null
    _min: StockItemMinAggregateOutputType | null
    _max: StockItemMaxAggregateOutputType | null
  }

  type GetStockItemGroupByPayload<T extends StockItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockItemGroupByOutputType[P]>
            : GetScalarType<T[P], StockItemGroupByOutputType[P]>
        }
      >
    >


  export type StockItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    warehouseId?: boolean
    sku?: boolean
    qtyAvailable?: boolean
    qtyReserved?: boolean
    qtyInProduction?: boolean
    minThreshold?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    movements?: boolean | StockItem$movementsArgs<ExtArgs>
    _count?: boolean | StockItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockItem"]>

  export type StockItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    warehouseId?: boolean
    sku?: boolean
    qtyAvailable?: boolean
    qtyReserved?: boolean
    qtyInProduction?: boolean
    minThreshold?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockItem"]>

  export type StockItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    warehouseId?: boolean
    sku?: boolean
    qtyAvailable?: boolean
    qtyReserved?: boolean
    qtyInProduction?: boolean
    minThreshold?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockItem"]>

  export type StockItemSelectScalar = {
    id?: boolean
    productId?: boolean
    warehouseId?: boolean
    sku?: boolean
    qtyAvailable?: boolean
    qtyReserved?: boolean
    qtyInProduction?: boolean
    minThreshold?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StockItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "warehouseId" | "sku" | "qtyAvailable" | "qtyReserved" | "qtyInProduction" | "minThreshold" | "state" | "createdAt" | "updatedAt", ExtArgs["result"]["stockItem"]>
  export type StockItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    movements?: boolean | StockItem$movementsArgs<ExtArgs>
    _count?: boolean | StockItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StockItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }
  export type StockItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }

  export type $StockItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockItem"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
      warehouse: Prisma.$WarehousePayload<ExtArgs>
      movements: Prisma.$StockMovementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      warehouseId: string
      sku: string
      qtyAvailable: number
      qtyReserved: number
      qtyInProduction: number
      minThreshold: number
      state: $Enums.StockState
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["stockItem"]>
    composites: {}
  }

  type StockItemGetPayload<S extends boolean | null | undefined | StockItemDefaultArgs> = $Result.GetResult<Prisma.$StockItemPayload, S>

  type StockItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockItemCountAggregateInputType | true
    }

  export interface StockItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockItem'], meta: { name: 'StockItem' } }
    /**
     * Find zero or one StockItem that matches the filter.
     * @param {StockItemFindUniqueArgs} args - Arguments to find a StockItem
     * @example
     * // Get one StockItem
     * const stockItem = await prisma.stockItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockItemFindUniqueArgs>(args: SelectSubset<T, StockItemFindUniqueArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockItemFindUniqueOrThrowArgs} args - Arguments to find a StockItem
     * @example
     * // Get one StockItem
     * const stockItem = await prisma.stockItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockItemFindUniqueOrThrowArgs>(args: SelectSubset<T, StockItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockItemFindFirstArgs} args - Arguments to find a StockItem
     * @example
     * // Get one StockItem
     * const stockItem = await prisma.stockItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockItemFindFirstArgs>(args?: SelectSubset<T, StockItemFindFirstArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockItemFindFirstOrThrowArgs} args - Arguments to find a StockItem
     * @example
     * // Get one StockItem
     * const stockItem = await prisma.stockItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockItemFindFirstOrThrowArgs>(args?: SelectSubset<T, StockItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockItems
     * const stockItems = await prisma.stockItem.findMany()
     * 
     * // Get first 10 StockItems
     * const stockItems = await prisma.stockItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockItemWithIdOnly = await prisma.stockItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockItemFindManyArgs>(args?: SelectSubset<T, StockItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockItem.
     * @param {StockItemCreateArgs} args - Arguments to create a StockItem.
     * @example
     * // Create one StockItem
     * const StockItem = await prisma.stockItem.create({
     *   data: {
     *     // ... data to create a StockItem
     *   }
     * })
     * 
     */
    create<T extends StockItemCreateArgs>(args: SelectSubset<T, StockItemCreateArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockItems.
     * @param {StockItemCreateManyArgs} args - Arguments to create many StockItems.
     * @example
     * // Create many StockItems
     * const stockItem = await prisma.stockItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockItemCreateManyArgs>(args?: SelectSubset<T, StockItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockItems and returns the data saved in the database.
     * @param {StockItemCreateManyAndReturnArgs} args - Arguments to create many StockItems.
     * @example
     * // Create many StockItems
     * const stockItem = await prisma.stockItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockItems and only return the `id`
     * const stockItemWithIdOnly = await prisma.stockItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockItemCreateManyAndReturnArgs>(args?: SelectSubset<T, StockItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StockItem.
     * @param {StockItemDeleteArgs} args - Arguments to delete one StockItem.
     * @example
     * // Delete one StockItem
     * const StockItem = await prisma.stockItem.delete({
     *   where: {
     *     // ... filter to delete one StockItem
     *   }
     * })
     * 
     */
    delete<T extends StockItemDeleteArgs>(args: SelectSubset<T, StockItemDeleteArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockItem.
     * @param {StockItemUpdateArgs} args - Arguments to update one StockItem.
     * @example
     * // Update one StockItem
     * const stockItem = await prisma.stockItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockItemUpdateArgs>(args: SelectSubset<T, StockItemUpdateArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockItems.
     * @param {StockItemDeleteManyArgs} args - Arguments to filter StockItems to delete.
     * @example
     * // Delete a few StockItems
     * const { count } = await prisma.stockItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockItemDeleteManyArgs>(args?: SelectSubset<T, StockItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockItems
     * const stockItem = await prisma.stockItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockItemUpdateManyArgs>(args: SelectSubset<T, StockItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockItems and returns the data updated in the database.
     * @param {StockItemUpdateManyAndReturnArgs} args - Arguments to update many StockItems.
     * @example
     * // Update many StockItems
     * const stockItem = await prisma.stockItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StockItems and only return the `id`
     * const stockItemWithIdOnly = await prisma.stockItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StockItemUpdateManyAndReturnArgs>(args: SelectSubset<T, StockItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StockItem.
     * @param {StockItemUpsertArgs} args - Arguments to update or create a StockItem.
     * @example
     * // Update or create a StockItem
     * const stockItem = await prisma.stockItem.upsert({
     *   create: {
     *     // ... data to create a StockItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockItem we want to update
     *   }
     * })
     */
    upsert<T extends StockItemUpsertArgs>(args: SelectSubset<T, StockItemUpsertArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockItemCountArgs} args - Arguments to filter StockItems to count.
     * @example
     * // Count the number of StockItems
     * const count = await prisma.stockItem.count({
     *   where: {
     *     // ... the filter for the StockItems we want to count
     *   }
     * })
    **/
    count<T extends StockItemCountArgs>(
      args?: Subset<T, StockItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StockItemAggregateArgs>(args: Subset<T, StockItemAggregateArgs>): Prisma.PrismaPromise<GetStockItemAggregateType<T>>

    /**
     * Group by StockItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StockItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockItemGroupByArgs['orderBy'] }
        : { orderBy?: StockItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StockItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockItem model
   */
  readonly fields: StockItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    warehouse<T extends WarehouseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WarehouseDefaultArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    movements<T extends StockItem$movementsArgs<ExtArgs> = {}>(args?: Subset<T, StockItem$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StockItem model
   */
  interface StockItemFieldRefs {
    readonly id: FieldRef<"StockItem", 'String'>
    readonly productId: FieldRef<"StockItem", 'String'>
    readonly warehouseId: FieldRef<"StockItem", 'String'>
    readonly sku: FieldRef<"StockItem", 'String'>
    readonly qtyAvailable: FieldRef<"StockItem", 'Int'>
    readonly qtyReserved: FieldRef<"StockItem", 'Int'>
    readonly qtyInProduction: FieldRef<"StockItem", 'Int'>
    readonly minThreshold: FieldRef<"StockItem", 'Int'>
    readonly state: FieldRef<"StockItem", 'StockState'>
    readonly createdAt: FieldRef<"StockItem", 'DateTime'>
    readonly updatedAt: FieldRef<"StockItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StockItem findUnique
   */
  export type StockItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * Filter, which StockItem to fetch.
     */
    where: StockItemWhereUniqueInput
  }

  /**
   * StockItem findUniqueOrThrow
   */
  export type StockItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * Filter, which StockItem to fetch.
     */
    where: StockItemWhereUniqueInput
  }

  /**
   * StockItem findFirst
   */
  export type StockItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * Filter, which StockItem to fetch.
     */
    where?: StockItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockItems to fetch.
     */
    orderBy?: StockItemOrderByWithRelationInput | StockItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockItems.
     */
    cursor?: StockItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockItems.
     */
    distinct?: StockItemScalarFieldEnum | StockItemScalarFieldEnum[]
  }

  /**
   * StockItem findFirstOrThrow
   */
  export type StockItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * Filter, which StockItem to fetch.
     */
    where?: StockItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockItems to fetch.
     */
    orderBy?: StockItemOrderByWithRelationInput | StockItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockItems.
     */
    cursor?: StockItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockItems.
     */
    distinct?: StockItemScalarFieldEnum | StockItemScalarFieldEnum[]
  }

  /**
   * StockItem findMany
   */
  export type StockItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * Filter, which StockItems to fetch.
     */
    where?: StockItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockItems to fetch.
     */
    orderBy?: StockItemOrderByWithRelationInput | StockItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockItems.
     */
    cursor?: StockItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockItems.
     */
    skip?: number
    distinct?: StockItemScalarFieldEnum | StockItemScalarFieldEnum[]
  }

  /**
   * StockItem create
   */
  export type StockItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * The data needed to create a StockItem.
     */
    data: XOR<StockItemCreateInput, StockItemUncheckedCreateInput>
  }

  /**
   * StockItem createMany
   */
  export type StockItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockItems.
     */
    data: StockItemCreateManyInput | StockItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockItem createManyAndReturn
   */
  export type StockItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * The data used to create many StockItems.
     */
    data: StockItemCreateManyInput | StockItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockItem update
   */
  export type StockItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * The data needed to update a StockItem.
     */
    data: XOR<StockItemUpdateInput, StockItemUncheckedUpdateInput>
    /**
     * Choose, which StockItem to update.
     */
    where: StockItemWhereUniqueInput
  }

  /**
   * StockItem updateMany
   */
  export type StockItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockItems.
     */
    data: XOR<StockItemUpdateManyMutationInput, StockItemUncheckedUpdateManyInput>
    /**
     * Filter which StockItems to update
     */
    where?: StockItemWhereInput
    /**
     * Limit how many StockItems to update.
     */
    limit?: number
  }

  /**
   * StockItem updateManyAndReturn
   */
  export type StockItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * The data used to update StockItems.
     */
    data: XOR<StockItemUpdateManyMutationInput, StockItemUncheckedUpdateManyInput>
    /**
     * Filter which StockItems to update
     */
    where?: StockItemWhereInput
    /**
     * Limit how many StockItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockItem upsert
   */
  export type StockItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * The filter to search for the StockItem to update in case it exists.
     */
    where: StockItemWhereUniqueInput
    /**
     * In case the StockItem found by the `where` argument doesn't exist, create a new StockItem with this data.
     */
    create: XOR<StockItemCreateInput, StockItemUncheckedCreateInput>
    /**
     * In case the StockItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockItemUpdateInput, StockItemUncheckedUpdateInput>
  }

  /**
   * StockItem delete
   */
  export type StockItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
    /**
     * Filter which StockItem to delete.
     */
    where: StockItemWhereUniqueInput
  }

  /**
   * StockItem deleteMany
   */
  export type StockItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockItems to delete
     */
    where?: StockItemWhereInput
    /**
     * Limit how many StockItems to delete.
     */
    limit?: number
  }

  /**
   * StockItem.movements
   */
  export type StockItem$movementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    cursor?: StockMovementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockItem without action
   */
  export type StockItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockItem
     */
    select?: StockItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockItem
     */
    omit?: StockItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockItemInclude<ExtArgs> | null
  }


  /**
   * Model StockMovement
   */

  export type AggregateStockMovement = {
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  export type StockMovementAvgAggregateOutputType = {
    quantity: number | null
  }

  export type StockMovementSumAggregateOutputType = {
    quantity: number | null
  }

  export type StockMovementMinAggregateOutputType = {
    id: string | null
    stockItemId: string | null
    type: $Enums.StockMovementType | null
    quantity: number | null
    actor: string | null
    reference: string | null
    createdAt: Date | null
  }

  export type StockMovementMaxAggregateOutputType = {
    id: string | null
    stockItemId: string | null
    type: $Enums.StockMovementType | null
    quantity: number | null
    actor: string | null
    reference: string | null
    createdAt: Date | null
  }

  export type StockMovementCountAggregateOutputType = {
    id: number
    stockItemId: number
    type: number
    quantity: number
    actor: number
    reference: number
    createdAt: number
    _all: number
  }


  export type StockMovementAvgAggregateInputType = {
    quantity?: true
  }

  export type StockMovementSumAggregateInputType = {
    quantity?: true
  }

  export type StockMovementMinAggregateInputType = {
    id?: true
    stockItemId?: true
    type?: true
    quantity?: true
    actor?: true
    reference?: true
    createdAt?: true
  }

  export type StockMovementMaxAggregateInputType = {
    id?: true
    stockItemId?: true
    type?: true
    quantity?: true
    actor?: true
    reference?: true
    createdAt?: true
  }

  export type StockMovementCountAggregateInputType = {
    id?: true
    stockItemId?: true
    type?: true
    quantity?: true
    actor?: true
    reference?: true
    createdAt?: true
    _all?: true
  }

  export type StockMovementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovement to aggregate.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockMovements
    **/
    _count?: true | StockMovementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockMovementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockMovementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockMovementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockMovementMaxAggregateInputType
  }

  export type GetStockMovementAggregateType<T extends StockMovementAggregateArgs> = {
        [P in keyof T & keyof AggregateStockMovement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockMovement[P]>
      : GetScalarType<T[P], AggregateStockMovement[P]>
  }




  export type StockMovementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithAggregationInput | StockMovementOrderByWithAggregationInput[]
    by: StockMovementScalarFieldEnum[] | StockMovementScalarFieldEnum
    having?: StockMovementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockMovementCountAggregateInputType | true
    _avg?: StockMovementAvgAggregateInputType
    _sum?: StockMovementSumAggregateInputType
    _min?: StockMovementMinAggregateInputType
    _max?: StockMovementMaxAggregateInputType
  }

  export type StockMovementGroupByOutputType = {
    id: string
    stockItemId: string
    type: $Enums.StockMovementType
    quantity: number
    actor: string
    reference: string | null
    createdAt: Date
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  type GetStockMovementGroupByPayload<T extends StockMovementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockMovementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockMovementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
            : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
        }
      >
    >


  export type StockMovementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stockItemId?: boolean
    type?: boolean
    quantity?: boolean
    actor?: boolean
    reference?: boolean
    createdAt?: boolean
    stockItem?: boolean | StockItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stockItemId?: boolean
    type?: boolean
    quantity?: boolean
    actor?: boolean
    reference?: boolean
    createdAt?: boolean
    stockItem?: boolean | StockItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stockItemId?: boolean
    type?: boolean
    quantity?: boolean
    actor?: boolean
    reference?: boolean
    createdAt?: boolean
    stockItem?: boolean | StockItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectScalar = {
    id?: boolean
    stockItemId?: boolean
    type?: boolean
    quantity?: boolean
    actor?: boolean
    reference?: boolean
    createdAt?: boolean
  }

  export type StockMovementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "stockItemId" | "type" | "quantity" | "actor" | "reference" | "createdAt", ExtArgs["result"]["stockMovement"]>
  export type StockMovementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stockItem?: boolean | StockItemDefaultArgs<ExtArgs>
  }
  export type StockMovementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stockItem?: boolean | StockItemDefaultArgs<ExtArgs>
  }
  export type StockMovementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stockItem?: boolean | StockItemDefaultArgs<ExtArgs>
  }

  export type $StockMovementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockMovement"
    objects: {
      stockItem: Prisma.$StockItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      stockItemId: string
      type: $Enums.StockMovementType
      quantity: number
      actor: string
      reference: string | null
      createdAt: Date
    }, ExtArgs["result"]["stockMovement"]>
    composites: {}
  }

  type StockMovementGetPayload<S extends boolean | null | undefined | StockMovementDefaultArgs> = $Result.GetResult<Prisma.$StockMovementPayload, S>

  type StockMovementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockMovementCountAggregateInputType | true
    }

  export interface StockMovementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockMovement'], meta: { name: 'StockMovement' } }
    /**
     * Find zero or one StockMovement that matches the filter.
     * @param {StockMovementFindUniqueArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockMovementFindUniqueArgs>(args: SelectSubset<T, StockMovementFindUniqueArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockMovement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockMovementFindUniqueOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockMovementFindUniqueOrThrowArgs>(args: SelectSubset<T, StockMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockMovement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockMovementFindFirstArgs>(args?: SelectSubset<T, StockMovementFindFirstArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockMovement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockMovementFindFirstOrThrowArgs>(args?: SelectSubset<T, StockMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockMovements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockMovements
     * const stockMovements = await prisma.stockMovement.findMany()
     * 
     * // Get first 10 StockMovements
     * const stockMovements = await prisma.stockMovement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockMovementFindManyArgs>(args?: SelectSubset<T, StockMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockMovement.
     * @param {StockMovementCreateArgs} args - Arguments to create a StockMovement.
     * @example
     * // Create one StockMovement
     * const StockMovement = await prisma.stockMovement.create({
     *   data: {
     *     // ... data to create a StockMovement
     *   }
     * })
     * 
     */
    create<T extends StockMovementCreateArgs>(args: SelectSubset<T, StockMovementCreateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockMovements.
     * @param {StockMovementCreateManyArgs} args - Arguments to create many StockMovements.
     * @example
     * // Create many StockMovements
     * const stockMovement = await prisma.stockMovement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockMovementCreateManyArgs>(args?: SelectSubset<T, StockMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockMovements and returns the data saved in the database.
     * @param {StockMovementCreateManyAndReturnArgs} args - Arguments to create many StockMovements.
     * @example
     * // Create many StockMovements
     * const stockMovement = await prisma.stockMovement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockMovements and only return the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockMovementCreateManyAndReturnArgs>(args?: SelectSubset<T, StockMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StockMovement.
     * @param {StockMovementDeleteArgs} args - Arguments to delete one StockMovement.
     * @example
     * // Delete one StockMovement
     * const StockMovement = await prisma.stockMovement.delete({
     *   where: {
     *     // ... filter to delete one StockMovement
     *   }
     * })
     * 
     */
    delete<T extends StockMovementDeleteArgs>(args: SelectSubset<T, StockMovementDeleteArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockMovement.
     * @param {StockMovementUpdateArgs} args - Arguments to update one StockMovement.
     * @example
     * // Update one StockMovement
     * const stockMovement = await prisma.stockMovement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockMovementUpdateArgs>(args: SelectSubset<T, StockMovementUpdateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockMovements.
     * @param {StockMovementDeleteManyArgs} args - Arguments to filter StockMovements to delete.
     * @example
     * // Delete a few StockMovements
     * const { count } = await prisma.stockMovement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockMovementDeleteManyArgs>(args?: SelectSubset<T, StockMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockMovements
     * const stockMovement = await prisma.stockMovement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockMovementUpdateManyArgs>(args: SelectSubset<T, StockMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockMovements and returns the data updated in the database.
     * @param {StockMovementUpdateManyAndReturnArgs} args - Arguments to update many StockMovements.
     * @example
     * // Update many StockMovements
     * const stockMovement = await prisma.stockMovement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StockMovements and only return the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StockMovementUpdateManyAndReturnArgs>(args: SelectSubset<T, StockMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StockMovement.
     * @param {StockMovementUpsertArgs} args - Arguments to update or create a StockMovement.
     * @example
     * // Update or create a StockMovement
     * const stockMovement = await prisma.stockMovement.upsert({
     *   create: {
     *     // ... data to create a StockMovement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockMovement we want to update
     *   }
     * })
     */
    upsert<T extends StockMovementUpsertArgs>(args: SelectSubset<T, StockMovementUpsertArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementCountArgs} args - Arguments to filter StockMovements to count.
     * @example
     * // Count the number of StockMovements
     * const count = await prisma.stockMovement.count({
     *   where: {
     *     // ... the filter for the StockMovements we want to count
     *   }
     * })
    **/
    count<T extends StockMovementCountArgs>(
      args?: Subset<T, StockMovementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockMovementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StockMovementAggregateArgs>(args: Subset<T, StockMovementAggregateArgs>): Prisma.PrismaPromise<GetStockMovementAggregateType<T>>

    /**
     * Group by StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StockMovementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockMovementGroupByArgs['orderBy'] }
        : { orderBy?: StockMovementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StockMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockMovement model
   */
  readonly fields: StockMovementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockMovement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockMovementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    stockItem<T extends StockItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StockItemDefaultArgs<ExtArgs>>): Prisma__StockItemClient<$Result.GetResult<Prisma.$StockItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StockMovement model
   */
  interface StockMovementFieldRefs {
    readonly id: FieldRef<"StockMovement", 'String'>
    readonly stockItemId: FieldRef<"StockMovement", 'String'>
    readonly type: FieldRef<"StockMovement", 'StockMovementType'>
    readonly quantity: FieldRef<"StockMovement", 'Int'>
    readonly actor: FieldRef<"StockMovement", 'String'>
    readonly reference: FieldRef<"StockMovement", 'String'>
    readonly createdAt: FieldRef<"StockMovement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StockMovement findUnique
   */
  export type StockMovementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findUniqueOrThrow
   */
  export type StockMovementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findFirst
   */
  export type StockMovementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findFirstOrThrow
   */
  export type StockMovementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findMany
   */
  export type StockMovementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovements to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement create
   */
  export type StockMovementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to create a StockMovement.
     */
    data: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
  }

  /**
   * StockMovement createMany
   */
  export type StockMovementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockMovements.
     */
    data: StockMovementCreateManyInput | StockMovementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockMovement createManyAndReturn
   */
  export type StockMovementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * The data used to create many StockMovements.
     */
    data: StockMovementCreateManyInput | StockMovementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockMovement update
   */
  export type StockMovementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to update a StockMovement.
     */
    data: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
    /**
     * Choose, which StockMovement to update.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement updateMany
   */
  export type StockMovementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockMovements.
     */
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyInput>
    /**
     * Filter which StockMovements to update
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to update.
     */
    limit?: number
  }

  /**
   * StockMovement updateManyAndReturn
   */
  export type StockMovementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * The data used to update StockMovements.
     */
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyInput>
    /**
     * Filter which StockMovements to update
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockMovement upsert
   */
  export type StockMovementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The filter to search for the StockMovement to update in case it exists.
     */
    where: StockMovementWhereUniqueInput
    /**
     * In case the StockMovement found by the `where` argument doesn't exist, create a new StockMovement with this data.
     */
    create: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
    /**
     * In case the StockMovement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
  }

  /**
   * StockMovement delete
   */
  export type StockMovementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter which StockMovement to delete.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement deleteMany
   */
  export type StockMovementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovements to delete
     */
    where?: StockMovementWhereInput
    /**
     * Limit how many StockMovements to delete.
     */
    limit?: number
  }

  /**
   * StockMovement without action
   */
  export type StockMovementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockMovement
     */
    omit?: StockMovementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
  }


  /**
   * Model StockTransfer
   */

  export type AggregateStockTransfer = {
    _count: StockTransferCountAggregateOutputType | null
    _avg: StockTransferAvgAggregateOutputType | null
    _sum: StockTransferSumAggregateOutputType | null
    _min: StockTransferMinAggregateOutputType | null
    _max: StockTransferMaxAggregateOutputType | null
  }

  export type StockTransferAvgAggregateOutputType = {
    quantity: number | null
  }

  export type StockTransferSumAggregateOutputType = {
    quantity: number | null
  }

  export type StockTransferMinAggregateOutputType = {
    id: string | null
    fromWarehouse: string | null
    toWarehouse: string | null
    productId: string | null
    quantity: number | null
    reason: string | null
    status: string | null
    createdAt: Date | null
  }

  export type StockTransferMaxAggregateOutputType = {
    id: string | null
    fromWarehouse: string | null
    toWarehouse: string | null
    productId: string | null
    quantity: number | null
    reason: string | null
    status: string | null
    createdAt: Date | null
  }

  export type StockTransferCountAggregateOutputType = {
    id: number
    fromWarehouse: number
    toWarehouse: number
    productId: number
    quantity: number
    reason: number
    status: number
    createdAt: number
    _all: number
  }


  export type StockTransferAvgAggregateInputType = {
    quantity?: true
  }

  export type StockTransferSumAggregateInputType = {
    quantity?: true
  }

  export type StockTransferMinAggregateInputType = {
    id?: true
    fromWarehouse?: true
    toWarehouse?: true
    productId?: true
    quantity?: true
    reason?: true
    status?: true
    createdAt?: true
  }

  export type StockTransferMaxAggregateInputType = {
    id?: true
    fromWarehouse?: true
    toWarehouse?: true
    productId?: true
    quantity?: true
    reason?: true
    status?: true
    createdAt?: true
  }

  export type StockTransferCountAggregateInputType = {
    id?: true
    fromWarehouse?: true
    toWarehouse?: true
    productId?: true
    quantity?: true
    reason?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type StockTransferAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockTransfer to aggregate.
     */
    where?: StockTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockTransfers to fetch.
     */
    orderBy?: StockTransferOrderByWithRelationInput | StockTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockTransfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockTransfers
    **/
    _count?: true | StockTransferCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockTransferAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockTransferSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockTransferMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockTransferMaxAggregateInputType
  }

  export type GetStockTransferAggregateType<T extends StockTransferAggregateArgs> = {
        [P in keyof T & keyof AggregateStockTransfer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockTransfer[P]>
      : GetScalarType<T[P], AggregateStockTransfer[P]>
  }




  export type StockTransferGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockTransferWhereInput
    orderBy?: StockTransferOrderByWithAggregationInput | StockTransferOrderByWithAggregationInput[]
    by: StockTransferScalarFieldEnum[] | StockTransferScalarFieldEnum
    having?: StockTransferScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockTransferCountAggregateInputType | true
    _avg?: StockTransferAvgAggregateInputType
    _sum?: StockTransferSumAggregateInputType
    _min?: StockTransferMinAggregateInputType
    _max?: StockTransferMaxAggregateInputType
  }

  export type StockTransferGroupByOutputType = {
    id: string
    fromWarehouse: string
    toWarehouse: string
    productId: string
    quantity: number
    reason: string | null
    status: string
    createdAt: Date
    _count: StockTransferCountAggregateOutputType | null
    _avg: StockTransferAvgAggregateOutputType | null
    _sum: StockTransferSumAggregateOutputType | null
    _min: StockTransferMinAggregateOutputType | null
    _max: StockTransferMaxAggregateOutputType | null
  }

  type GetStockTransferGroupByPayload<T extends StockTransferGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockTransferGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockTransferGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockTransferGroupByOutputType[P]>
            : GetScalarType<T[P], StockTransferGroupByOutputType[P]>
        }
      >
    >


  export type StockTransferSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromWarehouse?: boolean
    toWarehouse?: boolean
    productId?: boolean
    quantity?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    from?: boolean | WarehouseDefaultArgs<ExtArgs>
    to?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockTransfer"]>

  export type StockTransferSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromWarehouse?: boolean
    toWarehouse?: boolean
    productId?: boolean
    quantity?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    from?: boolean | WarehouseDefaultArgs<ExtArgs>
    to?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockTransfer"]>

  export type StockTransferSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromWarehouse?: boolean
    toWarehouse?: boolean
    productId?: boolean
    quantity?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    from?: boolean | WarehouseDefaultArgs<ExtArgs>
    to?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockTransfer"]>

  export type StockTransferSelectScalar = {
    id?: boolean
    fromWarehouse?: boolean
    toWarehouse?: boolean
    productId?: boolean
    quantity?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type StockTransferOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fromWarehouse" | "toWarehouse" | "productId" | "quantity" | "reason" | "status" | "createdAt", ExtArgs["result"]["stockTransfer"]>
  export type StockTransferInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    from?: boolean | WarehouseDefaultArgs<ExtArgs>
    to?: boolean | WarehouseDefaultArgs<ExtArgs>
  }
  export type StockTransferIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    from?: boolean | WarehouseDefaultArgs<ExtArgs>
    to?: boolean | WarehouseDefaultArgs<ExtArgs>
  }
  export type StockTransferIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    from?: boolean | WarehouseDefaultArgs<ExtArgs>
    to?: boolean | WarehouseDefaultArgs<ExtArgs>
  }

  export type $StockTransferPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockTransfer"
    objects: {
      from: Prisma.$WarehousePayload<ExtArgs>
      to: Prisma.$WarehousePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fromWarehouse: string
      toWarehouse: string
      productId: string
      quantity: number
      reason: string | null
      status: string
      createdAt: Date
    }, ExtArgs["result"]["stockTransfer"]>
    composites: {}
  }

  type StockTransferGetPayload<S extends boolean | null | undefined | StockTransferDefaultArgs> = $Result.GetResult<Prisma.$StockTransferPayload, S>

  type StockTransferCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockTransferFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockTransferCountAggregateInputType | true
    }

  export interface StockTransferDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockTransfer'], meta: { name: 'StockTransfer' } }
    /**
     * Find zero or one StockTransfer that matches the filter.
     * @param {StockTransferFindUniqueArgs} args - Arguments to find a StockTransfer
     * @example
     * // Get one StockTransfer
     * const stockTransfer = await prisma.stockTransfer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockTransferFindUniqueArgs>(args: SelectSubset<T, StockTransferFindUniqueArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockTransfer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockTransferFindUniqueOrThrowArgs} args - Arguments to find a StockTransfer
     * @example
     * // Get one StockTransfer
     * const stockTransfer = await prisma.stockTransfer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockTransferFindUniqueOrThrowArgs>(args: SelectSubset<T, StockTransferFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockTransfer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockTransferFindFirstArgs} args - Arguments to find a StockTransfer
     * @example
     * // Get one StockTransfer
     * const stockTransfer = await prisma.stockTransfer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockTransferFindFirstArgs>(args?: SelectSubset<T, StockTransferFindFirstArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockTransfer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockTransferFindFirstOrThrowArgs} args - Arguments to find a StockTransfer
     * @example
     * // Get one StockTransfer
     * const stockTransfer = await prisma.stockTransfer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockTransferFindFirstOrThrowArgs>(args?: SelectSubset<T, StockTransferFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockTransfers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockTransferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockTransfers
     * const stockTransfers = await prisma.stockTransfer.findMany()
     * 
     * // Get first 10 StockTransfers
     * const stockTransfers = await prisma.stockTransfer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockTransferWithIdOnly = await prisma.stockTransfer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockTransferFindManyArgs>(args?: SelectSubset<T, StockTransferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockTransfer.
     * @param {StockTransferCreateArgs} args - Arguments to create a StockTransfer.
     * @example
     * // Create one StockTransfer
     * const StockTransfer = await prisma.stockTransfer.create({
     *   data: {
     *     // ... data to create a StockTransfer
     *   }
     * })
     * 
     */
    create<T extends StockTransferCreateArgs>(args: SelectSubset<T, StockTransferCreateArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockTransfers.
     * @param {StockTransferCreateManyArgs} args - Arguments to create many StockTransfers.
     * @example
     * // Create many StockTransfers
     * const stockTransfer = await prisma.stockTransfer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockTransferCreateManyArgs>(args?: SelectSubset<T, StockTransferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockTransfers and returns the data saved in the database.
     * @param {StockTransferCreateManyAndReturnArgs} args - Arguments to create many StockTransfers.
     * @example
     * // Create many StockTransfers
     * const stockTransfer = await prisma.stockTransfer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockTransfers and only return the `id`
     * const stockTransferWithIdOnly = await prisma.stockTransfer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockTransferCreateManyAndReturnArgs>(args?: SelectSubset<T, StockTransferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StockTransfer.
     * @param {StockTransferDeleteArgs} args - Arguments to delete one StockTransfer.
     * @example
     * // Delete one StockTransfer
     * const StockTransfer = await prisma.stockTransfer.delete({
     *   where: {
     *     // ... filter to delete one StockTransfer
     *   }
     * })
     * 
     */
    delete<T extends StockTransferDeleteArgs>(args: SelectSubset<T, StockTransferDeleteArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockTransfer.
     * @param {StockTransferUpdateArgs} args - Arguments to update one StockTransfer.
     * @example
     * // Update one StockTransfer
     * const stockTransfer = await prisma.stockTransfer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockTransferUpdateArgs>(args: SelectSubset<T, StockTransferUpdateArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockTransfers.
     * @param {StockTransferDeleteManyArgs} args - Arguments to filter StockTransfers to delete.
     * @example
     * // Delete a few StockTransfers
     * const { count } = await prisma.stockTransfer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockTransferDeleteManyArgs>(args?: SelectSubset<T, StockTransferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockTransfers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockTransferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockTransfers
     * const stockTransfer = await prisma.stockTransfer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockTransferUpdateManyArgs>(args: SelectSubset<T, StockTransferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockTransfers and returns the data updated in the database.
     * @param {StockTransferUpdateManyAndReturnArgs} args - Arguments to update many StockTransfers.
     * @example
     * // Update many StockTransfers
     * const stockTransfer = await prisma.stockTransfer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StockTransfers and only return the `id`
     * const stockTransferWithIdOnly = await prisma.stockTransfer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StockTransferUpdateManyAndReturnArgs>(args: SelectSubset<T, StockTransferUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StockTransfer.
     * @param {StockTransferUpsertArgs} args - Arguments to update or create a StockTransfer.
     * @example
     * // Update or create a StockTransfer
     * const stockTransfer = await prisma.stockTransfer.upsert({
     *   create: {
     *     // ... data to create a StockTransfer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockTransfer we want to update
     *   }
     * })
     */
    upsert<T extends StockTransferUpsertArgs>(args: SelectSubset<T, StockTransferUpsertArgs<ExtArgs>>): Prisma__StockTransferClient<$Result.GetResult<Prisma.$StockTransferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockTransfers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockTransferCountArgs} args - Arguments to filter StockTransfers to count.
     * @example
     * // Count the number of StockTransfers
     * const count = await prisma.stockTransfer.count({
     *   where: {
     *     // ... the filter for the StockTransfers we want to count
     *   }
     * })
    **/
    count<T extends StockTransferCountArgs>(
      args?: Subset<T, StockTransferCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockTransferCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockTransfer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockTransferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StockTransferAggregateArgs>(args: Subset<T, StockTransferAggregateArgs>): Prisma.PrismaPromise<GetStockTransferAggregateType<T>>

    /**
     * Group by StockTransfer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockTransferGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StockTransferGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockTransferGroupByArgs['orderBy'] }
        : { orderBy?: StockTransferGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StockTransferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockTransferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockTransfer model
   */
  readonly fields: StockTransferFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockTransfer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockTransferClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    from<T extends WarehouseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WarehouseDefaultArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    to<T extends WarehouseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WarehouseDefaultArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StockTransfer model
   */
  interface StockTransferFieldRefs {
    readonly id: FieldRef<"StockTransfer", 'String'>
    readonly fromWarehouse: FieldRef<"StockTransfer", 'String'>
    readonly toWarehouse: FieldRef<"StockTransfer", 'String'>
    readonly productId: FieldRef<"StockTransfer", 'String'>
    readonly quantity: FieldRef<"StockTransfer", 'Int'>
    readonly reason: FieldRef<"StockTransfer", 'String'>
    readonly status: FieldRef<"StockTransfer", 'String'>
    readonly createdAt: FieldRef<"StockTransfer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StockTransfer findUnique
   */
  export type StockTransferFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * Filter, which StockTransfer to fetch.
     */
    where: StockTransferWhereUniqueInput
  }

  /**
   * StockTransfer findUniqueOrThrow
   */
  export type StockTransferFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * Filter, which StockTransfer to fetch.
     */
    where: StockTransferWhereUniqueInput
  }

  /**
   * StockTransfer findFirst
   */
  export type StockTransferFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * Filter, which StockTransfer to fetch.
     */
    where?: StockTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockTransfers to fetch.
     */
    orderBy?: StockTransferOrderByWithRelationInput | StockTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockTransfers.
     */
    cursor?: StockTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockTransfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockTransfers.
     */
    distinct?: StockTransferScalarFieldEnum | StockTransferScalarFieldEnum[]
  }

  /**
   * StockTransfer findFirstOrThrow
   */
  export type StockTransferFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * Filter, which StockTransfer to fetch.
     */
    where?: StockTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockTransfers to fetch.
     */
    orderBy?: StockTransferOrderByWithRelationInput | StockTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockTransfers.
     */
    cursor?: StockTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockTransfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockTransfers.
     */
    distinct?: StockTransferScalarFieldEnum | StockTransferScalarFieldEnum[]
  }

  /**
   * StockTransfer findMany
   */
  export type StockTransferFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * Filter, which StockTransfers to fetch.
     */
    where?: StockTransferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockTransfers to fetch.
     */
    orderBy?: StockTransferOrderByWithRelationInput | StockTransferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockTransfers.
     */
    cursor?: StockTransferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockTransfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockTransfers.
     */
    skip?: number
    distinct?: StockTransferScalarFieldEnum | StockTransferScalarFieldEnum[]
  }

  /**
   * StockTransfer create
   */
  export type StockTransferCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * The data needed to create a StockTransfer.
     */
    data: XOR<StockTransferCreateInput, StockTransferUncheckedCreateInput>
  }

  /**
   * StockTransfer createMany
   */
  export type StockTransferCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockTransfers.
     */
    data: StockTransferCreateManyInput | StockTransferCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockTransfer createManyAndReturn
   */
  export type StockTransferCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * The data used to create many StockTransfers.
     */
    data: StockTransferCreateManyInput | StockTransferCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockTransfer update
   */
  export type StockTransferUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * The data needed to update a StockTransfer.
     */
    data: XOR<StockTransferUpdateInput, StockTransferUncheckedUpdateInput>
    /**
     * Choose, which StockTransfer to update.
     */
    where: StockTransferWhereUniqueInput
  }

  /**
   * StockTransfer updateMany
   */
  export type StockTransferUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockTransfers.
     */
    data: XOR<StockTransferUpdateManyMutationInput, StockTransferUncheckedUpdateManyInput>
    /**
     * Filter which StockTransfers to update
     */
    where?: StockTransferWhereInput
    /**
     * Limit how many StockTransfers to update.
     */
    limit?: number
  }

  /**
   * StockTransfer updateManyAndReturn
   */
  export type StockTransferUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * The data used to update StockTransfers.
     */
    data: XOR<StockTransferUpdateManyMutationInput, StockTransferUncheckedUpdateManyInput>
    /**
     * Filter which StockTransfers to update
     */
    where?: StockTransferWhereInput
    /**
     * Limit how many StockTransfers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockTransfer upsert
   */
  export type StockTransferUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * The filter to search for the StockTransfer to update in case it exists.
     */
    where: StockTransferWhereUniqueInput
    /**
     * In case the StockTransfer found by the `where` argument doesn't exist, create a new StockTransfer with this data.
     */
    create: XOR<StockTransferCreateInput, StockTransferUncheckedCreateInput>
    /**
     * In case the StockTransfer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockTransferUpdateInput, StockTransferUncheckedUpdateInput>
  }

  /**
   * StockTransfer delete
   */
  export type StockTransferDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
    /**
     * Filter which StockTransfer to delete.
     */
    where: StockTransferWhereUniqueInput
  }

  /**
   * StockTransfer deleteMany
   */
  export type StockTransferDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockTransfers to delete
     */
    where?: StockTransferWhereInput
    /**
     * Limit how many StockTransfers to delete.
     */
    limit?: number
  }

  /**
   * StockTransfer without action
   */
  export type StockTransferDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockTransfer
     */
    select?: StockTransferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockTransfer
     */
    omit?: StockTransferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockTransferInclude<ExtArgs> | null
  }


  /**
   * Model Lead
   */

  export type AggregateLead = {
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  export type LeadAvgAggregateOutputType = {
    budget: Decimal | null
  }

  export type LeadSumAggregateOutputType = {
    budget: Decimal | null
  }

  export type LeadMinAggregateOutputType = {
    id: string | null
    name: string | null
    company: string | null
    email: string | null
    businessType: string | null
    budget: Decimal | null
    targetDate: Date | null
    stage: $Enums.CrmStage | null
    createdAt: Date | null
  }

  export type LeadMaxAggregateOutputType = {
    id: string | null
    name: string | null
    company: string | null
    email: string | null
    businessType: string | null
    budget: Decimal | null
    targetDate: Date | null
    stage: $Enums.CrmStage | null
    createdAt: Date | null
  }

  export type LeadCountAggregateOutputType = {
    id: number
    name: number
    company: number
    email: number
    businessType: number
    budget: number
    targetDate: number
    stage: number
    createdAt: number
    _all: number
  }


  export type LeadAvgAggregateInputType = {
    budget?: true
  }

  export type LeadSumAggregateInputType = {
    budget?: true
  }

  export type LeadMinAggregateInputType = {
    id?: true
    name?: true
    company?: true
    email?: true
    businessType?: true
    budget?: true
    targetDate?: true
    stage?: true
    createdAt?: true
  }

  export type LeadMaxAggregateInputType = {
    id?: true
    name?: true
    company?: true
    email?: true
    businessType?: true
    budget?: true
    targetDate?: true
    stage?: true
    createdAt?: true
  }

  export type LeadCountAggregateInputType = {
    id?: true
    name?: true
    company?: true
    email?: true
    businessType?: true
    budget?: true
    targetDate?: true
    stage?: true
    createdAt?: true
    _all?: true
  }

  export type LeadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lead to aggregate.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leads
    **/
    _count?: true | LeadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeadMaxAggregateInputType
  }

  export type GetLeadAggregateType<T extends LeadAggregateArgs> = {
        [P in keyof T & keyof AggregateLead]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLead[P]>
      : GetScalarType<T[P], AggregateLead[P]>
  }




  export type LeadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithAggregationInput | LeadOrderByWithAggregationInput[]
    by: LeadScalarFieldEnum[] | LeadScalarFieldEnum
    having?: LeadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeadCountAggregateInputType | true
    _avg?: LeadAvgAggregateInputType
    _sum?: LeadSumAggregateInputType
    _min?: LeadMinAggregateInputType
    _max?: LeadMaxAggregateInputType
  }

  export type LeadGroupByOutputType = {
    id: string
    name: string
    company: string
    email: string
    businessType: string
    budget: Decimal
    targetDate: Date | null
    stage: $Enums.CrmStage
    createdAt: Date
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  type GetLeadGroupByPayload<T extends LeadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeadGroupByOutputType[P]>
            : GetScalarType<T[P], LeadGroupByOutputType[P]>
        }
      >
    >


  export type LeadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    company?: boolean
    email?: boolean
    businessType?: boolean
    budget?: boolean
    targetDate?: boolean
    stage?: boolean
    createdAt?: boolean
    quotations?: boolean | Lead$quotationsArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    company?: boolean
    email?: boolean
    businessType?: boolean
    budget?: boolean
    targetDate?: boolean
    stage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    company?: boolean
    email?: boolean
    businessType?: boolean
    budget?: boolean
    targetDate?: boolean
    stage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectScalar = {
    id?: boolean
    name?: boolean
    company?: boolean
    email?: boolean
    businessType?: boolean
    budget?: boolean
    targetDate?: boolean
    stage?: boolean
    createdAt?: boolean
  }

  export type LeadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "company" | "email" | "businessType" | "budget" | "targetDate" | "stage" | "createdAt", ExtArgs["result"]["lead"]>
  export type LeadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotations?: boolean | Lead$quotationsArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LeadIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LeadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lead"
    objects: {
      quotations: Prisma.$QuotationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      company: string
      email: string
      businessType: string
      budget: Prisma.Decimal
      targetDate: Date | null
      stage: $Enums.CrmStage
      createdAt: Date
    }, ExtArgs["result"]["lead"]>
    composites: {}
  }

  type LeadGetPayload<S extends boolean | null | undefined | LeadDefaultArgs> = $Result.GetResult<Prisma.$LeadPayload, S>

  type LeadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeadCountAggregateInputType | true
    }

  export interface LeadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lead'], meta: { name: 'Lead' } }
    /**
     * Find zero or one Lead that matches the filter.
     * @param {LeadFindUniqueArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeadFindUniqueArgs>(args: SelectSubset<T, LeadFindUniqueArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lead that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeadFindUniqueOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeadFindUniqueOrThrowArgs>(args: SelectSubset<T, LeadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeadFindFirstArgs>(args?: SelectSubset<T, LeadFindFirstArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeadFindFirstOrThrowArgs>(args?: SelectSubset<T, LeadFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Leads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leads
     * const leads = await prisma.lead.findMany()
     * 
     * // Get first 10 Leads
     * const leads = await prisma.lead.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leadWithIdOnly = await prisma.lead.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeadFindManyArgs>(args?: SelectSubset<T, LeadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lead.
     * @param {LeadCreateArgs} args - Arguments to create a Lead.
     * @example
     * // Create one Lead
     * const Lead = await prisma.lead.create({
     *   data: {
     *     // ... data to create a Lead
     *   }
     * })
     * 
     */
    create<T extends LeadCreateArgs>(args: SelectSubset<T, LeadCreateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Leads.
     * @param {LeadCreateManyArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeadCreateManyArgs>(args?: SelectSubset<T, LeadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leads and returns the data saved in the database.
     * @param {LeadCreateManyAndReturnArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeadCreateManyAndReturnArgs>(args?: SelectSubset<T, LeadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lead.
     * @param {LeadDeleteArgs} args - Arguments to delete one Lead.
     * @example
     * // Delete one Lead
     * const Lead = await prisma.lead.delete({
     *   where: {
     *     // ... filter to delete one Lead
     *   }
     * })
     * 
     */
    delete<T extends LeadDeleteArgs>(args: SelectSubset<T, LeadDeleteArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lead.
     * @param {LeadUpdateArgs} args - Arguments to update one Lead.
     * @example
     * // Update one Lead
     * const lead = await prisma.lead.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeadUpdateArgs>(args: SelectSubset<T, LeadUpdateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Leads.
     * @param {LeadDeleteManyArgs} args - Arguments to filter Leads to delete.
     * @example
     * // Delete a few Leads
     * const { count } = await prisma.lead.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeadDeleteManyArgs>(args?: SelectSubset<T, LeadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeadUpdateManyArgs>(args: SelectSubset<T, LeadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads and returns the data updated in the database.
     * @param {LeadUpdateManyAndReturnArgs} args - Arguments to update many Leads.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeadUpdateManyAndReturnArgs>(args: SelectSubset<T, LeadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lead.
     * @param {LeadUpsertArgs} args - Arguments to update or create a Lead.
     * @example
     * // Update or create a Lead
     * const lead = await prisma.lead.upsert({
     *   create: {
     *     // ... data to create a Lead
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lead we want to update
     *   }
     * })
     */
    upsert<T extends LeadUpsertArgs>(args: SelectSubset<T, LeadUpsertArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadCountArgs} args - Arguments to filter Leads to count.
     * @example
     * // Count the number of Leads
     * const count = await prisma.lead.count({
     *   where: {
     *     // ... the filter for the Leads we want to count
     *   }
     * })
    **/
    count<T extends LeadCountArgs>(
      args?: Subset<T, LeadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeadAggregateArgs>(args: Subset<T, LeadAggregateArgs>): Prisma.PrismaPromise<GetLeadAggregateType<T>>

    /**
     * Group by Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeadGroupByArgs['orderBy'] }
        : { orderBy?: LeadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lead model
   */
  readonly fields: LeadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lead.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quotations<T extends Lead$quotationsArgs<ExtArgs> = {}>(args?: Subset<T, Lead$quotationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lead model
   */
  interface LeadFieldRefs {
    readonly id: FieldRef<"Lead", 'String'>
    readonly name: FieldRef<"Lead", 'String'>
    readonly company: FieldRef<"Lead", 'String'>
    readonly email: FieldRef<"Lead", 'String'>
    readonly businessType: FieldRef<"Lead", 'String'>
    readonly budget: FieldRef<"Lead", 'Decimal'>
    readonly targetDate: FieldRef<"Lead", 'DateTime'>
    readonly stage: FieldRef<"Lead", 'CrmStage'>
    readonly createdAt: FieldRef<"Lead", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Lead findUnique
   */
  export type LeadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findUniqueOrThrow
   */
  export type LeadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findFirst
   */
  export type LeadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findFirstOrThrow
   */
  export type LeadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findMany
   */
  export type LeadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Leads to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead create
   */
  export type LeadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to create a Lead.
     */
    data: XOR<LeadCreateInput, LeadUncheckedCreateInput>
  }

  /**
   * Lead createMany
   */
  export type LeadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lead createManyAndReturn
   */
  export type LeadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lead update
   */
  export type LeadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to update a Lead.
     */
    data: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
    /**
     * Choose, which Lead to update.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead updateMany
   */
  export type LeadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
  }

  /**
   * Lead updateManyAndReturn
   */
  export type LeadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
  }

  /**
   * Lead upsert
   */
  export type LeadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The filter to search for the Lead to update in case it exists.
     */
    where: LeadWhereUniqueInput
    /**
     * In case the Lead found by the `where` argument doesn't exist, create a new Lead with this data.
     */
    create: XOR<LeadCreateInput, LeadUncheckedCreateInput>
    /**
     * In case the Lead was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
  }

  /**
   * Lead delete
   */
  export type LeadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter which Lead to delete.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead deleteMany
   */
  export type LeadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leads to delete
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to delete.
     */
    limit?: number
  }

  /**
   * Lead.quotations
   */
  export type Lead$quotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    where?: QuotationWhereInput
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    cursor?: QuotationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Lead without action
   */
  export type LeadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
  }


  /**
   * Model Quotation
   */

  export type AggregateQuotation = {
    _count: QuotationCountAggregateOutputType | null
    _avg: QuotationAvgAggregateOutputType | null
    _sum: QuotationSumAggregateOutputType | null
    _min: QuotationMinAggregateOutputType | null
    _max: QuotationMaxAggregateOutputType | null
  }

  export type QuotationAvgAggregateOutputType = {
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
  }

  export type QuotationSumAggregateOutputType = {
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
  }

  export type QuotationMinAggregateOutputType = {
    id: string | null
    quoteNumber: string | null
    leadId: string | null
    clientName: string | null
    clientEmail: string | null
    status: $Enums.QuotationStatus | null
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuotationMaxAggregateOutputType = {
    id: string | null
    quoteNumber: string | null
    leadId: string | null
    clientName: string | null
    clientEmail: string | null
    status: $Enums.QuotationStatus | null
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuotationCountAggregateOutputType = {
    id: number
    quoteNumber: number
    leadId: number
    clientName: number
    clientEmail: number
    status: number
    subtotal: number
    vatAmount: number
    total: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuotationAvgAggregateInputType = {
    subtotal?: true
    vatAmount?: true
    total?: true
  }

  export type QuotationSumAggregateInputType = {
    subtotal?: true
    vatAmount?: true
    total?: true
  }

  export type QuotationMinAggregateInputType = {
    id?: true
    quoteNumber?: true
    leadId?: true
    clientName?: true
    clientEmail?: true
    status?: true
    subtotal?: true
    vatAmount?: true
    total?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuotationMaxAggregateInputType = {
    id?: true
    quoteNumber?: true
    leadId?: true
    clientName?: true
    clientEmail?: true
    status?: true
    subtotal?: true
    vatAmount?: true
    total?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuotationCountAggregateInputType = {
    id?: true
    quoteNumber?: true
    leadId?: true
    clientName?: true
    clientEmail?: true
    status?: true
    subtotal?: true
    vatAmount?: true
    total?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuotationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quotation to aggregate.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quotations
    **/
    _count?: true | QuotationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuotationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuotationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuotationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuotationMaxAggregateInputType
  }

  export type GetQuotationAggregateType<T extends QuotationAggregateArgs> = {
        [P in keyof T & keyof AggregateQuotation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuotation[P]>
      : GetScalarType<T[P], AggregateQuotation[P]>
  }




  export type QuotationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationWhereInput
    orderBy?: QuotationOrderByWithAggregationInput | QuotationOrderByWithAggregationInput[]
    by: QuotationScalarFieldEnum[] | QuotationScalarFieldEnum
    having?: QuotationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuotationCountAggregateInputType | true
    _avg?: QuotationAvgAggregateInputType
    _sum?: QuotationSumAggregateInputType
    _min?: QuotationMinAggregateInputType
    _max?: QuotationMaxAggregateInputType
  }

  export type QuotationGroupByOutputType = {
    id: string
    quoteNumber: string
    leadId: string
    clientName: string
    clientEmail: string
    status: $Enums.QuotationStatus
    subtotal: Decimal
    vatAmount: Decimal
    total: Decimal
    createdAt: Date
    updatedAt: Date
    _count: QuotationCountAggregateOutputType | null
    _avg: QuotationAvgAggregateOutputType | null
    _sum: QuotationSumAggregateOutputType | null
    _min: QuotationMinAggregateOutputType | null
    _max: QuotationMaxAggregateOutputType | null
  }

  type GetQuotationGroupByPayload<T extends QuotationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuotationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuotationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuotationGroupByOutputType[P]>
            : GetScalarType<T[P], QuotationGroupByOutputType[P]>
        }
      >
    >


  export type QuotationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quoteNumber?: boolean
    leadId?: boolean
    clientName?: boolean
    clientEmail?: boolean
    status?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    lineItems?: boolean | Quotation$lineItemsArgs<ExtArgs>
    order?: boolean | Quotation$orderArgs<ExtArgs>
    _count?: boolean | QuotationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quotation"]>

  export type QuotationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quoteNumber?: boolean
    leadId?: boolean
    clientName?: boolean
    clientEmail?: boolean
    status?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quotation"]>

  export type QuotationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quoteNumber?: boolean
    leadId?: boolean
    clientName?: boolean
    clientEmail?: boolean
    status?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quotation"]>

  export type QuotationSelectScalar = {
    id?: boolean
    quoteNumber?: boolean
    leadId?: boolean
    clientName?: boolean
    clientEmail?: boolean
    status?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuotationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "quoteNumber" | "leadId" | "clientName" | "clientEmail" | "status" | "subtotal" | "vatAmount" | "total" | "createdAt" | "updatedAt", ExtArgs["result"]["quotation"]>
  export type QuotationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    lineItems?: boolean | Quotation$lineItemsArgs<ExtArgs>
    order?: boolean | Quotation$orderArgs<ExtArgs>
    _count?: boolean | QuotationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuotationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type QuotationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }

  export type $QuotationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quotation"
    objects: {
      lead: Prisma.$LeadPayload<ExtArgs>
      lineItems: Prisma.$QuotationLineItemPayload<ExtArgs>[]
      order: Prisma.$OrderPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      quoteNumber: string
      leadId: string
      clientName: string
      clientEmail: string
      status: $Enums.QuotationStatus
      subtotal: Prisma.Decimal
      vatAmount: Prisma.Decimal
      total: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["quotation"]>
    composites: {}
  }

  type QuotationGetPayload<S extends boolean | null | undefined | QuotationDefaultArgs> = $Result.GetResult<Prisma.$QuotationPayload, S>

  type QuotationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuotationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuotationCountAggregateInputType | true
    }

  export interface QuotationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quotation'], meta: { name: 'Quotation' } }
    /**
     * Find zero or one Quotation that matches the filter.
     * @param {QuotationFindUniqueArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuotationFindUniqueArgs>(args: SelectSubset<T, QuotationFindUniqueArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Quotation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuotationFindUniqueOrThrowArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuotationFindUniqueOrThrowArgs>(args: SelectSubset<T, QuotationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quotation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationFindFirstArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuotationFindFirstArgs>(args?: SelectSubset<T, QuotationFindFirstArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quotation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationFindFirstOrThrowArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuotationFindFirstOrThrowArgs>(args?: SelectSubset<T, QuotationFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Quotations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quotations
     * const quotations = await prisma.quotation.findMany()
     * 
     * // Get first 10 Quotations
     * const quotations = await prisma.quotation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quotationWithIdOnly = await prisma.quotation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuotationFindManyArgs>(args?: SelectSubset<T, QuotationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Quotation.
     * @param {QuotationCreateArgs} args - Arguments to create a Quotation.
     * @example
     * // Create one Quotation
     * const Quotation = await prisma.quotation.create({
     *   data: {
     *     // ... data to create a Quotation
     *   }
     * })
     * 
     */
    create<T extends QuotationCreateArgs>(args: SelectSubset<T, QuotationCreateArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Quotations.
     * @param {QuotationCreateManyArgs} args - Arguments to create many Quotations.
     * @example
     * // Create many Quotations
     * const quotation = await prisma.quotation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuotationCreateManyArgs>(args?: SelectSubset<T, QuotationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Quotations and returns the data saved in the database.
     * @param {QuotationCreateManyAndReturnArgs} args - Arguments to create many Quotations.
     * @example
     * // Create many Quotations
     * const quotation = await prisma.quotation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Quotations and only return the `id`
     * const quotationWithIdOnly = await prisma.quotation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuotationCreateManyAndReturnArgs>(args?: SelectSubset<T, QuotationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Quotation.
     * @param {QuotationDeleteArgs} args - Arguments to delete one Quotation.
     * @example
     * // Delete one Quotation
     * const Quotation = await prisma.quotation.delete({
     *   where: {
     *     // ... filter to delete one Quotation
     *   }
     * })
     * 
     */
    delete<T extends QuotationDeleteArgs>(args: SelectSubset<T, QuotationDeleteArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Quotation.
     * @param {QuotationUpdateArgs} args - Arguments to update one Quotation.
     * @example
     * // Update one Quotation
     * const quotation = await prisma.quotation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuotationUpdateArgs>(args: SelectSubset<T, QuotationUpdateArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Quotations.
     * @param {QuotationDeleteManyArgs} args - Arguments to filter Quotations to delete.
     * @example
     * // Delete a few Quotations
     * const { count } = await prisma.quotation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuotationDeleteManyArgs>(args?: SelectSubset<T, QuotationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quotations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quotations
     * const quotation = await prisma.quotation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuotationUpdateManyArgs>(args: SelectSubset<T, QuotationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quotations and returns the data updated in the database.
     * @param {QuotationUpdateManyAndReturnArgs} args - Arguments to update many Quotations.
     * @example
     * // Update many Quotations
     * const quotation = await prisma.quotation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Quotations and only return the `id`
     * const quotationWithIdOnly = await prisma.quotation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuotationUpdateManyAndReturnArgs>(args: SelectSubset<T, QuotationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Quotation.
     * @param {QuotationUpsertArgs} args - Arguments to update or create a Quotation.
     * @example
     * // Update or create a Quotation
     * const quotation = await prisma.quotation.upsert({
     *   create: {
     *     // ... data to create a Quotation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quotation we want to update
     *   }
     * })
     */
    upsert<T extends QuotationUpsertArgs>(args: SelectSubset<T, QuotationUpsertArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Quotations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationCountArgs} args - Arguments to filter Quotations to count.
     * @example
     * // Count the number of Quotations
     * const count = await prisma.quotation.count({
     *   where: {
     *     // ... the filter for the Quotations we want to count
     *   }
     * })
    **/
    count<T extends QuotationCountArgs>(
      args?: Subset<T, QuotationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuotationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quotation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuotationAggregateArgs>(args: Subset<T, QuotationAggregateArgs>): Prisma.PrismaPromise<GetQuotationAggregateType<T>>

    /**
     * Group by Quotation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuotationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuotationGroupByArgs['orderBy'] }
        : { orderBy?: QuotationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuotationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuotationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quotation model
   */
  readonly fields: QuotationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quotation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuotationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lead<T extends LeadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeadDefaultArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lineItems<T extends Quotation$lineItemsArgs<ExtArgs> = {}>(args?: Subset<T, Quotation$lineItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    order<T extends Quotation$orderArgs<ExtArgs> = {}>(args?: Subset<T, Quotation$orderArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quotation model
   */
  interface QuotationFieldRefs {
    readonly id: FieldRef<"Quotation", 'String'>
    readonly quoteNumber: FieldRef<"Quotation", 'String'>
    readonly leadId: FieldRef<"Quotation", 'String'>
    readonly clientName: FieldRef<"Quotation", 'String'>
    readonly clientEmail: FieldRef<"Quotation", 'String'>
    readonly status: FieldRef<"Quotation", 'QuotationStatus'>
    readonly subtotal: FieldRef<"Quotation", 'Decimal'>
    readonly vatAmount: FieldRef<"Quotation", 'Decimal'>
    readonly total: FieldRef<"Quotation", 'Decimal'>
    readonly createdAt: FieldRef<"Quotation", 'DateTime'>
    readonly updatedAt: FieldRef<"Quotation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Quotation findUnique
   */
  export type QuotationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation findUniqueOrThrow
   */
  export type QuotationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation findFirst
   */
  export type QuotationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotations.
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotations.
     */
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Quotation findFirstOrThrow
   */
  export type QuotationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotations.
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotations.
     */
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Quotation findMany
   */
  export type QuotationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotations to fetch.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quotations.
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Quotation create
   */
  export type QuotationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * The data needed to create a Quotation.
     */
    data: XOR<QuotationCreateInput, QuotationUncheckedCreateInput>
  }

  /**
   * Quotation createMany
   */
  export type QuotationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quotations.
     */
    data: QuotationCreateManyInput | QuotationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Quotation createManyAndReturn
   */
  export type QuotationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * The data used to create many Quotations.
     */
    data: QuotationCreateManyInput | QuotationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quotation update
   */
  export type QuotationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * The data needed to update a Quotation.
     */
    data: XOR<QuotationUpdateInput, QuotationUncheckedUpdateInput>
    /**
     * Choose, which Quotation to update.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation updateMany
   */
  export type QuotationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quotations.
     */
    data: XOR<QuotationUpdateManyMutationInput, QuotationUncheckedUpdateManyInput>
    /**
     * Filter which Quotations to update
     */
    where?: QuotationWhereInput
    /**
     * Limit how many Quotations to update.
     */
    limit?: number
  }

  /**
   * Quotation updateManyAndReturn
   */
  export type QuotationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * The data used to update Quotations.
     */
    data: XOR<QuotationUpdateManyMutationInput, QuotationUncheckedUpdateManyInput>
    /**
     * Filter which Quotations to update
     */
    where?: QuotationWhereInput
    /**
     * Limit how many Quotations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quotation upsert
   */
  export type QuotationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * The filter to search for the Quotation to update in case it exists.
     */
    where: QuotationWhereUniqueInput
    /**
     * In case the Quotation found by the `where` argument doesn't exist, create a new Quotation with this data.
     */
    create: XOR<QuotationCreateInput, QuotationUncheckedCreateInput>
    /**
     * In case the Quotation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuotationUpdateInput, QuotationUncheckedUpdateInput>
  }

  /**
   * Quotation delete
   */
  export type QuotationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter which Quotation to delete.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation deleteMany
   */
  export type QuotationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quotations to delete
     */
    where?: QuotationWhereInput
    /**
     * Limit how many Quotations to delete.
     */
    limit?: number
  }

  /**
   * Quotation.lineItems
   */
  export type Quotation$lineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    where?: QuotationLineItemWhereInput
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    cursor?: QuotationLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * Quotation.order
   */
  export type Quotation$orderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
  }

  /**
   * Quotation without action
   */
  export type QuotationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
  }


  /**
   * Model QuotationLineItem
   */

  export type AggregateQuotationLineItem = {
    _count: QuotationLineItemCountAggregateOutputType | null
    _avg: QuotationLineItemAvgAggregateOutputType | null
    _sum: QuotationLineItemSumAggregateOutputType | null
    _min: QuotationLineItemMinAggregateOutputType | null
    _max: QuotationLineItemMaxAggregateOutputType | null
  }

  export type QuotationLineItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
    total: Decimal | null
  }

  export type QuotationLineItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
    total: Decimal | null
  }

  export type QuotationLineItemMinAggregateOutputType = {
    id: string | null
    quotationId: string | null
    productId: string | null
    productName: string | null
    quantity: number | null
    unitPrice: Decimal | null
    dimensions: string | null
    finish: string | null
    total: Decimal | null
  }

  export type QuotationLineItemMaxAggregateOutputType = {
    id: string | null
    quotationId: string | null
    productId: string | null
    productName: string | null
    quantity: number | null
    unitPrice: Decimal | null
    dimensions: string | null
    finish: string | null
    total: Decimal | null
  }

  export type QuotationLineItemCountAggregateOutputType = {
    id: number
    quotationId: number
    productId: number
    productName: number
    quantity: number
    unitPrice: number
    dimensions: number
    finish: number
    total: number
    _all: number
  }


  export type QuotationLineItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type QuotationLineItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    total?: true
  }

  export type QuotationLineItemMinAggregateInputType = {
    id?: true
    quotationId?: true
    productId?: true
    productName?: true
    quantity?: true
    unitPrice?: true
    dimensions?: true
    finish?: true
    total?: true
  }

  export type QuotationLineItemMaxAggregateInputType = {
    id?: true
    quotationId?: true
    productId?: true
    productName?: true
    quantity?: true
    unitPrice?: true
    dimensions?: true
    finish?: true
    total?: true
  }

  export type QuotationLineItemCountAggregateInputType = {
    id?: true
    quotationId?: true
    productId?: true
    productName?: true
    quantity?: true
    unitPrice?: true
    dimensions?: true
    finish?: true
    total?: true
    _all?: true
  }

  export type QuotationLineItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuotationLineItem to aggregate.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuotationLineItems
    **/
    _count?: true | QuotationLineItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuotationLineItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuotationLineItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuotationLineItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuotationLineItemMaxAggregateInputType
  }

  export type GetQuotationLineItemAggregateType<T extends QuotationLineItemAggregateArgs> = {
        [P in keyof T & keyof AggregateQuotationLineItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuotationLineItem[P]>
      : GetScalarType<T[P], AggregateQuotationLineItem[P]>
  }




  export type QuotationLineItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationLineItemWhereInput
    orderBy?: QuotationLineItemOrderByWithAggregationInput | QuotationLineItemOrderByWithAggregationInput[]
    by: QuotationLineItemScalarFieldEnum[] | QuotationLineItemScalarFieldEnum
    having?: QuotationLineItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuotationLineItemCountAggregateInputType | true
    _avg?: QuotationLineItemAvgAggregateInputType
    _sum?: QuotationLineItemSumAggregateInputType
    _min?: QuotationLineItemMinAggregateInputType
    _max?: QuotationLineItemMaxAggregateInputType
  }

  export type QuotationLineItemGroupByOutputType = {
    id: string
    quotationId: string
    productId: string
    productName: string
    quantity: number
    unitPrice: Decimal
    dimensions: string | null
    finish: string | null
    total: Decimal
    _count: QuotationLineItemCountAggregateOutputType | null
    _avg: QuotationLineItemAvgAggregateOutputType | null
    _sum: QuotationLineItemSumAggregateOutputType | null
    _min: QuotationLineItemMinAggregateOutputType | null
    _max: QuotationLineItemMaxAggregateOutputType | null
  }

  type GetQuotationLineItemGroupByPayload<T extends QuotationLineItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuotationLineItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuotationLineItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuotationLineItemGroupByOutputType[P]>
            : GetScalarType<T[P], QuotationLineItemGroupByOutputType[P]>
        }
      >
    >


  export type QuotationLineItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quotationId?: boolean
    productId?: boolean
    productName?: boolean
    quantity?: boolean
    unitPrice?: boolean
    dimensions?: boolean
    finish?: boolean
    total?: boolean
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quotationLineItem"]>

  export type QuotationLineItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quotationId?: boolean
    productId?: boolean
    productName?: boolean
    quantity?: boolean
    unitPrice?: boolean
    dimensions?: boolean
    finish?: boolean
    total?: boolean
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quotationLineItem"]>

  export type QuotationLineItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quotationId?: boolean
    productId?: boolean
    productName?: boolean
    quantity?: boolean
    unitPrice?: boolean
    dimensions?: boolean
    finish?: boolean
    total?: boolean
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quotationLineItem"]>

  export type QuotationLineItemSelectScalar = {
    id?: boolean
    quotationId?: boolean
    productId?: boolean
    productName?: boolean
    quantity?: boolean
    unitPrice?: boolean
    dimensions?: boolean
    finish?: boolean
    total?: boolean
  }

  export type QuotationLineItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "quotationId" | "productId" | "productName" | "quantity" | "unitPrice" | "dimensions" | "finish" | "total", ExtArgs["result"]["quotationLineItem"]>
  export type QuotationLineItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type QuotationLineItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type QuotationLineItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $QuotationLineItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuotationLineItem"
    objects: {
      quotation: Prisma.$QuotationPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      quotationId: string
      productId: string
      productName: string
      quantity: number
      unitPrice: Prisma.Decimal
      dimensions: string | null
      finish: string | null
      total: Prisma.Decimal
    }, ExtArgs["result"]["quotationLineItem"]>
    composites: {}
  }

  type QuotationLineItemGetPayload<S extends boolean | null | undefined | QuotationLineItemDefaultArgs> = $Result.GetResult<Prisma.$QuotationLineItemPayload, S>

  type QuotationLineItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuotationLineItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuotationLineItemCountAggregateInputType | true
    }

  export interface QuotationLineItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuotationLineItem'], meta: { name: 'QuotationLineItem' } }
    /**
     * Find zero or one QuotationLineItem that matches the filter.
     * @param {QuotationLineItemFindUniqueArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuotationLineItemFindUniqueArgs>(args: SelectSubset<T, QuotationLineItemFindUniqueArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuotationLineItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuotationLineItemFindUniqueOrThrowArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuotationLineItemFindUniqueOrThrowArgs>(args: SelectSubset<T, QuotationLineItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuotationLineItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemFindFirstArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuotationLineItemFindFirstArgs>(args?: SelectSubset<T, QuotationLineItemFindFirstArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuotationLineItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemFindFirstOrThrowArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuotationLineItemFindFirstOrThrowArgs>(args?: SelectSubset<T, QuotationLineItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuotationLineItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuotationLineItems
     * const quotationLineItems = await prisma.quotationLineItem.findMany()
     * 
     * // Get first 10 QuotationLineItems
     * const quotationLineItems = await prisma.quotationLineItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quotationLineItemWithIdOnly = await prisma.quotationLineItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuotationLineItemFindManyArgs>(args?: SelectSubset<T, QuotationLineItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuotationLineItem.
     * @param {QuotationLineItemCreateArgs} args - Arguments to create a QuotationLineItem.
     * @example
     * // Create one QuotationLineItem
     * const QuotationLineItem = await prisma.quotationLineItem.create({
     *   data: {
     *     // ... data to create a QuotationLineItem
     *   }
     * })
     * 
     */
    create<T extends QuotationLineItemCreateArgs>(args: SelectSubset<T, QuotationLineItemCreateArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuotationLineItems.
     * @param {QuotationLineItemCreateManyArgs} args - Arguments to create many QuotationLineItems.
     * @example
     * // Create many QuotationLineItems
     * const quotationLineItem = await prisma.quotationLineItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuotationLineItemCreateManyArgs>(args?: SelectSubset<T, QuotationLineItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuotationLineItems and returns the data saved in the database.
     * @param {QuotationLineItemCreateManyAndReturnArgs} args - Arguments to create many QuotationLineItems.
     * @example
     * // Create many QuotationLineItems
     * const quotationLineItem = await prisma.quotationLineItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuotationLineItems and only return the `id`
     * const quotationLineItemWithIdOnly = await prisma.quotationLineItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuotationLineItemCreateManyAndReturnArgs>(args?: SelectSubset<T, QuotationLineItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuotationLineItem.
     * @param {QuotationLineItemDeleteArgs} args - Arguments to delete one QuotationLineItem.
     * @example
     * // Delete one QuotationLineItem
     * const QuotationLineItem = await prisma.quotationLineItem.delete({
     *   where: {
     *     // ... filter to delete one QuotationLineItem
     *   }
     * })
     * 
     */
    delete<T extends QuotationLineItemDeleteArgs>(args: SelectSubset<T, QuotationLineItemDeleteArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuotationLineItem.
     * @param {QuotationLineItemUpdateArgs} args - Arguments to update one QuotationLineItem.
     * @example
     * // Update one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuotationLineItemUpdateArgs>(args: SelectSubset<T, QuotationLineItemUpdateArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuotationLineItems.
     * @param {QuotationLineItemDeleteManyArgs} args - Arguments to filter QuotationLineItems to delete.
     * @example
     * // Delete a few QuotationLineItems
     * const { count } = await prisma.quotationLineItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuotationLineItemDeleteManyArgs>(args?: SelectSubset<T, QuotationLineItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuotationLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuotationLineItems
     * const quotationLineItem = await prisma.quotationLineItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuotationLineItemUpdateManyArgs>(args: SelectSubset<T, QuotationLineItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuotationLineItems and returns the data updated in the database.
     * @param {QuotationLineItemUpdateManyAndReturnArgs} args - Arguments to update many QuotationLineItems.
     * @example
     * // Update many QuotationLineItems
     * const quotationLineItem = await prisma.quotationLineItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuotationLineItems and only return the `id`
     * const quotationLineItemWithIdOnly = await prisma.quotationLineItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuotationLineItemUpdateManyAndReturnArgs>(args: SelectSubset<T, QuotationLineItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuotationLineItem.
     * @param {QuotationLineItemUpsertArgs} args - Arguments to update or create a QuotationLineItem.
     * @example
     * // Update or create a QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.upsert({
     *   create: {
     *     // ... data to create a QuotationLineItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuotationLineItem we want to update
     *   }
     * })
     */
    upsert<T extends QuotationLineItemUpsertArgs>(args: SelectSubset<T, QuotationLineItemUpsertArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuotationLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemCountArgs} args - Arguments to filter QuotationLineItems to count.
     * @example
     * // Count the number of QuotationLineItems
     * const count = await prisma.quotationLineItem.count({
     *   where: {
     *     // ... the filter for the QuotationLineItems we want to count
     *   }
     * })
    **/
    count<T extends QuotationLineItemCountArgs>(
      args?: Subset<T, QuotationLineItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuotationLineItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuotationLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuotationLineItemAggregateArgs>(args: Subset<T, QuotationLineItemAggregateArgs>): Prisma.PrismaPromise<GetQuotationLineItemAggregateType<T>>

    /**
     * Group by QuotationLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuotationLineItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuotationLineItemGroupByArgs['orderBy'] }
        : { orderBy?: QuotationLineItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuotationLineItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuotationLineItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuotationLineItem model
   */
  readonly fields: QuotationLineItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuotationLineItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuotationLineItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quotation<T extends QuotationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuotationDefaultArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QuotationLineItem model
   */
  interface QuotationLineItemFieldRefs {
    readonly id: FieldRef<"QuotationLineItem", 'String'>
    readonly quotationId: FieldRef<"QuotationLineItem", 'String'>
    readonly productId: FieldRef<"QuotationLineItem", 'String'>
    readonly productName: FieldRef<"QuotationLineItem", 'String'>
    readonly quantity: FieldRef<"QuotationLineItem", 'Int'>
    readonly unitPrice: FieldRef<"QuotationLineItem", 'Decimal'>
    readonly dimensions: FieldRef<"QuotationLineItem", 'String'>
    readonly finish: FieldRef<"QuotationLineItem", 'String'>
    readonly total: FieldRef<"QuotationLineItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * QuotationLineItem findUnique
   */
  export type QuotationLineItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem findUniqueOrThrow
   */
  export type QuotationLineItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem findFirst
   */
  export type QuotationLineItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuotationLineItems.
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuotationLineItems.
     */
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * QuotationLineItem findFirstOrThrow
   */
  export type QuotationLineItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuotationLineItems.
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuotationLineItems.
     */
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * QuotationLineItem findMany
   */
  export type QuotationLineItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItems to fetch.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuotationLineItems.
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * QuotationLineItem create
   */
  export type QuotationLineItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * The data needed to create a QuotationLineItem.
     */
    data: XOR<QuotationLineItemCreateInput, QuotationLineItemUncheckedCreateInput>
  }

  /**
   * QuotationLineItem createMany
   */
  export type QuotationLineItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuotationLineItems.
     */
    data: QuotationLineItemCreateManyInput | QuotationLineItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuotationLineItem createManyAndReturn
   */
  export type QuotationLineItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * The data used to create many QuotationLineItems.
     */
    data: QuotationLineItemCreateManyInput | QuotationLineItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuotationLineItem update
   */
  export type QuotationLineItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * The data needed to update a QuotationLineItem.
     */
    data: XOR<QuotationLineItemUpdateInput, QuotationLineItemUncheckedUpdateInput>
    /**
     * Choose, which QuotationLineItem to update.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem updateMany
   */
  export type QuotationLineItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuotationLineItems.
     */
    data: XOR<QuotationLineItemUpdateManyMutationInput, QuotationLineItemUncheckedUpdateManyInput>
    /**
     * Filter which QuotationLineItems to update
     */
    where?: QuotationLineItemWhereInput
    /**
     * Limit how many QuotationLineItems to update.
     */
    limit?: number
  }

  /**
   * QuotationLineItem updateManyAndReturn
   */
  export type QuotationLineItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * The data used to update QuotationLineItems.
     */
    data: XOR<QuotationLineItemUpdateManyMutationInput, QuotationLineItemUncheckedUpdateManyInput>
    /**
     * Filter which QuotationLineItems to update
     */
    where?: QuotationLineItemWhereInput
    /**
     * Limit how many QuotationLineItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuotationLineItem upsert
   */
  export type QuotationLineItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * The filter to search for the QuotationLineItem to update in case it exists.
     */
    where: QuotationLineItemWhereUniqueInput
    /**
     * In case the QuotationLineItem found by the `where` argument doesn't exist, create a new QuotationLineItem with this data.
     */
    create: XOR<QuotationLineItemCreateInput, QuotationLineItemUncheckedCreateInput>
    /**
     * In case the QuotationLineItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuotationLineItemUpdateInput, QuotationLineItemUncheckedUpdateInput>
  }

  /**
   * QuotationLineItem delete
   */
  export type QuotationLineItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter which QuotationLineItem to delete.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem deleteMany
   */
  export type QuotationLineItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuotationLineItems to delete
     */
    where?: QuotationLineItemWhereInput
    /**
     * Limit how many QuotationLineItems to delete.
     */
    limit?: number
  }

  /**
   * QuotationLineItem without action
   */
  export type QuotationLineItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
  }

  export type OrderSumAggregateOutputType = {
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    soNumber: string | null
    poNumber: string | null
    quotationId: string | null
    clientName: string | null
    status: $Enums.OrderStatus | null
    rushOrder: boolean | null
    deliveryDate: Date | null
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    soNumber: string | null
    poNumber: string | null
    quotationId: string | null
    clientName: string | null
    status: $Enums.OrderStatus | null
    rushOrder: boolean | null
    deliveryDate: Date | null
    subtotal: Decimal | null
    vatAmount: Decimal | null
    total: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    soNumber: number
    poNumber: number
    quotationId: number
    clientName: number
    status: number
    rushOrder: number
    deliveryDate: number
    subtotal: number
    vatAmount: number
    total: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    subtotal?: true
    vatAmount?: true
    total?: true
  }

  export type OrderSumAggregateInputType = {
    subtotal?: true
    vatAmount?: true
    total?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    soNumber?: true
    poNumber?: true
    quotationId?: true
    clientName?: true
    status?: true
    rushOrder?: true
    deliveryDate?: true
    subtotal?: true
    vatAmount?: true
    total?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    soNumber?: true
    poNumber?: true
    quotationId?: true
    clientName?: true
    status?: true
    rushOrder?: true
    deliveryDate?: true
    subtotal?: true
    vatAmount?: true
    total?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    soNumber?: true
    poNumber?: true
    quotationId?: true
    clientName?: true
    status?: true
    rushOrder?: true
    deliveryDate?: true
    subtotal?: true
    vatAmount?: true
    total?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    soNumber: string
    poNumber: string | null
    quotationId: string
    clientName: string
    status: $Enums.OrderStatus
    rushOrder: boolean
    deliveryDate: Date | null
    subtotal: Decimal
    vatAmount: Decimal
    total: Decimal
    createdAt: Date
    updatedAt: Date
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    soNumber?: boolean
    poNumber?: boolean
    quotationId?: boolean
    clientName?: boolean
    status?: boolean
    rushOrder?: boolean
    deliveryDate?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    payments?: boolean | Order$paymentsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    soNumber?: boolean
    poNumber?: boolean
    quotationId?: boolean
    clientName?: boolean
    status?: boolean
    rushOrder?: boolean
    deliveryDate?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    soNumber?: boolean
    poNumber?: boolean
    quotationId?: boolean
    clientName?: boolean
    status?: boolean
    rushOrder?: boolean
    deliveryDate?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    soNumber?: boolean
    poNumber?: boolean
    quotationId?: boolean
    clientName?: boolean
    status?: boolean
    rushOrder?: boolean
    deliveryDate?: boolean
    subtotal?: boolean
    vatAmount?: boolean
    total?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "soNumber" | "poNumber" | "quotationId" | "clientName" | "status" | "rushOrder" | "deliveryDate" | "subtotal" | "vatAmount" | "total" | "createdAt" | "updatedAt", ExtArgs["result"]["order"]>
  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    payments?: boolean | Order$paymentsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
  }
  export type OrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      quotation: Prisma.$QuotationPayload<ExtArgs>
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      soNumber: string
      poNumber: string | null
      quotationId: string
      clientName: string
      status: $Enums.OrderStatus
      rushOrder: boolean
      deliveryDate: Date | null
      subtotal: Prisma.Decimal
      vatAmount: Prisma.Decimal
      total: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quotation<T extends QuotationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuotationDefaultArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    payments<T extends Order$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Order$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly soNumber: FieldRef<"Order", 'String'>
    readonly poNumber: FieldRef<"Order", 'String'>
    readonly quotationId: FieldRef<"Order", 'String'>
    readonly clientName: FieldRef<"Order", 'String'>
    readonly status: FieldRef<"Order", 'OrderStatus'>
    readonly rushOrder: FieldRef<"Order", 'Boolean'>
    readonly deliveryDate: FieldRef<"Order", 'DateTime'>
    readonly subtotal: FieldRef<"Order", 'Decimal'>
    readonly vatAmount: FieldRef<"Order", 'Decimal'>
    readonly total: FieldRef<"Order", 'Decimal'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order updateManyAndReturn
   */
  export type OrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order.payments
   */
  export type Order$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    type: $Enums.PaymentType | null
    amount: Decimal | null
    status: $Enums.PaymentStatus | null
    proofUrl: string | null
    date: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    type: $Enums.PaymentType | null
    amount: Decimal | null
    status: $Enums.PaymentStatus | null
    proofUrl: string | null
    date: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    orderId: number
    type: number
    amount: number
    status: number
    proofUrl: number
    date: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    orderId?: true
    type?: true
    amount?: true
    status?: true
    proofUrl?: true
    date?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    orderId?: true
    type?: true
    amount?: true
    status?: true
    proofUrl?: true
    date?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    orderId?: true
    type?: true
    amount?: true
    status?: true
    proofUrl?: true
    date?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    orderId: string
    type: $Enums.PaymentType
    amount: Decimal
    status: $Enums.PaymentStatus
    proofUrl: string | null
    date: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    proofUrl?: boolean
    date?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    proofUrl?: boolean
    date?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    proofUrl?: boolean
    date?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    orderId?: boolean
    type?: boolean
    amount?: boolean
    status?: boolean
    proofUrl?: boolean
    date?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "type" | "amount" | "status" | "proofUrl" | "date", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      type: $Enums.PaymentType
      amount: Prisma.Decimal
      status: $Enums.PaymentStatus
      proofUrl: string | null
      date: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly orderId: FieldRef<"Payment", 'String'>
    readonly type: FieldRef<"Payment", 'PaymentType'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly proofUrl: FieldRef<"Payment", 'String'>
    readonly date: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    role: 'role',
    branchId: 'branchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    category: 'category',
    material: 'material',
    price: 'price',
    originalPrice: 'originalPrice',
    badge: 'badge',
    stockStatus: 'stockStatus',
    description: 'description',
    images: 'images',
    rating: 'rating',
    reviewCount: 'reviewCount',
    widthCm: 'widthCm',
    depthCm: 'depthCm',
    heightCm: 'heightCm',
    weightKg: 'weightKg',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProductColorVariantScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    name: 'name',
    hex: 'hex'
  };

  export type ProductColorVariantScalarFieldEnum = (typeof ProductColorVariantScalarFieldEnum)[keyof typeof ProductColorVariantScalarFieldEnum]


  export const WarehouseScalarFieldEnum: {
    id: 'id',
    name: 'name',
    branchCode: 'branchCode',
    address: 'address'
  };

  export type WarehouseScalarFieldEnum = (typeof WarehouseScalarFieldEnum)[keyof typeof WarehouseScalarFieldEnum]


  export const StockItemScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    warehouseId: 'warehouseId',
    sku: 'sku',
    qtyAvailable: 'qtyAvailable',
    qtyReserved: 'qtyReserved',
    qtyInProduction: 'qtyInProduction',
    minThreshold: 'minThreshold',
    state: 'state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StockItemScalarFieldEnum = (typeof StockItemScalarFieldEnum)[keyof typeof StockItemScalarFieldEnum]


  export const StockMovementScalarFieldEnum: {
    id: 'id',
    stockItemId: 'stockItemId',
    type: 'type',
    quantity: 'quantity',
    actor: 'actor',
    reference: 'reference',
    createdAt: 'createdAt'
  };

  export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum]


  export const StockTransferScalarFieldEnum: {
    id: 'id',
    fromWarehouse: 'fromWarehouse',
    toWarehouse: 'toWarehouse',
    productId: 'productId',
    quantity: 'quantity',
    reason: 'reason',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type StockTransferScalarFieldEnum = (typeof StockTransferScalarFieldEnum)[keyof typeof StockTransferScalarFieldEnum]


  export const LeadScalarFieldEnum: {
    id: 'id',
    name: 'name',
    company: 'company',
    email: 'email',
    businessType: 'businessType',
    budget: 'budget',
    targetDate: 'targetDate',
    stage: 'stage',
    createdAt: 'createdAt'
  };

  export type LeadScalarFieldEnum = (typeof LeadScalarFieldEnum)[keyof typeof LeadScalarFieldEnum]


  export const QuotationScalarFieldEnum: {
    id: 'id',
    quoteNumber: 'quoteNumber',
    leadId: 'leadId',
    clientName: 'clientName',
    clientEmail: 'clientEmail',
    status: 'status',
    subtotal: 'subtotal',
    vatAmount: 'vatAmount',
    total: 'total',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuotationScalarFieldEnum = (typeof QuotationScalarFieldEnum)[keyof typeof QuotationScalarFieldEnum]


  export const QuotationLineItemScalarFieldEnum: {
    id: 'id',
    quotationId: 'quotationId',
    productId: 'productId',
    productName: 'productName',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    dimensions: 'dimensions',
    finish: 'finish',
    total: 'total'
  };

  export type QuotationLineItemScalarFieldEnum = (typeof QuotationLineItemScalarFieldEnum)[keyof typeof QuotationLineItemScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    soNumber: 'soNumber',
    poNumber: 'poNumber',
    quotationId: 'quotationId',
    clientName: 'clientName',
    status: 'status',
    rushOrder: 'rushOrder',
    deliveryDate: 'deliveryDate',
    subtotal: 'subtotal',
    vatAmount: 'vatAmount',
    total: 'total',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    type: 'type',
    amount: 'amount',
    status: 'status',
    proofUrl: 'proofUrl',
    date: 'date'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'ProductBadge'
   */
  export type EnumProductBadgeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductBadge'>
    


  /**
   * Reference to a field of type 'ProductBadge[]'
   */
  export type ListEnumProductBadgeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductBadge[]'>
    


  /**
   * Reference to a field of type 'StockStatus'
   */
  export type EnumStockStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockStatus'>
    


  /**
   * Reference to a field of type 'StockStatus[]'
   */
  export type ListEnumStockStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'StockState'
   */
  export type EnumStockStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockState'>
    


  /**
   * Reference to a field of type 'StockState[]'
   */
  export type ListEnumStockStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockState[]'>
    


  /**
   * Reference to a field of type 'StockMovementType'
   */
  export type EnumStockMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMovementType'>
    


  /**
   * Reference to a field of type 'StockMovementType[]'
   */
  export type ListEnumStockMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMovementType[]'>
    


  /**
   * Reference to a field of type 'CrmStage'
   */
  export type EnumCrmStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrmStage'>
    


  /**
   * Reference to a field of type 'CrmStage[]'
   */
  export type ListEnumCrmStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CrmStage[]'>
    


  /**
   * Reference to a field of type 'QuotationStatus'
   */
  export type EnumQuotationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuotationStatus'>
    


  /**
   * Reference to a field of type 'QuotationStatus[]'
   */
  export type ListEnumQuotationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuotationStatus[]'>
    


  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'PaymentType'
   */
  export type EnumPaymentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentType'>
    


  /**
   * Reference to a field of type 'PaymentType[]'
   */
  export type ListEnumPaymentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentType[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    branchId?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    branchId?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    branchId?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    category?: StringFilter<"Product"> | string
    material?: StringFilter<"Product"> | string
    price?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    originalPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    badge?: EnumProductBadgeNullableFilter<"Product"> | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFilter<"Product"> | $Enums.StockStatus
    description?: StringFilter<"Product"> | string
    images?: StringNullableListFilter<"Product">
    rating?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFilter<"Product"> | number
    widthCm?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    colorVariants?: ProductColorVariantListRelationFilter
    stockItems?: StockItemListRelationFilter
    quotationItems?: QuotationLineItemListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    material?: SortOrder
    price?: SortOrder
    originalPrice?: SortOrderInput | SortOrder
    badge?: SortOrderInput | SortOrder
    stockStatus?: SortOrder
    description?: SortOrder
    images?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    widthCm?: SortOrder
    depthCm?: SortOrder
    heightCm?: SortOrder
    weightKg?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    colorVariants?: ProductColorVariantOrderByRelationAggregateInput
    stockItems?: StockItemOrderByRelationAggregateInput
    quotationItems?: QuotationLineItemOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    category?: StringFilter<"Product"> | string
    material?: StringFilter<"Product"> | string
    price?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    originalPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    badge?: EnumProductBadgeNullableFilter<"Product"> | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFilter<"Product"> | $Enums.StockStatus
    description?: StringFilter<"Product"> | string
    images?: StringNullableListFilter<"Product">
    rating?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFilter<"Product"> | number
    widthCm?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    colorVariants?: ProductColorVariantListRelationFilter
    stockItems?: StockItemListRelationFilter
    quotationItems?: QuotationLineItemListRelationFilter
  }, "id" | "slug">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    material?: SortOrder
    price?: SortOrder
    originalPrice?: SortOrderInput | SortOrder
    badge?: SortOrderInput | SortOrder
    stockStatus?: SortOrder
    description?: SortOrder
    images?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    widthCm?: SortOrder
    depthCm?: SortOrder
    heightCm?: SortOrder
    weightKg?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    slug?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    category?: StringWithAggregatesFilter<"Product"> | string
    material?: StringWithAggregatesFilter<"Product"> | string
    price?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    originalPrice?: DecimalNullableWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    badge?: EnumProductBadgeNullableWithAggregatesFilter<"Product"> | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusWithAggregatesFilter<"Product"> | $Enums.StockStatus
    description?: StringWithAggregatesFilter<"Product"> | string
    images?: StringNullableListFilter<"Product">
    rating?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    reviewCount?: IntWithAggregatesFilter<"Product"> | number
    widthCm?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type ProductColorVariantWhereInput = {
    AND?: ProductColorVariantWhereInput | ProductColorVariantWhereInput[]
    OR?: ProductColorVariantWhereInput[]
    NOT?: ProductColorVariantWhereInput | ProductColorVariantWhereInput[]
    id?: StringFilter<"ProductColorVariant"> | string
    productId?: StringFilter<"ProductColorVariant"> | string
    name?: StringFilter<"ProductColorVariant"> | string
    hex?: StringFilter<"ProductColorVariant"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type ProductColorVariantOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    name?: SortOrder
    hex?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type ProductColorVariantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductColorVariantWhereInput | ProductColorVariantWhereInput[]
    OR?: ProductColorVariantWhereInput[]
    NOT?: ProductColorVariantWhereInput | ProductColorVariantWhereInput[]
    productId?: StringFilter<"ProductColorVariant"> | string
    name?: StringFilter<"ProductColorVariant"> | string
    hex?: StringFilter<"ProductColorVariant"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type ProductColorVariantOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    name?: SortOrder
    hex?: SortOrder
    _count?: ProductColorVariantCountOrderByAggregateInput
    _max?: ProductColorVariantMaxOrderByAggregateInput
    _min?: ProductColorVariantMinOrderByAggregateInput
  }

  export type ProductColorVariantScalarWhereWithAggregatesInput = {
    AND?: ProductColorVariantScalarWhereWithAggregatesInput | ProductColorVariantScalarWhereWithAggregatesInput[]
    OR?: ProductColorVariantScalarWhereWithAggregatesInput[]
    NOT?: ProductColorVariantScalarWhereWithAggregatesInput | ProductColorVariantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductColorVariant"> | string
    productId?: StringWithAggregatesFilter<"ProductColorVariant"> | string
    name?: StringWithAggregatesFilter<"ProductColorVariant"> | string
    hex?: StringWithAggregatesFilter<"ProductColorVariant"> | string
  }

  export type WarehouseWhereInput = {
    AND?: WarehouseWhereInput | WarehouseWhereInput[]
    OR?: WarehouseWhereInput[]
    NOT?: WarehouseWhereInput | WarehouseWhereInput[]
    id?: StringFilter<"Warehouse"> | string
    name?: StringFilter<"Warehouse"> | string
    branchCode?: StringFilter<"Warehouse"> | string
    address?: StringFilter<"Warehouse"> | string
    stockItems?: StockItemListRelationFilter
    transfersFrom?: StockTransferListRelationFilter
    transfersTo?: StockTransferListRelationFilter
  }

  export type WarehouseOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    branchCode?: SortOrder
    address?: SortOrder
    stockItems?: StockItemOrderByRelationAggregateInput
    transfersFrom?: StockTransferOrderByRelationAggregateInput
    transfersTo?: StockTransferOrderByRelationAggregateInput
  }

  export type WarehouseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    branchCode?: string
    AND?: WarehouseWhereInput | WarehouseWhereInput[]
    OR?: WarehouseWhereInput[]
    NOT?: WarehouseWhereInput | WarehouseWhereInput[]
    name?: StringFilter<"Warehouse"> | string
    address?: StringFilter<"Warehouse"> | string
    stockItems?: StockItemListRelationFilter
    transfersFrom?: StockTransferListRelationFilter
    transfersTo?: StockTransferListRelationFilter
  }, "id" | "branchCode">

  export type WarehouseOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    branchCode?: SortOrder
    address?: SortOrder
    _count?: WarehouseCountOrderByAggregateInput
    _max?: WarehouseMaxOrderByAggregateInput
    _min?: WarehouseMinOrderByAggregateInput
  }

  export type WarehouseScalarWhereWithAggregatesInput = {
    AND?: WarehouseScalarWhereWithAggregatesInput | WarehouseScalarWhereWithAggregatesInput[]
    OR?: WarehouseScalarWhereWithAggregatesInput[]
    NOT?: WarehouseScalarWhereWithAggregatesInput | WarehouseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Warehouse"> | string
    name?: StringWithAggregatesFilter<"Warehouse"> | string
    branchCode?: StringWithAggregatesFilter<"Warehouse"> | string
    address?: StringWithAggregatesFilter<"Warehouse"> | string
  }

  export type StockItemWhereInput = {
    AND?: StockItemWhereInput | StockItemWhereInput[]
    OR?: StockItemWhereInput[]
    NOT?: StockItemWhereInput | StockItemWhereInput[]
    id?: StringFilter<"StockItem"> | string
    productId?: StringFilter<"StockItem"> | string
    warehouseId?: StringFilter<"StockItem"> | string
    sku?: StringFilter<"StockItem"> | string
    qtyAvailable?: IntFilter<"StockItem"> | number
    qtyReserved?: IntFilter<"StockItem"> | number
    qtyInProduction?: IntFilter<"StockItem"> | number
    minThreshold?: IntFilter<"StockItem"> | number
    state?: EnumStockStateFilter<"StockItem"> | $Enums.StockState
    createdAt?: DateTimeFilter<"StockItem"> | Date | string
    updatedAt?: DateTimeFilter<"StockItem"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    warehouse?: XOR<WarehouseScalarRelationFilter, WarehouseWhereInput>
    movements?: StockMovementListRelationFilter
  }

  export type StockItemOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    warehouseId?: SortOrder
    sku?: SortOrder
    qtyAvailable?: SortOrder
    qtyReserved?: SortOrder
    qtyInProduction?: SortOrder
    minThreshold?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: ProductOrderByWithRelationInput
    warehouse?: WarehouseOrderByWithRelationInput
    movements?: StockMovementOrderByRelationAggregateInput
  }

  export type StockItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sku?: string
    AND?: StockItemWhereInput | StockItemWhereInput[]
    OR?: StockItemWhereInput[]
    NOT?: StockItemWhereInput | StockItemWhereInput[]
    productId?: StringFilter<"StockItem"> | string
    warehouseId?: StringFilter<"StockItem"> | string
    qtyAvailable?: IntFilter<"StockItem"> | number
    qtyReserved?: IntFilter<"StockItem"> | number
    qtyInProduction?: IntFilter<"StockItem"> | number
    minThreshold?: IntFilter<"StockItem"> | number
    state?: EnumStockStateFilter<"StockItem"> | $Enums.StockState
    createdAt?: DateTimeFilter<"StockItem"> | Date | string
    updatedAt?: DateTimeFilter<"StockItem"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    warehouse?: XOR<WarehouseScalarRelationFilter, WarehouseWhereInput>
    movements?: StockMovementListRelationFilter
  }, "id" | "sku">

  export type StockItemOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    warehouseId?: SortOrder
    sku?: SortOrder
    qtyAvailable?: SortOrder
    qtyReserved?: SortOrder
    qtyInProduction?: SortOrder
    minThreshold?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StockItemCountOrderByAggregateInput
    _avg?: StockItemAvgOrderByAggregateInput
    _max?: StockItemMaxOrderByAggregateInput
    _min?: StockItemMinOrderByAggregateInput
    _sum?: StockItemSumOrderByAggregateInput
  }

  export type StockItemScalarWhereWithAggregatesInput = {
    AND?: StockItemScalarWhereWithAggregatesInput | StockItemScalarWhereWithAggregatesInput[]
    OR?: StockItemScalarWhereWithAggregatesInput[]
    NOT?: StockItemScalarWhereWithAggregatesInput | StockItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StockItem"> | string
    productId?: StringWithAggregatesFilter<"StockItem"> | string
    warehouseId?: StringWithAggregatesFilter<"StockItem"> | string
    sku?: StringWithAggregatesFilter<"StockItem"> | string
    qtyAvailable?: IntWithAggregatesFilter<"StockItem"> | number
    qtyReserved?: IntWithAggregatesFilter<"StockItem"> | number
    qtyInProduction?: IntWithAggregatesFilter<"StockItem"> | number
    minThreshold?: IntWithAggregatesFilter<"StockItem"> | number
    state?: EnumStockStateWithAggregatesFilter<"StockItem"> | $Enums.StockState
    createdAt?: DateTimeWithAggregatesFilter<"StockItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StockItem"> | Date | string
  }

  export type StockMovementWhereInput = {
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    id?: StringFilter<"StockMovement"> | string
    stockItemId?: StringFilter<"StockMovement"> | string
    type?: EnumStockMovementTypeFilter<"StockMovement"> | $Enums.StockMovementType
    quantity?: IntFilter<"StockMovement"> | number
    actor?: StringFilter<"StockMovement"> | string
    reference?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    stockItem?: XOR<StockItemScalarRelationFilter, StockItemWhereInput>
  }

  export type StockMovementOrderByWithRelationInput = {
    id?: SortOrder
    stockItemId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    actor?: SortOrder
    reference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    stockItem?: StockItemOrderByWithRelationInput
  }

  export type StockMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    stockItemId?: StringFilter<"StockMovement"> | string
    type?: EnumStockMovementTypeFilter<"StockMovement"> | $Enums.StockMovementType
    quantity?: IntFilter<"StockMovement"> | number
    actor?: StringFilter<"StockMovement"> | string
    reference?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    stockItem?: XOR<StockItemScalarRelationFilter, StockItemWhereInput>
  }, "id">

  export type StockMovementOrderByWithAggregationInput = {
    id?: SortOrder
    stockItemId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    actor?: SortOrder
    reference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StockMovementCountOrderByAggregateInput
    _avg?: StockMovementAvgOrderByAggregateInput
    _max?: StockMovementMaxOrderByAggregateInput
    _min?: StockMovementMinOrderByAggregateInput
    _sum?: StockMovementSumOrderByAggregateInput
  }

  export type StockMovementScalarWhereWithAggregatesInput = {
    AND?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    OR?: StockMovementScalarWhereWithAggregatesInput[]
    NOT?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StockMovement"> | string
    stockItemId?: StringWithAggregatesFilter<"StockMovement"> | string
    type?: EnumStockMovementTypeWithAggregatesFilter<"StockMovement"> | $Enums.StockMovementType
    quantity?: IntWithAggregatesFilter<"StockMovement"> | number
    actor?: StringWithAggregatesFilter<"StockMovement"> | string
    reference?: StringNullableWithAggregatesFilter<"StockMovement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StockMovement"> | Date | string
  }

  export type StockTransferWhereInput = {
    AND?: StockTransferWhereInput | StockTransferWhereInput[]
    OR?: StockTransferWhereInput[]
    NOT?: StockTransferWhereInput | StockTransferWhereInput[]
    id?: StringFilter<"StockTransfer"> | string
    fromWarehouse?: StringFilter<"StockTransfer"> | string
    toWarehouse?: StringFilter<"StockTransfer"> | string
    productId?: StringFilter<"StockTransfer"> | string
    quantity?: IntFilter<"StockTransfer"> | number
    reason?: StringNullableFilter<"StockTransfer"> | string | null
    status?: StringFilter<"StockTransfer"> | string
    createdAt?: DateTimeFilter<"StockTransfer"> | Date | string
    from?: XOR<WarehouseScalarRelationFilter, WarehouseWhereInput>
    to?: XOR<WarehouseScalarRelationFilter, WarehouseWhereInput>
  }

  export type StockTransferOrderByWithRelationInput = {
    id?: SortOrder
    fromWarehouse?: SortOrder
    toWarehouse?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    from?: WarehouseOrderByWithRelationInput
    to?: WarehouseOrderByWithRelationInput
  }

  export type StockTransferWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StockTransferWhereInput | StockTransferWhereInput[]
    OR?: StockTransferWhereInput[]
    NOT?: StockTransferWhereInput | StockTransferWhereInput[]
    fromWarehouse?: StringFilter<"StockTransfer"> | string
    toWarehouse?: StringFilter<"StockTransfer"> | string
    productId?: StringFilter<"StockTransfer"> | string
    quantity?: IntFilter<"StockTransfer"> | number
    reason?: StringNullableFilter<"StockTransfer"> | string | null
    status?: StringFilter<"StockTransfer"> | string
    createdAt?: DateTimeFilter<"StockTransfer"> | Date | string
    from?: XOR<WarehouseScalarRelationFilter, WarehouseWhereInput>
    to?: XOR<WarehouseScalarRelationFilter, WarehouseWhereInput>
  }, "id">

  export type StockTransferOrderByWithAggregationInput = {
    id?: SortOrder
    fromWarehouse?: SortOrder
    toWarehouse?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: StockTransferCountOrderByAggregateInput
    _avg?: StockTransferAvgOrderByAggregateInput
    _max?: StockTransferMaxOrderByAggregateInput
    _min?: StockTransferMinOrderByAggregateInput
    _sum?: StockTransferSumOrderByAggregateInput
  }

  export type StockTransferScalarWhereWithAggregatesInput = {
    AND?: StockTransferScalarWhereWithAggregatesInput | StockTransferScalarWhereWithAggregatesInput[]
    OR?: StockTransferScalarWhereWithAggregatesInput[]
    NOT?: StockTransferScalarWhereWithAggregatesInput | StockTransferScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StockTransfer"> | string
    fromWarehouse?: StringWithAggregatesFilter<"StockTransfer"> | string
    toWarehouse?: StringWithAggregatesFilter<"StockTransfer"> | string
    productId?: StringWithAggregatesFilter<"StockTransfer"> | string
    quantity?: IntWithAggregatesFilter<"StockTransfer"> | number
    reason?: StringNullableWithAggregatesFilter<"StockTransfer"> | string | null
    status?: StringWithAggregatesFilter<"StockTransfer"> | string
    createdAt?: DateTimeWithAggregatesFilter<"StockTransfer"> | Date | string
  }

  export type LeadWhereInput = {
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    id?: StringFilter<"Lead"> | string
    name?: StringFilter<"Lead"> | string
    company?: StringFilter<"Lead"> | string
    email?: StringFilter<"Lead"> | string
    businessType?: StringFilter<"Lead"> | string
    budget?: DecimalFilter<"Lead"> | Decimal | DecimalJsLike | number | string
    targetDate?: DateTimeNullableFilter<"Lead"> | Date | string | null
    stage?: EnumCrmStageFilter<"Lead"> | $Enums.CrmStage
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    quotations?: QuotationListRelationFilter
  }

  export type LeadOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    company?: SortOrder
    email?: SortOrder
    businessType?: SortOrder
    budget?: SortOrder
    targetDate?: SortOrderInput | SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
    quotations?: QuotationOrderByRelationAggregateInput
  }

  export type LeadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    name?: StringFilter<"Lead"> | string
    company?: StringFilter<"Lead"> | string
    email?: StringFilter<"Lead"> | string
    businessType?: StringFilter<"Lead"> | string
    budget?: DecimalFilter<"Lead"> | Decimal | DecimalJsLike | number | string
    targetDate?: DateTimeNullableFilter<"Lead"> | Date | string | null
    stage?: EnumCrmStageFilter<"Lead"> | $Enums.CrmStage
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    quotations?: QuotationListRelationFilter
  }, "id">

  export type LeadOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    company?: SortOrder
    email?: SortOrder
    businessType?: SortOrder
    budget?: SortOrder
    targetDate?: SortOrderInput | SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
    _count?: LeadCountOrderByAggregateInput
    _avg?: LeadAvgOrderByAggregateInput
    _max?: LeadMaxOrderByAggregateInput
    _min?: LeadMinOrderByAggregateInput
    _sum?: LeadSumOrderByAggregateInput
  }

  export type LeadScalarWhereWithAggregatesInput = {
    AND?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    OR?: LeadScalarWhereWithAggregatesInput[]
    NOT?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lead"> | string
    name?: StringWithAggregatesFilter<"Lead"> | string
    company?: StringWithAggregatesFilter<"Lead"> | string
    email?: StringWithAggregatesFilter<"Lead"> | string
    businessType?: StringWithAggregatesFilter<"Lead"> | string
    budget?: DecimalWithAggregatesFilter<"Lead"> | Decimal | DecimalJsLike | number | string
    targetDate?: DateTimeNullableWithAggregatesFilter<"Lead"> | Date | string | null
    stage?: EnumCrmStageWithAggregatesFilter<"Lead"> | $Enums.CrmStage
    createdAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
  }

  export type QuotationWhereInput = {
    AND?: QuotationWhereInput | QuotationWhereInput[]
    OR?: QuotationWhereInput[]
    NOT?: QuotationWhereInput | QuotationWhereInput[]
    id?: StringFilter<"Quotation"> | string
    quoteNumber?: StringFilter<"Quotation"> | string
    leadId?: StringFilter<"Quotation"> | string
    clientName?: StringFilter<"Quotation"> | string
    clientEmail?: StringFilter<"Quotation"> | string
    status?: EnumQuotationStatusFilter<"Quotation"> | $Enums.QuotationStatus
    subtotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeFilter<"Quotation"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
    lineItems?: QuotationLineItemListRelationFilter
    order?: XOR<OrderNullableScalarRelationFilter, OrderWhereInput> | null
  }

  export type QuotationOrderByWithRelationInput = {
    id?: SortOrder
    quoteNumber?: SortOrder
    leadId?: SortOrder
    clientName?: SortOrder
    clientEmail?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lead?: LeadOrderByWithRelationInput
    lineItems?: QuotationLineItemOrderByRelationAggregateInput
    order?: OrderOrderByWithRelationInput
  }

  export type QuotationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    quoteNumber?: string
    AND?: QuotationWhereInput | QuotationWhereInput[]
    OR?: QuotationWhereInput[]
    NOT?: QuotationWhereInput | QuotationWhereInput[]
    leadId?: StringFilter<"Quotation"> | string
    clientName?: StringFilter<"Quotation"> | string
    clientEmail?: StringFilter<"Quotation"> | string
    status?: EnumQuotationStatusFilter<"Quotation"> | $Enums.QuotationStatus
    subtotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeFilter<"Quotation"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
    lineItems?: QuotationLineItemListRelationFilter
    order?: XOR<OrderNullableScalarRelationFilter, OrderWhereInput> | null
  }, "id" | "quoteNumber">

  export type QuotationOrderByWithAggregationInput = {
    id?: SortOrder
    quoteNumber?: SortOrder
    leadId?: SortOrder
    clientName?: SortOrder
    clientEmail?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuotationCountOrderByAggregateInput
    _avg?: QuotationAvgOrderByAggregateInput
    _max?: QuotationMaxOrderByAggregateInput
    _min?: QuotationMinOrderByAggregateInput
    _sum?: QuotationSumOrderByAggregateInput
  }

  export type QuotationScalarWhereWithAggregatesInput = {
    AND?: QuotationScalarWhereWithAggregatesInput | QuotationScalarWhereWithAggregatesInput[]
    OR?: QuotationScalarWhereWithAggregatesInput[]
    NOT?: QuotationScalarWhereWithAggregatesInput | QuotationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quotation"> | string
    quoteNumber?: StringWithAggregatesFilter<"Quotation"> | string
    leadId?: StringWithAggregatesFilter<"Quotation"> | string
    clientName?: StringWithAggregatesFilter<"Quotation"> | string
    clientEmail?: StringWithAggregatesFilter<"Quotation"> | string
    status?: EnumQuotationStatusWithAggregatesFilter<"Quotation"> | $Enums.QuotationStatus
    subtotal?: DecimalWithAggregatesFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalWithAggregatesFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    total?: DecimalWithAggregatesFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Quotation"> | Date | string
  }

  export type QuotationLineItemWhereInput = {
    AND?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    OR?: QuotationLineItemWhereInput[]
    NOT?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    id?: StringFilter<"QuotationLineItem"> | string
    quotationId?: StringFilter<"QuotationLineItem"> | string
    productId?: StringFilter<"QuotationLineItem"> | string
    productName?: StringFilter<"QuotationLineItem"> | string
    quantity?: IntFilter<"QuotationLineItem"> | number
    unitPrice?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    dimensions?: StringNullableFilter<"QuotationLineItem"> | string | null
    finish?: StringNullableFilter<"QuotationLineItem"> | string | null
    total?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    quotation?: XOR<QuotationScalarRelationFilter, QuotationWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type QuotationLineItemOrderByWithRelationInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    dimensions?: SortOrderInput | SortOrder
    finish?: SortOrderInput | SortOrder
    total?: SortOrder
    quotation?: QuotationOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type QuotationLineItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    OR?: QuotationLineItemWhereInput[]
    NOT?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    quotationId?: StringFilter<"QuotationLineItem"> | string
    productId?: StringFilter<"QuotationLineItem"> | string
    productName?: StringFilter<"QuotationLineItem"> | string
    quantity?: IntFilter<"QuotationLineItem"> | number
    unitPrice?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    dimensions?: StringNullableFilter<"QuotationLineItem"> | string | null
    finish?: StringNullableFilter<"QuotationLineItem"> | string | null
    total?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    quotation?: XOR<QuotationScalarRelationFilter, QuotationWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type QuotationLineItemOrderByWithAggregationInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    dimensions?: SortOrderInput | SortOrder
    finish?: SortOrderInput | SortOrder
    total?: SortOrder
    _count?: QuotationLineItemCountOrderByAggregateInput
    _avg?: QuotationLineItemAvgOrderByAggregateInput
    _max?: QuotationLineItemMaxOrderByAggregateInput
    _min?: QuotationLineItemMinOrderByAggregateInput
    _sum?: QuotationLineItemSumOrderByAggregateInput
  }

  export type QuotationLineItemScalarWhereWithAggregatesInput = {
    AND?: QuotationLineItemScalarWhereWithAggregatesInput | QuotationLineItemScalarWhereWithAggregatesInput[]
    OR?: QuotationLineItemScalarWhereWithAggregatesInput[]
    NOT?: QuotationLineItemScalarWhereWithAggregatesInput | QuotationLineItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    quotationId?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    productId?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    productName?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    quantity?: IntWithAggregatesFilter<"QuotationLineItem"> | number
    unitPrice?: DecimalWithAggregatesFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    dimensions?: StringNullableWithAggregatesFilter<"QuotationLineItem"> | string | null
    finish?: StringNullableWithAggregatesFilter<"QuotationLineItem"> | string | null
    total?: DecimalWithAggregatesFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    soNumber?: StringFilter<"Order"> | string
    poNumber?: StringNullableFilter<"Order"> | string | null
    quotationId?: StringFilter<"Order"> | string
    clientName?: StringFilter<"Order"> | string
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    rushOrder?: BoolFilter<"Order"> | boolean
    deliveryDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    subtotal?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    quotation?: XOR<QuotationScalarRelationFilter, QuotationWhereInput>
    payments?: PaymentListRelationFilter
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    soNumber?: SortOrder
    poNumber?: SortOrderInput | SortOrder
    quotationId?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    rushOrder?: SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    quotation?: QuotationOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    soNumber?: string
    quotationId?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    poNumber?: StringNullableFilter<"Order"> | string | null
    clientName?: StringFilter<"Order"> | string
    status?: EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus
    rushOrder?: BoolFilter<"Order"> | boolean
    deliveryDate?: DateTimeNullableFilter<"Order"> | Date | string | null
    subtotal?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Order"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    quotation?: XOR<QuotationScalarRelationFilter, QuotationWhereInput>
    payments?: PaymentListRelationFilter
  }, "id" | "soNumber" | "quotationId">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    soNumber?: SortOrder
    poNumber?: SortOrderInput | SortOrder
    quotationId?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    rushOrder?: SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    soNumber?: StringWithAggregatesFilter<"Order"> | string
    poNumber?: StringNullableWithAggregatesFilter<"Order"> | string | null
    quotationId?: StringWithAggregatesFilter<"Order"> | string
    clientName?: StringWithAggregatesFilter<"Order"> | string
    status?: EnumOrderStatusWithAggregatesFilter<"Order"> | $Enums.OrderStatus
    rushOrder?: BoolWithAggregatesFilter<"Order"> | boolean
    deliveryDate?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    subtotal?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    total?: DecimalWithAggregatesFilter<"Order"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    orderId?: StringFilter<"Payment"> | string
    type?: EnumPaymentTypeFilter<"Payment"> | $Enums.PaymentType
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    proofUrl?: StringNullableFilter<"Payment"> | string | null
    date?: DateTimeFilter<"Payment"> | Date | string
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    proofUrl?: SortOrderInput | SortOrder
    date?: SortOrder
    order?: OrderOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    orderId?: StringFilter<"Payment"> | string
    type?: EnumPaymentTypeFilter<"Payment"> | $Enums.PaymentType
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    proofUrl?: StringNullableFilter<"Payment"> | string | null
    date?: DateTimeFilter<"Payment"> | Date | string
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    proofUrl?: SortOrderInput | SortOrder
    date?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    orderId?: StringWithAggregatesFilter<"Payment"> | string
    type?: EnumPaymentTypeWithAggregatesFilter<"Payment"> | $Enums.PaymentType
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    proofUrl?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    date?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    role: $Enums.Role
    branchId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    role: $Enums.Role
    branchId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    role: $Enums.Role
    branchId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    colorVariants?: ProductColorVariantCreateNestedManyWithoutProductInput
    stockItems?: StockItemCreateNestedManyWithoutProductInput
    quotationItems?: QuotationLineItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    colorVariants?: ProductColorVariantUncheckedCreateNestedManyWithoutProductInput
    stockItems?: StockItemUncheckedCreateNestedManyWithoutProductInput
    quotationItems?: QuotationLineItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    colorVariants?: ProductColorVariantUpdateManyWithoutProductNestedInput
    stockItems?: StockItemUpdateManyWithoutProductNestedInput
    quotationItems?: QuotationLineItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    colorVariants?: ProductColorVariantUncheckedUpdateManyWithoutProductNestedInput
    stockItems?: StockItemUncheckedUpdateManyWithoutProductNestedInput
    quotationItems?: QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductColorVariantCreateInput = {
    id?: string
    name: string
    hex: string
    product: ProductCreateNestedOneWithoutColorVariantsInput
  }

  export type ProductColorVariantUncheckedCreateInput = {
    id?: string
    productId: string
    name: string
    hex: string
  }

  export type ProductColorVariantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hex?: StringFieldUpdateOperationsInput | string
    product?: ProductUpdateOneRequiredWithoutColorVariantsNestedInput
  }

  export type ProductColorVariantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hex?: StringFieldUpdateOperationsInput | string
  }

  export type ProductColorVariantCreateManyInput = {
    id?: string
    productId: string
    name: string
    hex: string
  }

  export type ProductColorVariantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hex?: StringFieldUpdateOperationsInput | string
  }

  export type ProductColorVariantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hex?: StringFieldUpdateOperationsInput | string
  }

  export type WarehouseCreateInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    stockItems?: StockItemCreateNestedManyWithoutWarehouseInput
    transfersFrom?: StockTransferCreateNestedManyWithoutFromInput
    transfersTo?: StockTransferCreateNestedManyWithoutToInput
  }

  export type WarehouseUncheckedCreateInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    stockItems?: StockItemUncheckedCreateNestedManyWithoutWarehouseInput
    transfersFrom?: StockTransferUncheckedCreateNestedManyWithoutFromInput
    transfersTo?: StockTransferUncheckedCreateNestedManyWithoutToInput
  }

  export type WarehouseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    stockItems?: StockItemUpdateManyWithoutWarehouseNestedInput
    transfersFrom?: StockTransferUpdateManyWithoutFromNestedInput
    transfersTo?: StockTransferUpdateManyWithoutToNestedInput
  }

  export type WarehouseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    stockItems?: StockItemUncheckedUpdateManyWithoutWarehouseNestedInput
    transfersFrom?: StockTransferUncheckedUpdateManyWithoutFromNestedInput
    transfersTo?: StockTransferUncheckedUpdateManyWithoutToNestedInput
  }

  export type WarehouseCreateManyInput = {
    id?: string
    name: string
    branchCode: string
    address: string
  }

  export type WarehouseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
  }

  export type WarehouseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
  }

  export type StockItemCreateInput = {
    id?: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutStockItemsInput
    warehouse: WarehouseCreateNestedOneWithoutStockItemsInput
    movements?: StockMovementCreateNestedManyWithoutStockItemInput
  }

  export type StockItemUncheckedCreateInput = {
    id?: string
    productId: string
    warehouseId: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: StockMovementUncheckedCreateNestedManyWithoutStockItemInput
  }

  export type StockItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutStockItemsNestedInput
    warehouse?: WarehouseUpdateOneRequiredWithoutStockItemsNestedInput
    movements?: StockMovementUpdateManyWithoutStockItemNestedInput
  }

  export type StockItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    warehouseId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: StockMovementUncheckedUpdateManyWithoutStockItemNestedInput
  }

  export type StockItemCreateManyInput = {
    id?: string
    productId: string
    warehouseId: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    warehouseId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementCreateInput = {
    id?: string
    type: $Enums.StockMovementType
    quantity: number
    actor: string
    reference?: string | null
    createdAt?: Date | string
    stockItem: StockItemCreateNestedOneWithoutMovementsInput
  }

  export type StockMovementUncheckedCreateInput = {
    id?: string
    stockItemId: string
    type: $Enums.StockMovementType
    quantity: number
    actor: string
    reference?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType
    quantity?: IntFieldUpdateOperationsInput | number
    actor?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stockItem?: StockItemUpdateOneRequiredWithoutMovementsNestedInput
  }

  export type StockMovementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockItemId?: StringFieldUpdateOperationsInput | string
    type?: EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType
    quantity?: IntFieldUpdateOperationsInput | number
    actor?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementCreateManyInput = {
    id?: string
    stockItemId: string
    type: $Enums.StockMovementType
    quantity: number
    actor: string
    reference?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType
    quantity?: IntFieldUpdateOperationsInput | number
    actor?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockItemId?: StringFieldUpdateOperationsInput | string
    type?: EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType
    quantity?: IntFieldUpdateOperationsInput | number
    actor?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockTransferCreateInput = {
    id?: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
    from: WarehouseCreateNestedOneWithoutTransfersFromInput
    to: WarehouseCreateNestedOneWithoutTransfersToInput
  }

  export type StockTransferUncheckedCreateInput = {
    id?: string
    fromWarehouse: string
    toWarehouse: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type StockTransferUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: WarehouseUpdateOneRequiredWithoutTransfersFromNestedInput
    to?: WarehouseUpdateOneRequiredWithoutTransfersToNestedInput
  }

  export type StockTransferUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromWarehouse?: StringFieldUpdateOperationsInput | string
    toWarehouse?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockTransferCreateManyInput = {
    id?: string
    fromWarehouse: string
    toWarehouse: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type StockTransferUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockTransferUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromWarehouse?: StringFieldUpdateOperationsInput | string
    toWarehouse?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadCreateInput = {
    id?: string
    name: string
    company: string
    email: string
    businessType: string
    budget: Decimal | DecimalJsLike | number | string
    targetDate?: Date | string | null
    stage?: $Enums.CrmStage
    createdAt?: Date | string
    quotations?: QuotationCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateInput = {
    id?: string
    name: string
    company: string
    email: string
    businessType: string
    budget: Decimal | DecimalJsLike | number | string
    targetDate?: Date | string | null
    stage?: $Enums.CrmStage
    createdAt?: Date | string
    quotations?: QuotationUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    budget?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stage?: EnumCrmStageFieldUpdateOperationsInput | $Enums.CrmStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotations?: QuotationUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    budget?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stage?: EnumCrmStageFieldUpdateOperationsInput | $Enums.CrmStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotations?: QuotationUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadCreateManyInput = {
    id?: string
    name: string
    company: string
    email: string
    businessType: string
    budget: Decimal | DecimalJsLike | number | string
    targetDate?: Date | string | null
    stage?: $Enums.CrmStage
    createdAt?: Date | string
  }

  export type LeadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    budget?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stage?: EnumCrmStageFieldUpdateOperationsInput | $Enums.CrmStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    budget?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stage?: EnumCrmStageFieldUpdateOperationsInput | $Enums.CrmStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationCreateInput = {
    id?: string
    quoteNumber: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    lead: LeadCreateNestedOneWithoutQuotationsInput
    lineItems?: QuotationLineItemCreateNestedManyWithoutQuotationInput
    order?: OrderCreateNestedOneWithoutQuotationInput
  }

  export type QuotationUncheckedCreateInput = {
    id?: string
    quoteNumber: string
    leadId: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    lineItems?: QuotationLineItemUncheckedCreateNestedManyWithoutQuotationInput
    order?: OrderUncheckedCreateNestedOneWithoutQuotationInput
  }

  export type QuotationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutQuotationsNestedInput
    lineItems?: QuotationLineItemUpdateManyWithoutQuotationNestedInput
    order?: OrderUpdateOneWithoutQuotationNestedInput
  }

  export type QuotationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lineItems?: QuotationLineItemUncheckedUpdateManyWithoutQuotationNestedInput
    order?: OrderUncheckedUpdateOneWithoutQuotationNestedInput
  }

  export type QuotationCreateManyInput = {
    id?: string
    quoteNumber: string
    leadId: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuotationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationLineItemCreateInput = {
    id?: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
    quotation: QuotationCreateNestedOneWithoutLineItemsInput
    product: ProductCreateNestedOneWithoutQuotationItemsInput
  }

  export type QuotationLineItemUncheckedCreateInput = {
    id?: string
    quotationId: string
    productId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quotation?: QuotationUpdateOneRequiredWithoutLineItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutQuotationItemsNestedInput
  }

  export type QuotationLineItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemCreateManyInput = {
    id?: string
    quotationId: string
    productId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type OrderCreateInput = {
    id?: string
    soNumber: string
    poNumber?: string | null
    clientName: string
    status?: $Enums.OrderStatus
    rushOrder?: boolean
    deliveryDate?: Date | string | null
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    quotation: QuotationCreateNestedOneWithoutOrderInput
    payments?: PaymentCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    soNumber: string
    poNumber?: string | null
    quotationId: string
    clientName: string
    status?: $Enums.OrderStatus
    rushOrder?: boolean
    deliveryDate?: Date | string | null
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotation?: QuotationUpdateOneRequiredWithoutOrderNestedInput
    payments?: PaymentUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quotationId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderCreateManyInput = {
    id?: string
    soNumber: string
    poNumber?: string | null
    quotationId: string
    clientName: string
    status?: $Enums.OrderStatus
    rushOrder?: boolean
    deliveryDate?: Date | string | null
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quotationId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    type: $Enums.PaymentType
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.PaymentStatus
    proofUrl?: string | null
    date?: Date | string
    order: OrderCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    orderId: string
    type: $Enums.PaymentType
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.PaymentStatus
    proofUrl?: string | null
    date?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    proofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    proofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    orderId: string
    type: $Enums.PaymentType
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.PaymentStatus
    proofUrl?: string | null
    date?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    proofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    proofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumProductBadgeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductBadge | EnumProductBadgeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProductBadgeNullableFilter<$PrismaModel> | $Enums.ProductBadge | null
  }

  export type EnumStockStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StockStatus | EnumStockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStatusFilter<$PrismaModel> | $Enums.StockStatus
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProductColorVariantListRelationFilter = {
    every?: ProductColorVariantWhereInput
    some?: ProductColorVariantWhereInput
    none?: ProductColorVariantWhereInput
  }

  export type StockItemListRelationFilter = {
    every?: StockItemWhereInput
    some?: StockItemWhereInput
    none?: StockItemWhereInput
  }

  export type QuotationLineItemListRelationFilter = {
    every?: QuotationLineItemWhereInput
    some?: QuotationLineItemWhereInput
    none?: QuotationLineItemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductColorVariantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StockItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuotationLineItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    material?: SortOrder
    price?: SortOrder
    originalPrice?: SortOrder
    badge?: SortOrder
    stockStatus?: SortOrder
    description?: SortOrder
    images?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    widthCm?: SortOrder
    depthCm?: SortOrder
    heightCm?: SortOrder
    weightKg?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    price?: SortOrder
    originalPrice?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    widthCm?: SortOrder
    depthCm?: SortOrder
    heightCm?: SortOrder
    weightKg?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    material?: SortOrder
    price?: SortOrder
    originalPrice?: SortOrder
    badge?: SortOrder
    stockStatus?: SortOrder
    description?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    widthCm?: SortOrder
    depthCm?: SortOrder
    heightCm?: SortOrder
    weightKg?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    material?: SortOrder
    price?: SortOrder
    originalPrice?: SortOrder
    badge?: SortOrder
    stockStatus?: SortOrder
    description?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    widthCm?: SortOrder
    depthCm?: SortOrder
    heightCm?: SortOrder
    weightKg?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    price?: SortOrder
    originalPrice?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    widthCm?: SortOrder
    depthCm?: SortOrder
    heightCm?: SortOrder
    weightKg?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumProductBadgeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductBadge | EnumProductBadgeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProductBadgeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProductBadge | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumProductBadgeNullableFilter<$PrismaModel>
    _max?: NestedEnumProductBadgeNullableFilter<$PrismaModel>
  }

  export type EnumStockStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockStatus | EnumStockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStatusWithAggregatesFilter<$PrismaModel> | $Enums.StockStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStockStatusFilter<$PrismaModel>
    _max?: NestedEnumStockStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductColorVariantCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    name?: SortOrder
    hex?: SortOrder
  }

  export type ProductColorVariantMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    name?: SortOrder
    hex?: SortOrder
  }

  export type ProductColorVariantMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    name?: SortOrder
    hex?: SortOrder
  }

  export type StockTransferListRelationFilter = {
    every?: StockTransferWhereInput
    some?: StockTransferWhereInput
    none?: StockTransferWhereInput
  }

  export type StockTransferOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WarehouseCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    branchCode?: SortOrder
    address?: SortOrder
  }

  export type WarehouseMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    branchCode?: SortOrder
    address?: SortOrder
  }

  export type WarehouseMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    branchCode?: SortOrder
    address?: SortOrder
  }

  export type EnumStockStateFilter<$PrismaModel = never> = {
    equals?: $Enums.StockState | EnumStockStateFieldRefInput<$PrismaModel>
    in?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStateFilter<$PrismaModel> | $Enums.StockState
  }

  export type WarehouseScalarRelationFilter = {
    is?: WarehouseWhereInput
    isNot?: WarehouseWhereInput
  }

  export type StockMovementListRelationFilter = {
    every?: StockMovementWhereInput
    some?: StockMovementWhereInput
    none?: StockMovementWhereInput
  }

  export type StockMovementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StockItemCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    warehouseId?: SortOrder
    sku?: SortOrder
    qtyAvailable?: SortOrder
    qtyReserved?: SortOrder
    qtyInProduction?: SortOrder
    minThreshold?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StockItemAvgOrderByAggregateInput = {
    qtyAvailable?: SortOrder
    qtyReserved?: SortOrder
    qtyInProduction?: SortOrder
    minThreshold?: SortOrder
  }

  export type StockItemMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    warehouseId?: SortOrder
    sku?: SortOrder
    qtyAvailable?: SortOrder
    qtyReserved?: SortOrder
    qtyInProduction?: SortOrder
    minThreshold?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StockItemMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    warehouseId?: SortOrder
    sku?: SortOrder
    qtyAvailable?: SortOrder
    qtyReserved?: SortOrder
    qtyInProduction?: SortOrder
    minThreshold?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StockItemSumOrderByAggregateInput = {
    qtyAvailable?: SortOrder
    qtyReserved?: SortOrder
    qtyInProduction?: SortOrder
    minThreshold?: SortOrder
  }

  export type EnumStockStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockState | EnumStockStateFieldRefInput<$PrismaModel>
    in?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStateWithAggregatesFilter<$PrismaModel> | $Enums.StockState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStockStateFilter<$PrismaModel>
    _max?: NestedEnumStockStateFilter<$PrismaModel>
  }

  export type EnumStockMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | EnumStockMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStockMovementTypeFilter<$PrismaModel> | $Enums.StockMovementType
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StockItemScalarRelationFilter = {
    is?: StockItemWhereInput
    isNot?: StockItemWhereInput
  }

  export type StockMovementCountOrderByAggregateInput = {
    id?: SortOrder
    stockItemId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    actor?: SortOrder
    reference?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type StockMovementMaxOrderByAggregateInput = {
    id?: SortOrder
    stockItemId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    actor?: SortOrder
    reference?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementMinOrderByAggregateInput = {
    id?: SortOrder
    stockItemId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    actor?: SortOrder
    reference?: SortOrder
    createdAt?: SortOrder
  }

  export type StockMovementSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumStockMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | EnumStockMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockMovementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStockMovementTypeFilter<$PrismaModel>
    _max?: NestedEnumStockMovementTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StockTransferCountOrderByAggregateInput = {
    id?: SortOrder
    fromWarehouse?: SortOrder
    toWarehouse?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type StockTransferAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type StockTransferMaxOrderByAggregateInput = {
    id?: SortOrder
    fromWarehouse?: SortOrder
    toWarehouse?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type StockTransferMinOrderByAggregateInput = {
    id?: SortOrder
    fromWarehouse?: SortOrder
    toWarehouse?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type StockTransferSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumCrmStageFilter<$PrismaModel = never> = {
    equals?: $Enums.CrmStage | EnumCrmStageFieldRefInput<$PrismaModel>
    in?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    not?: NestedEnumCrmStageFilter<$PrismaModel> | $Enums.CrmStage
  }

  export type QuotationListRelationFilter = {
    every?: QuotationWhereInput
    some?: QuotationWhereInput
    none?: QuotationWhereInput
  }

  export type QuotationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeadCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    company?: SortOrder
    email?: SortOrder
    businessType?: SortOrder
    budget?: SortOrder
    targetDate?: SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
  }

  export type LeadAvgOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type LeadMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    company?: SortOrder
    email?: SortOrder
    businessType?: SortOrder
    budget?: SortOrder
    targetDate?: SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
  }

  export type LeadMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    company?: SortOrder
    email?: SortOrder
    businessType?: SortOrder
    budget?: SortOrder
    targetDate?: SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
  }

  export type LeadSumOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumCrmStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrmStage | EnumCrmStageFieldRefInput<$PrismaModel>
    in?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    not?: NestedEnumCrmStageWithAggregatesFilter<$PrismaModel> | $Enums.CrmStage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrmStageFilter<$PrismaModel>
    _max?: NestedEnumCrmStageFilter<$PrismaModel>
  }

  export type EnumQuotationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuotationStatus | EnumQuotationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuotationStatusFilter<$PrismaModel> | $Enums.QuotationStatus
  }

  export type LeadScalarRelationFilter = {
    is?: LeadWhereInput
    isNot?: LeadWhereInput
  }

  export type OrderNullableScalarRelationFilter = {
    is?: OrderWhereInput | null
    isNot?: OrderWhereInput | null
  }

  export type QuotationCountOrderByAggregateInput = {
    id?: SortOrder
    quoteNumber?: SortOrder
    leadId?: SortOrder
    clientName?: SortOrder
    clientEmail?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuotationAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
  }

  export type QuotationMaxOrderByAggregateInput = {
    id?: SortOrder
    quoteNumber?: SortOrder
    leadId?: SortOrder
    clientName?: SortOrder
    clientEmail?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuotationMinOrderByAggregateInput = {
    id?: SortOrder
    quoteNumber?: SortOrder
    leadId?: SortOrder
    clientName?: SortOrder
    clientEmail?: SortOrder
    status?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuotationSumOrderByAggregateInput = {
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
  }

  export type EnumQuotationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuotationStatus | EnumQuotationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuotationStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuotationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuotationStatusFilter<$PrismaModel>
    _max?: NestedEnumQuotationStatusFilter<$PrismaModel>
  }

  export type QuotationScalarRelationFilter = {
    is?: QuotationWhereInput
    isNot?: QuotationWhereInput
  }

  export type QuotationLineItemCountOrderByAggregateInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    dimensions?: SortOrder
    finish?: SortOrder
    total?: SortOrder
  }

  export type QuotationLineItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type QuotationLineItemMaxOrderByAggregateInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    dimensions?: SortOrder
    finish?: SortOrder
    total?: SortOrder
  }

  export type QuotationLineItemMinOrderByAggregateInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    dimensions?: SortOrder
    finish?: SortOrder
    total?: SortOrder
  }

  export type QuotationLineItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    total?: SortOrder
  }

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    soNumber?: SortOrder
    poNumber?: SortOrder
    quotationId?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    rushOrder?: SortOrder
    deliveryDate?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    soNumber?: SortOrder
    poNumber?: SortOrder
    quotationId?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    rushOrder?: SortOrder
    deliveryDate?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    soNumber?: SortOrder
    poNumber?: SortOrder
    quotationId?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    rushOrder?: SortOrder
    deliveryDate?: SortOrder
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    subtotal?: SortOrder
    vatAmount?: SortOrder
    total?: SortOrder
  }

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumPaymentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeFilter<$PrismaModel> | $Enums.PaymentType
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type OrderScalarRelationFilter = {
    is?: OrderWhereInput
    isNot?: OrderWhereInput
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    proofUrl?: SortOrder
    date?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    proofUrl?: SortOrder
    date?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    proofUrl?: SortOrder
    date?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumPaymentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProductCreateimagesInput = {
    set: string[]
  }

  export type ProductColorVariantCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductColorVariantCreateWithoutProductInput, ProductColorVariantUncheckedCreateWithoutProductInput> | ProductColorVariantCreateWithoutProductInput[] | ProductColorVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductColorVariantCreateOrConnectWithoutProductInput | ProductColorVariantCreateOrConnectWithoutProductInput[]
    createMany?: ProductColorVariantCreateManyProductInputEnvelope
    connect?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
  }

  export type StockItemCreateNestedManyWithoutProductInput = {
    create?: XOR<StockItemCreateWithoutProductInput, StockItemUncheckedCreateWithoutProductInput> | StockItemCreateWithoutProductInput[] | StockItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutProductInput | StockItemCreateOrConnectWithoutProductInput[]
    createMany?: StockItemCreateManyProductInputEnvelope
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
  }

  export type QuotationLineItemCreateNestedManyWithoutProductInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type ProductColorVariantUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductColorVariantCreateWithoutProductInput, ProductColorVariantUncheckedCreateWithoutProductInput> | ProductColorVariantCreateWithoutProductInput[] | ProductColorVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductColorVariantCreateOrConnectWithoutProductInput | ProductColorVariantCreateOrConnectWithoutProductInput[]
    createMany?: ProductColorVariantCreateManyProductInputEnvelope
    connect?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
  }

  export type StockItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<StockItemCreateWithoutProductInput, StockItemUncheckedCreateWithoutProductInput> | StockItemCreateWithoutProductInput[] | StockItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutProductInput | StockItemCreateOrConnectWithoutProductInput[]
    createMany?: StockItemCreateManyProductInputEnvelope
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
  }

  export type QuotationLineItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableEnumProductBadgeFieldUpdateOperationsInput = {
    set?: $Enums.ProductBadge | null
  }

  export type EnumStockStatusFieldUpdateOperationsInput = {
    set?: $Enums.StockStatus
  }

  export type ProductUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductColorVariantUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductColorVariantCreateWithoutProductInput, ProductColorVariantUncheckedCreateWithoutProductInput> | ProductColorVariantCreateWithoutProductInput[] | ProductColorVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductColorVariantCreateOrConnectWithoutProductInput | ProductColorVariantCreateOrConnectWithoutProductInput[]
    upsert?: ProductColorVariantUpsertWithWhereUniqueWithoutProductInput | ProductColorVariantUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductColorVariantCreateManyProductInputEnvelope
    set?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    disconnect?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    delete?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    connect?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    update?: ProductColorVariantUpdateWithWhereUniqueWithoutProductInput | ProductColorVariantUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductColorVariantUpdateManyWithWhereWithoutProductInput | ProductColorVariantUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductColorVariantScalarWhereInput | ProductColorVariantScalarWhereInput[]
  }

  export type StockItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<StockItemCreateWithoutProductInput, StockItemUncheckedCreateWithoutProductInput> | StockItemCreateWithoutProductInput[] | StockItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutProductInput | StockItemCreateOrConnectWithoutProductInput[]
    upsert?: StockItemUpsertWithWhereUniqueWithoutProductInput | StockItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: StockItemCreateManyProductInputEnvelope
    set?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    disconnect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    delete?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    update?: StockItemUpdateWithWhereUniqueWithoutProductInput | StockItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: StockItemUpdateManyWithWhereWithoutProductInput | StockItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: StockItemScalarWhereInput | StockItemScalarWhereInput[]
  }

  export type QuotationLineItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutProductInput | QuotationLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutProductInput | QuotationLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutProductInput | QuotationLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type ProductColorVariantUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductColorVariantCreateWithoutProductInput, ProductColorVariantUncheckedCreateWithoutProductInput> | ProductColorVariantCreateWithoutProductInput[] | ProductColorVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductColorVariantCreateOrConnectWithoutProductInput | ProductColorVariantCreateOrConnectWithoutProductInput[]
    upsert?: ProductColorVariantUpsertWithWhereUniqueWithoutProductInput | ProductColorVariantUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductColorVariantCreateManyProductInputEnvelope
    set?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    disconnect?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    delete?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    connect?: ProductColorVariantWhereUniqueInput | ProductColorVariantWhereUniqueInput[]
    update?: ProductColorVariantUpdateWithWhereUniqueWithoutProductInput | ProductColorVariantUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductColorVariantUpdateManyWithWhereWithoutProductInput | ProductColorVariantUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductColorVariantScalarWhereInput | ProductColorVariantScalarWhereInput[]
  }

  export type StockItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<StockItemCreateWithoutProductInput, StockItemUncheckedCreateWithoutProductInput> | StockItemCreateWithoutProductInput[] | StockItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutProductInput | StockItemCreateOrConnectWithoutProductInput[]
    upsert?: StockItemUpsertWithWhereUniqueWithoutProductInput | StockItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: StockItemCreateManyProductInputEnvelope
    set?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    disconnect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    delete?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    update?: StockItemUpdateWithWhereUniqueWithoutProductInput | StockItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: StockItemUpdateManyWithWhereWithoutProductInput | StockItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: StockItemScalarWhereInput | StockItemScalarWhereInput[]
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutProductInput | QuotationLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutProductInput | QuotationLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutProductInput | QuotationLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutColorVariantsInput = {
    create?: XOR<ProductCreateWithoutColorVariantsInput, ProductUncheckedCreateWithoutColorVariantsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutColorVariantsInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutColorVariantsNestedInput = {
    create?: XOR<ProductCreateWithoutColorVariantsInput, ProductUncheckedCreateWithoutColorVariantsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutColorVariantsInput
    upsert?: ProductUpsertWithoutColorVariantsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutColorVariantsInput, ProductUpdateWithoutColorVariantsInput>, ProductUncheckedUpdateWithoutColorVariantsInput>
  }

  export type StockItemCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<StockItemCreateWithoutWarehouseInput, StockItemUncheckedCreateWithoutWarehouseInput> | StockItemCreateWithoutWarehouseInput[] | StockItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutWarehouseInput | StockItemCreateOrConnectWithoutWarehouseInput[]
    createMany?: StockItemCreateManyWarehouseInputEnvelope
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
  }

  export type StockTransferCreateNestedManyWithoutFromInput = {
    create?: XOR<StockTransferCreateWithoutFromInput, StockTransferUncheckedCreateWithoutFromInput> | StockTransferCreateWithoutFromInput[] | StockTransferUncheckedCreateWithoutFromInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutFromInput | StockTransferCreateOrConnectWithoutFromInput[]
    createMany?: StockTransferCreateManyFromInputEnvelope
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
  }

  export type StockTransferCreateNestedManyWithoutToInput = {
    create?: XOR<StockTransferCreateWithoutToInput, StockTransferUncheckedCreateWithoutToInput> | StockTransferCreateWithoutToInput[] | StockTransferUncheckedCreateWithoutToInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutToInput | StockTransferCreateOrConnectWithoutToInput[]
    createMany?: StockTransferCreateManyToInputEnvelope
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
  }

  export type StockItemUncheckedCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<StockItemCreateWithoutWarehouseInput, StockItemUncheckedCreateWithoutWarehouseInput> | StockItemCreateWithoutWarehouseInput[] | StockItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutWarehouseInput | StockItemCreateOrConnectWithoutWarehouseInput[]
    createMany?: StockItemCreateManyWarehouseInputEnvelope
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
  }

  export type StockTransferUncheckedCreateNestedManyWithoutFromInput = {
    create?: XOR<StockTransferCreateWithoutFromInput, StockTransferUncheckedCreateWithoutFromInput> | StockTransferCreateWithoutFromInput[] | StockTransferUncheckedCreateWithoutFromInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutFromInput | StockTransferCreateOrConnectWithoutFromInput[]
    createMany?: StockTransferCreateManyFromInputEnvelope
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
  }

  export type StockTransferUncheckedCreateNestedManyWithoutToInput = {
    create?: XOR<StockTransferCreateWithoutToInput, StockTransferUncheckedCreateWithoutToInput> | StockTransferCreateWithoutToInput[] | StockTransferUncheckedCreateWithoutToInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutToInput | StockTransferCreateOrConnectWithoutToInput[]
    createMany?: StockTransferCreateManyToInputEnvelope
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
  }

  export type StockItemUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<StockItemCreateWithoutWarehouseInput, StockItemUncheckedCreateWithoutWarehouseInput> | StockItemCreateWithoutWarehouseInput[] | StockItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutWarehouseInput | StockItemCreateOrConnectWithoutWarehouseInput[]
    upsert?: StockItemUpsertWithWhereUniqueWithoutWarehouseInput | StockItemUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: StockItemCreateManyWarehouseInputEnvelope
    set?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    disconnect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    delete?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    update?: StockItemUpdateWithWhereUniqueWithoutWarehouseInput | StockItemUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: StockItemUpdateManyWithWhereWithoutWarehouseInput | StockItemUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: StockItemScalarWhereInput | StockItemScalarWhereInput[]
  }

  export type StockTransferUpdateManyWithoutFromNestedInput = {
    create?: XOR<StockTransferCreateWithoutFromInput, StockTransferUncheckedCreateWithoutFromInput> | StockTransferCreateWithoutFromInput[] | StockTransferUncheckedCreateWithoutFromInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutFromInput | StockTransferCreateOrConnectWithoutFromInput[]
    upsert?: StockTransferUpsertWithWhereUniqueWithoutFromInput | StockTransferUpsertWithWhereUniqueWithoutFromInput[]
    createMany?: StockTransferCreateManyFromInputEnvelope
    set?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    disconnect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    delete?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    update?: StockTransferUpdateWithWhereUniqueWithoutFromInput | StockTransferUpdateWithWhereUniqueWithoutFromInput[]
    updateMany?: StockTransferUpdateManyWithWhereWithoutFromInput | StockTransferUpdateManyWithWhereWithoutFromInput[]
    deleteMany?: StockTransferScalarWhereInput | StockTransferScalarWhereInput[]
  }

  export type StockTransferUpdateManyWithoutToNestedInput = {
    create?: XOR<StockTransferCreateWithoutToInput, StockTransferUncheckedCreateWithoutToInput> | StockTransferCreateWithoutToInput[] | StockTransferUncheckedCreateWithoutToInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutToInput | StockTransferCreateOrConnectWithoutToInput[]
    upsert?: StockTransferUpsertWithWhereUniqueWithoutToInput | StockTransferUpsertWithWhereUniqueWithoutToInput[]
    createMany?: StockTransferCreateManyToInputEnvelope
    set?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    disconnect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    delete?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    update?: StockTransferUpdateWithWhereUniqueWithoutToInput | StockTransferUpdateWithWhereUniqueWithoutToInput[]
    updateMany?: StockTransferUpdateManyWithWhereWithoutToInput | StockTransferUpdateManyWithWhereWithoutToInput[]
    deleteMany?: StockTransferScalarWhereInput | StockTransferScalarWhereInput[]
  }

  export type StockItemUncheckedUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<StockItemCreateWithoutWarehouseInput, StockItemUncheckedCreateWithoutWarehouseInput> | StockItemCreateWithoutWarehouseInput[] | StockItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: StockItemCreateOrConnectWithoutWarehouseInput | StockItemCreateOrConnectWithoutWarehouseInput[]
    upsert?: StockItemUpsertWithWhereUniqueWithoutWarehouseInput | StockItemUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: StockItemCreateManyWarehouseInputEnvelope
    set?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    disconnect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    delete?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    connect?: StockItemWhereUniqueInput | StockItemWhereUniqueInput[]
    update?: StockItemUpdateWithWhereUniqueWithoutWarehouseInput | StockItemUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: StockItemUpdateManyWithWhereWithoutWarehouseInput | StockItemUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: StockItemScalarWhereInput | StockItemScalarWhereInput[]
  }

  export type StockTransferUncheckedUpdateManyWithoutFromNestedInput = {
    create?: XOR<StockTransferCreateWithoutFromInput, StockTransferUncheckedCreateWithoutFromInput> | StockTransferCreateWithoutFromInput[] | StockTransferUncheckedCreateWithoutFromInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutFromInput | StockTransferCreateOrConnectWithoutFromInput[]
    upsert?: StockTransferUpsertWithWhereUniqueWithoutFromInput | StockTransferUpsertWithWhereUniqueWithoutFromInput[]
    createMany?: StockTransferCreateManyFromInputEnvelope
    set?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    disconnect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    delete?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    update?: StockTransferUpdateWithWhereUniqueWithoutFromInput | StockTransferUpdateWithWhereUniqueWithoutFromInput[]
    updateMany?: StockTransferUpdateManyWithWhereWithoutFromInput | StockTransferUpdateManyWithWhereWithoutFromInput[]
    deleteMany?: StockTransferScalarWhereInput | StockTransferScalarWhereInput[]
  }

  export type StockTransferUncheckedUpdateManyWithoutToNestedInput = {
    create?: XOR<StockTransferCreateWithoutToInput, StockTransferUncheckedCreateWithoutToInput> | StockTransferCreateWithoutToInput[] | StockTransferUncheckedCreateWithoutToInput[]
    connectOrCreate?: StockTransferCreateOrConnectWithoutToInput | StockTransferCreateOrConnectWithoutToInput[]
    upsert?: StockTransferUpsertWithWhereUniqueWithoutToInput | StockTransferUpsertWithWhereUniqueWithoutToInput[]
    createMany?: StockTransferCreateManyToInputEnvelope
    set?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    disconnect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    delete?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    connect?: StockTransferWhereUniqueInput | StockTransferWhereUniqueInput[]
    update?: StockTransferUpdateWithWhereUniqueWithoutToInput | StockTransferUpdateWithWhereUniqueWithoutToInput[]
    updateMany?: StockTransferUpdateManyWithWhereWithoutToInput | StockTransferUpdateManyWithWhereWithoutToInput[]
    deleteMany?: StockTransferScalarWhereInput | StockTransferScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutStockItemsInput = {
    create?: XOR<ProductCreateWithoutStockItemsInput, ProductUncheckedCreateWithoutStockItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutStockItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type WarehouseCreateNestedOneWithoutStockItemsInput = {
    create?: XOR<WarehouseCreateWithoutStockItemsInput, WarehouseUncheckedCreateWithoutStockItemsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutStockItemsInput
    connect?: WarehouseWhereUniqueInput
  }

  export type StockMovementCreateNestedManyWithoutStockItemInput = {
    create?: XOR<StockMovementCreateWithoutStockItemInput, StockMovementUncheckedCreateWithoutStockItemInput> | StockMovementCreateWithoutStockItemInput[] | StockMovementUncheckedCreateWithoutStockItemInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutStockItemInput | StockMovementCreateOrConnectWithoutStockItemInput[]
    createMany?: StockMovementCreateManyStockItemInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type StockMovementUncheckedCreateNestedManyWithoutStockItemInput = {
    create?: XOR<StockMovementCreateWithoutStockItemInput, StockMovementUncheckedCreateWithoutStockItemInput> | StockMovementCreateWithoutStockItemInput[] | StockMovementUncheckedCreateWithoutStockItemInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutStockItemInput | StockMovementCreateOrConnectWithoutStockItemInput[]
    createMany?: StockMovementCreateManyStockItemInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type EnumStockStateFieldUpdateOperationsInput = {
    set?: $Enums.StockState
  }

  export type ProductUpdateOneRequiredWithoutStockItemsNestedInput = {
    create?: XOR<ProductCreateWithoutStockItemsInput, ProductUncheckedCreateWithoutStockItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutStockItemsInput
    upsert?: ProductUpsertWithoutStockItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutStockItemsInput, ProductUpdateWithoutStockItemsInput>, ProductUncheckedUpdateWithoutStockItemsInput>
  }

  export type WarehouseUpdateOneRequiredWithoutStockItemsNestedInput = {
    create?: XOR<WarehouseCreateWithoutStockItemsInput, WarehouseUncheckedCreateWithoutStockItemsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutStockItemsInput
    upsert?: WarehouseUpsertWithoutStockItemsInput
    connect?: WarehouseWhereUniqueInput
    update?: XOR<XOR<WarehouseUpdateToOneWithWhereWithoutStockItemsInput, WarehouseUpdateWithoutStockItemsInput>, WarehouseUncheckedUpdateWithoutStockItemsInput>
  }

  export type StockMovementUpdateManyWithoutStockItemNestedInput = {
    create?: XOR<StockMovementCreateWithoutStockItemInput, StockMovementUncheckedCreateWithoutStockItemInput> | StockMovementCreateWithoutStockItemInput[] | StockMovementUncheckedCreateWithoutStockItemInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutStockItemInput | StockMovementCreateOrConnectWithoutStockItemInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutStockItemInput | StockMovementUpsertWithWhereUniqueWithoutStockItemInput[]
    createMany?: StockMovementCreateManyStockItemInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutStockItemInput | StockMovementUpdateWithWhereUniqueWithoutStockItemInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutStockItemInput | StockMovementUpdateManyWithWhereWithoutStockItemInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type StockMovementUncheckedUpdateManyWithoutStockItemNestedInput = {
    create?: XOR<StockMovementCreateWithoutStockItemInput, StockMovementUncheckedCreateWithoutStockItemInput> | StockMovementCreateWithoutStockItemInput[] | StockMovementUncheckedCreateWithoutStockItemInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutStockItemInput | StockMovementCreateOrConnectWithoutStockItemInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutStockItemInput | StockMovementUpsertWithWhereUniqueWithoutStockItemInput[]
    createMany?: StockMovementCreateManyStockItemInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutStockItemInput | StockMovementUpdateWithWhereUniqueWithoutStockItemInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutStockItemInput | StockMovementUpdateManyWithWhereWithoutStockItemInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type StockItemCreateNestedOneWithoutMovementsInput = {
    create?: XOR<StockItemCreateWithoutMovementsInput, StockItemUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: StockItemCreateOrConnectWithoutMovementsInput
    connect?: StockItemWhereUniqueInput
  }

  export type EnumStockMovementTypeFieldUpdateOperationsInput = {
    set?: $Enums.StockMovementType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StockItemUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: XOR<StockItemCreateWithoutMovementsInput, StockItemUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: StockItemCreateOrConnectWithoutMovementsInput
    upsert?: StockItemUpsertWithoutMovementsInput
    connect?: StockItemWhereUniqueInput
    update?: XOR<XOR<StockItemUpdateToOneWithWhereWithoutMovementsInput, StockItemUpdateWithoutMovementsInput>, StockItemUncheckedUpdateWithoutMovementsInput>
  }

  export type WarehouseCreateNestedOneWithoutTransfersFromInput = {
    create?: XOR<WarehouseCreateWithoutTransfersFromInput, WarehouseUncheckedCreateWithoutTransfersFromInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutTransfersFromInput
    connect?: WarehouseWhereUniqueInput
  }

  export type WarehouseCreateNestedOneWithoutTransfersToInput = {
    create?: XOR<WarehouseCreateWithoutTransfersToInput, WarehouseUncheckedCreateWithoutTransfersToInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutTransfersToInput
    connect?: WarehouseWhereUniqueInput
  }

  export type WarehouseUpdateOneRequiredWithoutTransfersFromNestedInput = {
    create?: XOR<WarehouseCreateWithoutTransfersFromInput, WarehouseUncheckedCreateWithoutTransfersFromInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutTransfersFromInput
    upsert?: WarehouseUpsertWithoutTransfersFromInput
    connect?: WarehouseWhereUniqueInput
    update?: XOR<XOR<WarehouseUpdateToOneWithWhereWithoutTransfersFromInput, WarehouseUpdateWithoutTransfersFromInput>, WarehouseUncheckedUpdateWithoutTransfersFromInput>
  }

  export type WarehouseUpdateOneRequiredWithoutTransfersToNestedInput = {
    create?: XOR<WarehouseCreateWithoutTransfersToInput, WarehouseUncheckedCreateWithoutTransfersToInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutTransfersToInput
    upsert?: WarehouseUpsertWithoutTransfersToInput
    connect?: WarehouseWhereUniqueInput
    update?: XOR<XOR<WarehouseUpdateToOneWithWhereWithoutTransfersToInput, WarehouseUpdateWithoutTransfersToInput>, WarehouseUncheckedUpdateWithoutTransfersToInput>
  }

  export type QuotationCreateNestedManyWithoutLeadInput = {
    create?: XOR<QuotationCreateWithoutLeadInput, QuotationUncheckedCreateWithoutLeadInput> | QuotationCreateWithoutLeadInput[] | QuotationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutLeadInput | QuotationCreateOrConnectWithoutLeadInput[]
    createMany?: QuotationCreateManyLeadInputEnvelope
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
  }

  export type QuotationUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<QuotationCreateWithoutLeadInput, QuotationUncheckedCreateWithoutLeadInput> | QuotationCreateWithoutLeadInput[] | QuotationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutLeadInput | QuotationCreateOrConnectWithoutLeadInput[]
    createMany?: QuotationCreateManyLeadInputEnvelope
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumCrmStageFieldUpdateOperationsInput = {
    set?: $Enums.CrmStage
  }

  export type QuotationUpdateManyWithoutLeadNestedInput = {
    create?: XOR<QuotationCreateWithoutLeadInput, QuotationUncheckedCreateWithoutLeadInput> | QuotationCreateWithoutLeadInput[] | QuotationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutLeadInput | QuotationCreateOrConnectWithoutLeadInput[]
    upsert?: QuotationUpsertWithWhereUniqueWithoutLeadInput | QuotationUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: QuotationCreateManyLeadInputEnvelope
    set?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    disconnect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    delete?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    update?: QuotationUpdateWithWhereUniqueWithoutLeadInput | QuotationUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: QuotationUpdateManyWithWhereWithoutLeadInput | QuotationUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
  }

  export type QuotationUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<QuotationCreateWithoutLeadInput, QuotationUncheckedCreateWithoutLeadInput> | QuotationCreateWithoutLeadInput[] | QuotationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutLeadInput | QuotationCreateOrConnectWithoutLeadInput[]
    upsert?: QuotationUpsertWithWhereUniqueWithoutLeadInput | QuotationUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: QuotationCreateManyLeadInputEnvelope
    set?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    disconnect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    delete?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    update?: QuotationUpdateWithWhereUniqueWithoutLeadInput | QuotationUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: QuotationUpdateManyWithWhereWithoutLeadInput | QuotationUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
  }

  export type LeadCreateNestedOneWithoutQuotationsInput = {
    create?: XOR<LeadCreateWithoutQuotationsInput, LeadUncheckedCreateWithoutQuotationsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutQuotationsInput
    connect?: LeadWhereUniqueInput
  }

  export type QuotationLineItemCreateNestedManyWithoutQuotationInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type OrderCreateNestedOneWithoutQuotationInput = {
    create?: XOR<OrderCreateWithoutQuotationInput, OrderUncheckedCreateWithoutQuotationInput>
    connectOrCreate?: OrderCreateOrConnectWithoutQuotationInput
    connect?: OrderWhereUniqueInput
  }

  export type QuotationLineItemUncheckedCreateNestedManyWithoutQuotationInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedOneWithoutQuotationInput = {
    create?: XOR<OrderCreateWithoutQuotationInput, OrderUncheckedCreateWithoutQuotationInput>
    connectOrCreate?: OrderCreateOrConnectWithoutQuotationInput
    connect?: OrderWhereUniqueInput
  }

  export type EnumQuotationStatusFieldUpdateOperationsInput = {
    set?: $Enums.QuotationStatus
  }

  export type LeadUpdateOneRequiredWithoutQuotationsNestedInput = {
    create?: XOR<LeadCreateWithoutQuotationsInput, LeadUncheckedCreateWithoutQuotationsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutQuotationsInput
    upsert?: LeadUpsertWithoutQuotationsInput
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutQuotationsInput, LeadUpdateWithoutQuotationsInput>, LeadUncheckedUpdateWithoutQuotationsInput>
  }

  export type QuotationLineItemUpdateManyWithoutQuotationNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutQuotationInput | QuotationLineItemUpdateManyWithWhereWithoutQuotationInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type OrderUpdateOneWithoutQuotationNestedInput = {
    create?: XOR<OrderCreateWithoutQuotationInput, OrderUncheckedCreateWithoutQuotationInput>
    connectOrCreate?: OrderCreateOrConnectWithoutQuotationInput
    upsert?: OrderUpsertWithoutQuotationInput
    disconnect?: OrderWhereInput | boolean
    delete?: OrderWhereInput | boolean
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutQuotationInput, OrderUpdateWithoutQuotationInput>, OrderUncheckedUpdateWithoutQuotationInput>
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutQuotationNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutQuotationInput | QuotationLineItemUpdateManyWithWhereWithoutQuotationInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type OrderUncheckedUpdateOneWithoutQuotationNestedInput = {
    create?: XOR<OrderCreateWithoutQuotationInput, OrderUncheckedCreateWithoutQuotationInput>
    connectOrCreate?: OrderCreateOrConnectWithoutQuotationInput
    upsert?: OrderUpsertWithoutQuotationInput
    disconnect?: OrderWhereInput | boolean
    delete?: OrderWhereInput | boolean
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutQuotationInput, OrderUpdateWithoutQuotationInput>, OrderUncheckedUpdateWithoutQuotationInput>
  }

  export type QuotationCreateNestedOneWithoutLineItemsInput = {
    create?: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: QuotationCreateOrConnectWithoutLineItemsInput
    connect?: QuotationWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutQuotationItemsInput = {
    create?: XOR<ProductCreateWithoutQuotationItemsInput, ProductUncheckedCreateWithoutQuotationItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutQuotationItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type QuotationUpdateOneRequiredWithoutLineItemsNestedInput = {
    create?: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: QuotationCreateOrConnectWithoutLineItemsInput
    upsert?: QuotationUpsertWithoutLineItemsInput
    connect?: QuotationWhereUniqueInput
    update?: XOR<XOR<QuotationUpdateToOneWithWhereWithoutLineItemsInput, QuotationUpdateWithoutLineItemsInput>, QuotationUncheckedUpdateWithoutLineItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutQuotationItemsNestedInput = {
    create?: XOR<ProductCreateWithoutQuotationItemsInput, ProductUncheckedCreateWithoutQuotationItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutQuotationItemsInput
    upsert?: ProductUpsertWithoutQuotationItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutQuotationItemsInput, ProductUpdateWithoutQuotationItemsInput>, ProductUncheckedUpdateWithoutQuotationItemsInput>
  }

  export type QuotationCreateNestedOneWithoutOrderInput = {
    create?: XOR<QuotationCreateWithoutOrderInput, QuotationUncheckedCreateWithoutOrderInput>
    connectOrCreate?: QuotationCreateOrConnectWithoutOrderInput
    connect?: QuotationWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutOrderInput = {
    create?: XOR<PaymentCreateWithoutOrderInput, PaymentUncheckedCreateWithoutOrderInput> | PaymentCreateWithoutOrderInput[] | PaymentUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrderInput | PaymentCreateOrConnectWithoutOrderInput[]
    createMany?: PaymentCreateManyOrderInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<PaymentCreateWithoutOrderInput, PaymentUncheckedCreateWithoutOrderInput> | PaymentCreateWithoutOrderInput[] | PaymentUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrderInput | PaymentCreateOrConnectWithoutOrderInput[]
    createMany?: PaymentCreateManyOrderInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type QuotationUpdateOneRequiredWithoutOrderNestedInput = {
    create?: XOR<QuotationCreateWithoutOrderInput, QuotationUncheckedCreateWithoutOrderInput>
    connectOrCreate?: QuotationCreateOrConnectWithoutOrderInput
    upsert?: QuotationUpsertWithoutOrderInput
    connect?: QuotationWhereUniqueInput
    update?: XOR<XOR<QuotationUpdateToOneWithWhereWithoutOrderInput, QuotationUpdateWithoutOrderInput>, QuotationUncheckedUpdateWithoutOrderInput>
  }

  export type PaymentUpdateManyWithoutOrderNestedInput = {
    create?: XOR<PaymentCreateWithoutOrderInput, PaymentUncheckedCreateWithoutOrderInput> | PaymentCreateWithoutOrderInput[] | PaymentUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrderInput | PaymentCreateOrConnectWithoutOrderInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutOrderInput | PaymentUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: PaymentCreateManyOrderInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutOrderInput | PaymentUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutOrderInput | PaymentUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<PaymentCreateWithoutOrderInput, PaymentUncheckedCreateWithoutOrderInput> | PaymentCreateWithoutOrderInput[] | PaymentUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutOrderInput | PaymentCreateOrConnectWithoutOrderInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutOrderInput | PaymentUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: PaymentCreateManyOrderInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutOrderInput | PaymentUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutOrderInput | PaymentUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type OrderCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<OrderCreateWithoutPaymentsInput, OrderUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutPaymentsInput
    connect?: OrderWhereUniqueInput
  }

  export type EnumPaymentTypeFieldUpdateOperationsInput = {
    set?: $Enums.PaymentType
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type OrderUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<OrderCreateWithoutPaymentsInput, OrderUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutPaymentsInput
    upsert?: OrderUpsertWithoutPaymentsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutPaymentsInput, OrderUpdateWithoutPaymentsInput>, OrderUncheckedUpdateWithoutPaymentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumProductBadgeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductBadge | EnumProductBadgeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProductBadgeNullableFilter<$PrismaModel> | $Enums.ProductBadge | null
  }

  export type NestedEnumStockStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StockStatus | EnumStockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStatusFilter<$PrismaModel> | $Enums.StockStatus
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumProductBadgeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductBadge | EnumProductBadgeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ProductBadge[] | ListEnumProductBadgeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumProductBadgeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProductBadge | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumProductBadgeNullableFilter<$PrismaModel>
    _max?: NestedEnumProductBadgeNullableFilter<$PrismaModel>
  }

  export type NestedEnumStockStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockStatus | EnumStockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockStatus[] | ListEnumStockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStatusWithAggregatesFilter<$PrismaModel> | $Enums.StockStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStockStatusFilter<$PrismaModel>
    _max?: NestedEnumStockStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumStockStateFilter<$PrismaModel = never> = {
    equals?: $Enums.StockState | EnumStockStateFieldRefInput<$PrismaModel>
    in?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStateFilter<$PrismaModel> | $Enums.StockState
  }

  export type NestedEnumStockStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockState | EnumStockStateFieldRefInput<$PrismaModel>
    in?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockState[] | ListEnumStockStateFieldRefInput<$PrismaModel>
    not?: NestedEnumStockStateWithAggregatesFilter<$PrismaModel> | $Enums.StockState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStockStateFilter<$PrismaModel>
    _max?: NestedEnumStockStateFilter<$PrismaModel>
  }

  export type NestedEnumStockMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | EnumStockMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStockMovementTypeFilter<$PrismaModel> | $Enums.StockMovementType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | EnumStockMovementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StockMovementType[] | ListEnumStockMovementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockMovementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStockMovementTypeFilter<$PrismaModel>
    _max?: NestedEnumStockMovementTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumCrmStageFilter<$PrismaModel = never> = {
    equals?: $Enums.CrmStage | EnumCrmStageFieldRefInput<$PrismaModel>
    in?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    not?: NestedEnumCrmStageFilter<$PrismaModel> | $Enums.CrmStage
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumCrmStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CrmStage | EnumCrmStageFieldRefInput<$PrismaModel>
    in?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.CrmStage[] | ListEnumCrmStageFieldRefInput<$PrismaModel>
    not?: NestedEnumCrmStageWithAggregatesFilter<$PrismaModel> | $Enums.CrmStage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCrmStageFilter<$PrismaModel>
    _max?: NestedEnumCrmStageFilter<$PrismaModel>
  }

  export type NestedEnumQuotationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuotationStatus | EnumQuotationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuotationStatusFilter<$PrismaModel> | $Enums.QuotationStatus
  }

  export type NestedEnumQuotationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuotationStatus | EnumQuotationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuotationStatus[] | ListEnumQuotationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQuotationStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuotationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuotationStatusFilter<$PrismaModel>
    _max?: NestedEnumQuotationStatusFilter<$PrismaModel>
  }

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumPaymentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeFilter<$PrismaModel> | $Enums.PaymentType
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type ProductColorVariantCreateWithoutProductInput = {
    id?: string
    name: string
    hex: string
  }

  export type ProductColorVariantUncheckedCreateWithoutProductInput = {
    id?: string
    name: string
    hex: string
  }

  export type ProductColorVariantCreateOrConnectWithoutProductInput = {
    where: ProductColorVariantWhereUniqueInput
    create: XOR<ProductColorVariantCreateWithoutProductInput, ProductColorVariantUncheckedCreateWithoutProductInput>
  }

  export type ProductColorVariantCreateManyProductInputEnvelope = {
    data: ProductColorVariantCreateManyProductInput | ProductColorVariantCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type StockItemCreateWithoutProductInput = {
    id?: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutStockItemsInput
    movements?: StockMovementCreateNestedManyWithoutStockItemInput
  }

  export type StockItemUncheckedCreateWithoutProductInput = {
    id?: string
    warehouseId: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: StockMovementUncheckedCreateNestedManyWithoutStockItemInput
  }

  export type StockItemCreateOrConnectWithoutProductInput = {
    where: StockItemWhereUniqueInput
    create: XOR<StockItemCreateWithoutProductInput, StockItemUncheckedCreateWithoutProductInput>
  }

  export type StockItemCreateManyProductInputEnvelope = {
    data: StockItemCreateManyProductInput | StockItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type QuotationLineItemCreateWithoutProductInput = {
    id?: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
    quotation: QuotationCreateNestedOneWithoutLineItemsInput
  }

  export type QuotationLineItemUncheckedCreateWithoutProductInput = {
    id?: string
    quotationId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemCreateOrConnectWithoutProductInput = {
    where: QuotationLineItemWhereUniqueInput
    create: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput>
  }

  export type QuotationLineItemCreateManyProductInputEnvelope = {
    data: QuotationLineItemCreateManyProductInput | QuotationLineItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type ProductColorVariantUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductColorVariantWhereUniqueInput
    update: XOR<ProductColorVariantUpdateWithoutProductInput, ProductColorVariantUncheckedUpdateWithoutProductInput>
    create: XOR<ProductColorVariantCreateWithoutProductInput, ProductColorVariantUncheckedCreateWithoutProductInput>
  }

  export type ProductColorVariantUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductColorVariantWhereUniqueInput
    data: XOR<ProductColorVariantUpdateWithoutProductInput, ProductColorVariantUncheckedUpdateWithoutProductInput>
  }

  export type ProductColorVariantUpdateManyWithWhereWithoutProductInput = {
    where: ProductColorVariantScalarWhereInput
    data: XOR<ProductColorVariantUpdateManyMutationInput, ProductColorVariantUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductColorVariantScalarWhereInput = {
    AND?: ProductColorVariantScalarWhereInput | ProductColorVariantScalarWhereInput[]
    OR?: ProductColorVariantScalarWhereInput[]
    NOT?: ProductColorVariantScalarWhereInput | ProductColorVariantScalarWhereInput[]
    id?: StringFilter<"ProductColorVariant"> | string
    productId?: StringFilter<"ProductColorVariant"> | string
    name?: StringFilter<"ProductColorVariant"> | string
    hex?: StringFilter<"ProductColorVariant"> | string
  }

  export type StockItemUpsertWithWhereUniqueWithoutProductInput = {
    where: StockItemWhereUniqueInput
    update: XOR<StockItemUpdateWithoutProductInput, StockItemUncheckedUpdateWithoutProductInput>
    create: XOR<StockItemCreateWithoutProductInput, StockItemUncheckedCreateWithoutProductInput>
  }

  export type StockItemUpdateWithWhereUniqueWithoutProductInput = {
    where: StockItemWhereUniqueInput
    data: XOR<StockItemUpdateWithoutProductInput, StockItemUncheckedUpdateWithoutProductInput>
  }

  export type StockItemUpdateManyWithWhereWithoutProductInput = {
    where: StockItemScalarWhereInput
    data: XOR<StockItemUpdateManyMutationInput, StockItemUncheckedUpdateManyWithoutProductInput>
  }

  export type StockItemScalarWhereInput = {
    AND?: StockItemScalarWhereInput | StockItemScalarWhereInput[]
    OR?: StockItemScalarWhereInput[]
    NOT?: StockItemScalarWhereInput | StockItemScalarWhereInput[]
    id?: StringFilter<"StockItem"> | string
    productId?: StringFilter<"StockItem"> | string
    warehouseId?: StringFilter<"StockItem"> | string
    sku?: StringFilter<"StockItem"> | string
    qtyAvailable?: IntFilter<"StockItem"> | number
    qtyReserved?: IntFilter<"StockItem"> | number
    qtyInProduction?: IntFilter<"StockItem"> | number
    minThreshold?: IntFilter<"StockItem"> | number
    state?: EnumStockStateFilter<"StockItem"> | $Enums.StockState
    createdAt?: DateTimeFilter<"StockItem"> | Date | string
    updatedAt?: DateTimeFilter<"StockItem"> | Date | string
  }

  export type QuotationLineItemUpsertWithWhereUniqueWithoutProductInput = {
    where: QuotationLineItemWhereUniqueInput
    update: XOR<QuotationLineItemUpdateWithoutProductInput, QuotationLineItemUncheckedUpdateWithoutProductInput>
    create: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput>
  }

  export type QuotationLineItemUpdateWithWhereUniqueWithoutProductInput = {
    where: QuotationLineItemWhereUniqueInput
    data: XOR<QuotationLineItemUpdateWithoutProductInput, QuotationLineItemUncheckedUpdateWithoutProductInput>
  }

  export type QuotationLineItemUpdateManyWithWhereWithoutProductInput = {
    where: QuotationLineItemScalarWhereInput
    data: XOR<QuotationLineItemUpdateManyMutationInput, QuotationLineItemUncheckedUpdateManyWithoutProductInput>
  }

  export type QuotationLineItemScalarWhereInput = {
    AND?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
    OR?: QuotationLineItemScalarWhereInput[]
    NOT?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
    id?: StringFilter<"QuotationLineItem"> | string
    quotationId?: StringFilter<"QuotationLineItem"> | string
    productId?: StringFilter<"QuotationLineItem"> | string
    productName?: StringFilter<"QuotationLineItem"> | string
    quantity?: IntFilter<"QuotationLineItem"> | number
    unitPrice?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    dimensions?: StringNullableFilter<"QuotationLineItem"> | string | null
    finish?: StringNullableFilter<"QuotationLineItem"> | string | null
    total?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type ProductCreateWithoutColorVariantsInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    stockItems?: StockItemCreateNestedManyWithoutProductInput
    quotationItems?: QuotationLineItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutColorVariantsInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    stockItems?: StockItemUncheckedCreateNestedManyWithoutProductInput
    quotationItems?: QuotationLineItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutColorVariantsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutColorVariantsInput, ProductUncheckedCreateWithoutColorVariantsInput>
  }

  export type ProductUpsertWithoutColorVariantsInput = {
    update: XOR<ProductUpdateWithoutColorVariantsInput, ProductUncheckedUpdateWithoutColorVariantsInput>
    create: XOR<ProductCreateWithoutColorVariantsInput, ProductUncheckedCreateWithoutColorVariantsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutColorVariantsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutColorVariantsInput, ProductUncheckedUpdateWithoutColorVariantsInput>
  }

  export type ProductUpdateWithoutColorVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stockItems?: StockItemUpdateManyWithoutProductNestedInput
    quotationItems?: QuotationLineItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutColorVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stockItems?: StockItemUncheckedUpdateManyWithoutProductNestedInput
    quotationItems?: QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type StockItemCreateWithoutWarehouseInput = {
    id?: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutStockItemsInput
    movements?: StockMovementCreateNestedManyWithoutStockItemInput
  }

  export type StockItemUncheckedCreateWithoutWarehouseInput = {
    id?: string
    productId: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: StockMovementUncheckedCreateNestedManyWithoutStockItemInput
  }

  export type StockItemCreateOrConnectWithoutWarehouseInput = {
    where: StockItemWhereUniqueInput
    create: XOR<StockItemCreateWithoutWarehouseInput, StockItemUncheckedCreateWithoutWarehouseInput>
  }

  export type StockItemCreateManyWarehouseInputEnvelope = {
    data: StockItemCreateManyWarehouseInput | StockItemCreateManyWarehouseInput[]
    skipDuplicates?: boolean
  }

  export type StockTransferCreateWithoutFromInput = {
    id?: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
    to: WarehouseCreateNestedOneWithoutTransfersToInput
  }

  export type StockTransferUncheckedCreateWithoutFromInput = {
    id?: string
    toWarehouse: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type StockTransferCreateOrConnectWithoutFromInput = {
    where: StockTransferWhereUniqueInput
    create: XOR<StockTransferCreateWithoutFromInput, StockTransferUncheckedCreateWithoutFromInput>
  }

  export type StockTransferCreateManyFromInputEnvelope = {
    data: StockTransferCreateManyFromInput | StockTransferCreateManyFromInput[]
    skipDuplicates?: boolean
  }

  export type StockTransferCreateWithoutToInput = {
    id?: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
    from: WarehouseCreateNestedOneWithoutTransfersFromInput
  }

  export type StockTransferUncheckedCreateWithoutToInput = {
    id?: string
    fromWarehouse: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type StockTransferCreateOrConnectWithoutToInput = {
    where: StockTransferWhereUniqueInput
    create: XOR<StockTransferCreateWithoutToInput, StockTransferUncheckedCreateWithoutToInput>
  }

  export type StockTransferCreateManyToInputEnvelope = {
    data: StockTransferCreateManyToInput | StockTransferCreateManyToInput[]
    skipDuplicates?: boolean
  }

  export type StockItemUpsertWithWhereUniqueWithoutWarehouseInput = {
    where: StockItemWhereUniqueInput
    update: XOR<StockItemUpdateWithoutWarehouseInput, StockItemUncheckedUpdateWithoutWarehouseInput>
    create: XOR<StockItemCreateWithoutWarehouseInput, StockItemUncheckedCreateWithoutWarehouseInput>
  }

  export type StockItemUpdateWithWhereUniqueWithoutWarehouseInput = {
    where: StockItemWhereUniqueInput
    data: XOR<StockItemUpdateWithoutWarehouseInput, StockItemUncheckedUpdateWithoutWarehouseInput>
  }

  export type StockItemUpdateManyWithWhereWithoutWarehouseInput = {
    where: StockItemScalarWhereInput
    data: XOR<StockItemUpdateManyMutationInput, StockItemUncheckedUpdateManyWithoutWarehouseInput>
  }

  export type StockTransferUpsertWithWhereUniqueWithoutFromInput = {
    where: StockTransferWhereUniqueInput
    update: XOR<StockTransferUpdateWithoutFromInput, StockTransferUncheckedUpdateWithoutFromInput>
    create: XOR<StockTransferCreateWithoutFromInput, StockTransferUncheckedCreateWithoutFromInput>
  }

  export type StockTransferUpdateWithWhereUniqueWithoutFromInput = {
    where: StockTransferWhereUniqueInput
    data: XOR<StockTransferUpdateWithoutFromInput, StockTransferUncheckedUpdateWithoutFromInput>
  }

  export type StockTransferUpdateManyWithWhereWithoutFromInput = {
    where: StockTransferScalarWhereInput
    data: XOR<StockTransferUpdateManyMutationInput, StockTransferUncheckedUpdateManyWithoutFromInput>
  }

  export type StockTransferScalarWhereInput = {
    AND?: StockTransferScalarWhereInput | StockTransferScalarWhereInput[]
    OR?: StockTransferScalarWhereInput[]
    NOT?: StockTransferScalarWhereInput | StockTransferScalarWhereInput[]
    id?: StringFilter<"StockTransfer"> | string
    fromWarehouse?: StringFilter<"StockTransfer"> | string
    toWarehouse?: StringFilter<"StockTransfer"> | string
    productId?: StringFilter<"StockTransfer"> | string
    quantity?: IntFilter<"StockTransfer"> | number
    reason?: StringNullableFilter<"StockTransfer"> | string | null
    status?: StringFilter<"StockTransfer"> | string
    createdAt?: DateTimeFilter<"StockTransfer"> | Date | string
  }

  export type StockTransferUpsertWithWhereUniqueWithoutToInput = {
    where: StockTransferWhereUniqueInput
    update: XOR<StockTransferUpdateWithoutToInput, StockTransferUncheckedUpdateWithoutToInput>
    create: XOR<StockTransferCreateWithoutToInput, StockTransferUncheckedCreateWithoutToInput>
  }

  export type StockTransferUpdateWithWhereUniqueWithoutToInput = {
    where: StockTransferWhereUniqueInput
    data: XOR<StockTransferUpdateWithoutToInput, StockTransferUncheckedUpdateWithoutToInput>
  }

  export type StockTransferUpdateManyWithWhereWithoutToInput = {
    where: StockTransferScalarWhereInput
    data: XOR<StockTransferUpdateManyMutationInput, StockTransferUncheckedUpdateManyWithoutToInput>
  }

  export type ProductCreateWithoutStockItemsInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    colorVariants?: ProductColorVariantCreateNestedManyWithoutProductInput
    quotationItems?: QuotationLineItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutStockItemsInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    colorVariants?: ProductColorVariantUncheckedCreateNestedManyWithoutProductInput
    quotationItems?: QuotationLineItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutStockItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutStockItemsInput, ProductUncheckedCreateWithoutStockItemsInput>
  }

  export type WarehouseCreateWithoutStockItemsInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    transfersFrom?: StockTransferCreateNestedManyWithoutFromInput
    transfersTo?: StockTransferCreateNestedManyWithoutToInput
  }

  export type WarehouseUncheckedCreateWithoutStockItemsInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    transfersFrom?: StockTransferUncheckedCreateNestedManyWithoutFromInput
    transfersTo?: StockTransferUncheckedCreateNestedManyWithoutToInput
  }

  export type WarehouseCreateOrConnectWithoutStockItemsInput = {
    where: WarehouseWhereUniqueInput
    create: XOR<WarehouseCreateWithoutStockItemsInput, WarehouseUncheckedCreateWithoutStockItemsInput>
  }

  export type StockMovementCreateWithoutStockItemInput = {
    id?: string
    type: $Enums.StockMovementType
    quantity: number
    actor: string
    reference?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUncheckedCreateWithoutStockItemInput = {
    id?: string
    type: $Enums.StockMovementType
    quantity: number
    actor: string
    reference?: string | null
    createdAt?: Date | string
  }

  export type StockMovementCreateOrConnectWithoutStockItemInput = {
    where: StockMovementWhereUniqueInput
    create: XOR<StockMovementCreateWithoutStockItemInput, StockMovementUncheckedCreateWithoutStockItemInput>
  }

  export type StockMovementCreateManyStockItemInputEnvelope = {
    data: StockMovementCreateManyStockItemInput | StockMovementCreateManyStockItemInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithoutStockItemsInput = {
    update: XOR<ProductUpdateWithoutStockItemsInput, ProductUncheckedUpdateWithoutStockItemsInput>
    create: XOR<ProductCreateWithoutStockItemsInput, ProductUncheckedCreateWithoutStockItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutStockItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutStockItemsInput, ProductUncheckedUpdateWithoutStockItemsInput>
  }

  export type ProductUpdateWithoutStockItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    colorVariants?: ProductColorVariantUpdateManyWithoutProductNestedInput
    quotationItems?: QuotationLineItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutStockItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    colorVariants?: ProductColorVariantUncheckedUpdateManyWithoutProductNestedInput
    quotationItems?: QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type WarehouseUpsertWithoutStockItemsInput = {
    update: XOR<WarehouseUpdateWithoutStockItemsInput, WarehouseUncheckedUpdateWithoutStockItemsInput>
    create: XOR<WarehouseCreateWithoutStockItemsInput, WarehouseUncheckedCreateWithoutStockItemsInput>
    where?: WarehouseWhereInput
  }

  export type WarehouseUpdateToOneWithWhereWithoutStockItemsInput = {
    where?: WarehouseWhereInput
    data: XOR<WarehouseUpdateWithoutStockItemsInput, WarehouseUncheckedUpdateWithoutStockItemsInput>
  }

  export type WarehouseUpdateWithoutStockItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    transfersFrom?: StockTransferUpdateManyWithoutFromNestedInput
    transfersTo?: StockTransferUpdateManyWithoutToNestedInput
  }

  export type WarehouseUncheckedUpdateWithoutStockItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    transfersFrom?: StockTransferUncheckedUpdateManyWithoutFromNestedInput
    transfersTo?: StockTransferUncheckedUpdateManyWithoutToNestedInput
  }

  export type StockMovementUpsertWithWhereUniqueWithoutStockItemInput = {
    where: StockMovementWhereUniqueInput
    update: XOR<StockMovementUpdateWithoutStockItemInput, StockMovementUncheckedUpdateWithoutStockItemInput>
    create: XOR<StockMovementCreateWithoutStockItemInput, StockMovementUncheckedCreateWithoutStockItemInput>
  }

  export type StockMovementUpdateWithWhereUniqueWithoutStockItemInput = {
    where: StockMovementWhereUniqueInput
    data: XOR<StockMovementUpdateWithoutStockItemInput, StockMovementUncheckedUpdateWithoutStockItemInput>
  }

  export type StockMovementUpdateManyWithWhereWithoutStockItemInput = {
    where: StockMovementScalarWhereInput
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyWithoutStockItemInput>
  }

  export type StockMovementScalarWhereInput = {
    AND?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    OR?: StockMovementScalarWhereInput[]
    NOT?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    id?: StringFilter<"StockMovement"> | string
    stockItemId?: StringFilter<"StockMovement"> | string
    type?: EnumStockMovementTypeFilter<"StockMovement"> | $Enums.StockMovementType
    quantity?: IntFilter<"StockMovement"> | number
    actor?: StringFilter<"StockMovement"> | string
    reference?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
  }

  export type StockItemCreateWithoutMovementsInput = {
    id?: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutStockItemsInput
    warehouse: WarehouseCreateNestedOneWithoutStockItemsInput
  }

  export type StockItemUncheckedCreateWithoutMovementsInput = {
    id?: string
    productId: string
    warehouseId: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockItemCreateOrConnectWithoutMovementsInput = {
    where: StockItemWhereUniqueInput
    create: XOR<StockItemCreateWithoutMovementsInput, StockItemUncheckedCreateWithoutMovementsInput>
  }

  export type StockItemUpsertWithoutMovementsInput = {
    update: XOR<StockItemUpdateWithoutMovementsInput, StockItemUncheckedUpdateWithoutMovementsInput>
    create: XOR<StockItemCreateWithoutMovementsInput, StockItemUncheckedCreateWithoutMovementsInput>
    where?: StockItemWhereInput
  }

  export type StockItemUpdateToOneWithWhereWithoutMovementsInput = {
    where?: StockItemWhereInput
    data: XOR<StockItemUpdateWithoutMovementsInput, StockItemUncheckedUpdateWithoutMovementsInput>
  }

  export type StockItemUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutStockItemsNestedInput
    warehouse?: WarehouseUpdateOneRequiredWithoutStockItemsNestedInput
  }

  export type StockItemUncheckedUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    warehouseId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarehouseCreateWithoutTransfersFromInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    stockItems?: StockItemCreateNestedManyWithoutWarehouseInput
    transfersTo?: StockTransferCreateNestedManyWithoutToInput
  }

  export type WarehouseUncheckedCreateWithoutTransfersFromInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    stockItems?: StockItemUncheckedCreateNestedManyWithoutWarehouseInput
    transfersTo?: StockTransferUncheckedCreateNestedManyWithoutToInput
  }

  export type WarehouseCreateOrConnectWithoutTransfersFromInput = {
    where: WarehouseWhereUniqueInput
    create: XOR<WarehouseCreateWithoutTransfersFromInput, WarehouseUncheckedCreateWithoutTransfersFromInput>
  }

  export type WarehouseCreateWithoutTransfersToInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    stockItems?: StockItemCreateNestedManyWithoutWarehouseInput
    transfersFrom?: StockTransferCreateNestedManyWithoutFromInput
  }

  export type WarehouseUncheckedCreateWithoutTransfersToInput = {
    id?: string
    name: string
    branchCode: string
    address: string
    stockItems?: StockItemUncheckedCreateNestedManyWithoutWarehouseInput
    transfersFrom?: StockTransferUncheckedCreateNestedManyWithoutFromInput
  }

  export type WarehouseCreateOrConnectWithoutTransfersToInput = {
    where: WarehouseWhereUniqueInput
    create: XOR<WarehouseCreateWithoutTransfersToInput, WarehouseUncheckedCreateWithoutTransfersToInput>
  }

  export type WarehouseUpsertWithoutTransfersFromInput = {
    update: XOR<WarehouseUpdateWithoutTransfersFromInput, WarehouseUncheckedUpdateWithoutTransfersFromInput>
    create: XOR<WarehouseCreateWithoutTransfersFromInput, WarehouseUncheckedCreateWithoutTransfersFromInput>
    where?: WarehouseWhereInput
  }

  export type WarehouseUpdateToOneWithWhereWithoutTransfersFromInput = {
    where?: WarehouseWhereInput
    data: XOR<WarehouseUpdateWithoutTransfersFromInput, WarehouseUncheckedUpdateWithoutTransfersFromInput>
  }

  export type WarehouseUpdateWithoutTransfersFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    stockItems?: StockItemUpdateManyWithoutWarehouseNestedInput
    transfersTo?: StockTransferUpdateManyWithoutToNestedInput
  }

  export type WarehouseUncheckedUpdateWithoutTransfersFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    stockItems?: StockItemUncheckedUpdateManyWithoutWarehouseNestedInput
    transfersTo?: StockTransferUncheckedUpdateManyWithoutToNestedInput
  }

  export type WarehouseUpsertWithoutTransfersToInput = {
    update: XOR<WarehouseUpdateWithoutTransfersToInput, WarehouseUncheckedUpdateWithoutTransfersToInput>
    create: XOR<WarehouseCreateWithoutTransfersToInput, WarehouseUncheckedCreateWithoutTransfersToInput>
    where?: WarehouseWhereInput
  }

  export type WarehouseUpdateToOneWithWhereWithoutTransfersToInput = {
    where?: WarehouseWhereInput
    data: XOR<WarehouseUpdateWithoutTransfersToInput, WarehouseUncheckedUpdateWithoutTransfersToInput>
  }

  export type WarehouseUpdateWithoutTransfersToInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    stockItems?: StockItemUpdateManyWithoutWarehouseNestedInput
    transfersFrom?: StockTransferUpdateManyWithoutFromNestedInput
  }

  export type WarehouseUncheckedUpdateWithoutTransfersToInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    branchCode?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    stockItems?: StockItemUncheckedUpdateManyWithoutWarehouseNestedInput
    transfersFrom?: StockTransferUncheckedUpdateManyWithoutFromNestedInput
  }

  export type QuotationCreateWithoutLeadInput = {
    id?: string
    quoteNumber: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    lineItems?: QuotationLineItemCreateNestedManyWithoutQuotationInput
    order?: OrderCreateNestedOneWithoutQuotationInput
  }

  export type QuotationUncheckedCreateWithoutLeadInput = {
    id?: string
    quoteNumber: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    lineItems?: QuotationLineItemUncheckedCreateNestedManyWithoutQuotationInput
    order?: OrderUncheckedCreateNestedOneWithoutQuotationInput
  }

  export type QuotationCreateOrConnectWithoutLeadInput = {
    where: QuotationWhereUniqueInput
    create: XOR<QuotationCreateWithoutLeadInput, QuotationUncheckedCreateWithoutLeadInput>
  }

  export type QuotationCreateManyLeadInputEnvelope = {
    data: QuotationCreateManyLeadInput | QuotationCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type QuotationUpsertWithWhereUniqueWithoutLeadInput = {
    where: QuotationWhereUniqueInput
    update: XOR<QuotationUpdateWithoutLeadInput, QuotationUncheckedUpdateWithoutLeadInput>
    create: XOR<QuotationCreateWithoutLeadInput, QuotationUncheckedCreateWithoutLeadInput>
  }

  export type QuotationUpdateWithWhereUniqueWithoutLeadInput = {
    where: QuotationWhereUniqueInput
    data: XOR<QuotationUpdateWithoutLeadInput, QuotationUncheckedUpdateWithoutLeadInput>
  }

  export type QuotationUpdateManyWithWhereWithoutLeadInput = {
    where: QuotationScalarWhereInput
    data: XOR<QuotationUpdateManyMutationInput, QuotationUncheckedUpdateManyWithoutLeadInput>
  }

  export type QuotationScalarWhereInput = {
    AND?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
    OR?: QuotationScalarWhereInput[]
    NOT?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
    id?: StringFilter<"Quotation"> | string
    quoteNumber?: StringFilter<"Quotation"> | string
    leadId?: StringFilter<"Quotation"> | string
    clientName?: StringFilter<"Quotation"> | string
    clientEmail?: StringFilter<"Quotation"> | string
    status?: EnumQuotationStatusFilter<"Quotation"> | $Enums.QuotationStatus
    subtotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeFilter<"Quotation"> | Date | string
  }

  export type LeadCreateWithoutQuotationsInput = {
    id?: string
    name: string
    company: string
    email: string
    businessType: string
    budget: Decimal | DecimalJsLike | number | string
    targetDate?: Date | string | null
    stage?: $Enums.CrmStage
    createdAt?: Date | string
  }

  export type LeadUncheckedCreateWithoutQuotationsInput = {
    id?: string
    name: string
    company: string
    email: string
    businessType: string
    budget: Decimal | DecimalJsLike | number | string
    targetDate?: Date | string | null
    stage?: $Enums.CrmStage
    createdAt?: Date | string
  }

  export type LeadCreateOrConnectWithoutQuotationsInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutQuotationsInput, LeadUncheckedCreateWithoutQuotationsInput>
  }

  export type QuotationLineItemCreateWithoutQuotationInput = {
    id?: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
    product: ProductCreateNestedOneWithoutQuotationItemsInput
  }

  export type QuotationLineItemUncheckedCreateWithoutQuotationInput = {
    id?: string
    productId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemCreateOrConnectWithoutQuotationInput = {
    where: QuotationLineItemWhereUniqueInput
    create: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput>
  }

  export type QuotationLineItemCreateManyQuotationInputEnvelope = {
    data: QuotationLineItemCreateManyQuotationInput | QuotationLineItemCreateManyQuotationInput[]
    skipDuplicates?: boolean
  }

  export type OrderCreateWithoutQuotationInput = {
    id?: string
    soNumber: string
    poNumber?: string | null
    clientName: string
    status?: $Enums.OrderStatus
    rushOrder?: boolean
    deliveryDate?: Date | string | null
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutQuotationInput = {
    id?: string
    soNumber: string
    poNumber?: string | null
    clientName: string
    status?: $Enums.OrderStatus
    rushOrder?: boolean
    deliveryDate?: Date | string | null
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutQuotationInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutQuotationInput, OrderUncheckedCreateWithoutQuotationInput>
  }

  export type LeadUpsertWithoutQuotationsInput = {
    update: XOR<LeadUpdateWithoutQuotationsInput, LeadUncheckedUpdateWithoutQuotationsInput>
    create: XOR<LeadCreateWithoutQuotationsInput, LeadUncheckedCreateWithoutQuotationsInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutQuotationsInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutQuotationsInput, LeadUncheckedUpdateWithoutQuotationsInput>
  }

  export type LeadUpdateWithoutQuotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    budget?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stage?: EnumCrmStageFieldUpdateOperationsInput | $Enums.CrmStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUncheckedUpdateWithoutQuotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    businessType?: StringFieldUpdateOperationsInput | string
    budget?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stage?: EnumCrmStageFieldUpdateOperationsInput | $Enums.CrmStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput = {
    where: QuotationLineItemWhereUniqueInput
    update: XOR<QuotationLineItemUpdateWithoutQuotationInput, QuotationLineItemUncheckedUpdateWithoutQuotationInput>
    create: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput>
  }

  export type QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput = {
    where: QuotationLineItemWhereUniqueInput
    data: XOR<QuotationLineItemUpdateWithoutQuotationInput, QuotationLineItemUncheckedUpdateWithoutQuotationInput>
  }

  export type QuotationLineItemUpdateManyWithWhereWithoutQuotationInput = {
    where: QuotationLineItemScalarWhereInput
    data: XOR<QuotationLineItemUpdateManyMutationInput, QuotationLineItemUncheckedUpdateManyWithoutQuotationInput>
  }

  export type OrderUpsertWithoutQuotationInput = {
    update: XOR<OrderUpdateWithoutQuotationInput, OrderUncheckedUpdateWithoutQuotationInput>
    create: XOR<OrderCreateWithoutQuotationInput, OrderUncheckedCreateWithoutQuotationInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutQuotationInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutQuotationInput, OrderUncheckedUpdateWithoutQuotationInput>
  }

  export type OrderUpdateWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type QuotationCreateWithoutLineItemsInput = {
    id?: string
    quoteNumber: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    lead: LeadCreateNestedOneWithoutQuotationsInput
    order?: OrderCreateNestedOneWithoutQuotationInput
  }

  export type QuotationUncheckedCreateWithoutLineItemsInput = {
    id?: string
    quoteNumber: string
    leadId: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    order?: OrderUncheckedCreateNestedOneWithoutQuotationInput
  }

  export type QuotationCreateOrConnectWithoutLineItemsInput = {
    where: QuotationWhereUniqueInput
    create: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
  }

  export type ProductCreateWithoutQuotationItemsInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    colorVariants?: ProductColorVariantCreateNestedManyWithoutProductInput
    stockItems?: StockItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutQuotationItemsInput = {
    id?: string
    slug: string
    name: string
    category: string
    material: string
    price: Decimal | DecimalJsLike | number | string
    originalPrice?: Decimal | DecimalJsLike | number | string | null
    badge?: $Enums.ProductBadge | null
    stockStatus?: $Enums.StockStatus
    description: string
    images?: ProductCreateimagesInput | string[]
    rating?: Decimal | DecimalJsLike | number | string
    reviewCount?: number
    widthCm: Decimal | DecimalJsLike | number | string
    depthCm: Decimal | DecimalJsLike | number | string
    heightCm: Decimal | DecimalJsLike | number | string
    weightKg: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    colorVariants?: ProductColorVariantUncheckedCreateNestedManyWithoutProductInput
    stockItems?: StockItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutQuotationItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutQuotationItemsInput, ProductUncheckedCreateWithoutQuotationItemsInput>
  }

  export type QuotationUpsertWithoutLineItemsInput = {
    update: XOR<QuotationUpdateWithoutLineItemsInput, QuotationUncheckedUpdateWithoutLineItemsInput>
    create: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
    where?: QuotationWhereInput
  }

  export type QuotationUpdateToOneWithWhereWithoutLineItemsInput = {
    where?: QuotationWhereInput
    data: XOR<QuotationUpdateWithoutLineItemsInput, QuotationUncheckedUpdateWithoutLineItemsInput>
  }

  export type QuotationUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutQuotationsNestedInput
    order?: OrderUpdateOneWithoutQuotationNestedInput
  }

  export type QuotationUncheckedUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUncheckedUpdateOneWithoutQuotationNestedInput
  }

  export type ProductUpsertWithoutQuotationItemsInput = {
    update: XOR<ProductUpdateWithoutQuotationItemsInput, ProductUncheckedUpdateWithoutQuotationItemsInput>
    create: XOR<ProductCreateWithoutQuotationItemsInput, ProductUncheckedCreateWithoutQuotationItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutQuotationItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutQuotationItemsInput, ProductUncheckedUpdateWithoutQuotationItemsInput>
  }

  export type ProductUpdateWithoutQuotationItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    colorVariants?: ProductColorVariantUpdateManyWithoutProductNestedInput
    stockItems?: StockItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutQuotationItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    material?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    originalPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    badge?: NullableEnumProductBadgeFieldUpdateOperationsInput | $Enums.ProductBadge | null
    stockStatus?: EnumStockStatusFieldUpdateOperationsInput | $Enums.StockStatus
    description?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reviewCount?: IntFieldUpdateOperationsInput | number
    widthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    depthCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    heightCm?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    weightKg?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    colorVariants?: ProductColorVariantUncheckedUpdateManyWithoutProductNestedInput
    stockItems?: StockItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type QuotationCreateWithoutOrderInput = {
    id?: string
    quoteNumber: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    lead: LeadCreateNestedOneWithoutQuotationsInput
    lineItems?: QuotationLineItemCreateNestedManyWithoutQuotationInput
  }

  export type QuotationUncheckedCreateWithoutOrderInput = {
    id?: string
    quoteNumber: string
    leadId: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    lineItems?: QuotationLineItemUncheckedCreateNestedManyWithoutQuotationInput
  }

  export type QuotationCreateOrConnectWithoutOrderInput = {
    where: QuotationWhereUniqueInput
    create: XOR<QuotationCreateWithoutOrderInput, QuotationUncheckedCreateWithoutOrderInput>
  }

  export type PaymentCreateWithoutOrderInput = {
    id?: string
    type: $Enums.PaymentType
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.PaymentStatus
    proofUrl?: string | null
    date?: Date | string
  }

  export type PaymentUncheckedCreateWithoutOrderInput = {
    id?: string
    type: $Enums.PaymentType
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.PaymentStatus
    proofUrl?: string | null
    date?: Date | string
  }

  export type PaymentCreateOrConnectWithoutOrderInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutOrderInput, PaymentUncheckedCreateWithoutOrderInput>
  }

  export type PaymentCreateManyOrderInputEnvelope = {
    data: PaymentCreateManyOrderInput | PaymentCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type QuotationUpsertWithoutOrderInput = {
    update: XOR<QuotationUpdateWithoutOrderInput, QuotationUncheckedUpdateWithoutOrderInput>
    create: XOR<QuotationCreateWithoutOrderInput, QuotationUncheckedCreateWithoutOrderInput>
    where?: QuotationWhereInput
  }

  export type QuotationUpdateToOneWithWhereWithoutOrderInput = {
    where?: QuotationWhereInput
    data: XOR<QuotationUpdateWithoutOrderInput, QuotationUncheckedUpdateWithoutOrderInput>
  }

  export type QuotationUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutQuotationsNestedInput
    lineItems?: QuotationLineItemUpdateManyWithoutQuotationNestedInput
  }

  export type QuotationUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lineItems?: QuotationLineItemUncheckedUpdateManyWithoutQuotationNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutOrderInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutOrderInput, PaymentUncheckedUpdateWithoutOrderInput>
    create: XOR<PaymentCreateWithoutOrderInput, PaymentUncheckedCreateWithoutOrderInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutOrderInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutOrderInput, PaymentUncheckedUpdateWithoutOrderInput>
  }

  export type PaymentUpdateManyWithWhereWithoutOrderInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutOrderInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    orderId?: StringFilter<"Payment"> | string
    type?: EnumPaymentTypeFilter<"Payment"> | $Enums.PaymentType
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    proofUrl?: StringNullableFilter<"Payment"> | string | null
    date?: DateTimeFilter<"Payment"> | Date | string
  }

  export type OrderCreateWithoutPaymentsInput = {
    id?: string
    soNumber: string
    poNumber?: string | null
    clientName: string
    status?: $Enums.OrderStatus
    rushOrder?: boolean
    deliveryDate?: Date | string | null
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    quotation: QuotationCreateNestedOneWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutPaymentsInput = {
    id?: string
    soNumber: string
    poNumber?: string | null
    quotationId: string
    clientName: string
    status?: $Enums.OrderStatus
    rushOrder?: boolean
    deliveryDate?: Date | string | null
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCreateOrConnectWithoutPaymentsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutPaymentsInput, OrderUncheckedCreateWithoutPaymentsInput>
  }

  export type OrderUpsertWithoutPaymentsInput = {
    update: XOR<OrderUpdateWithoutPaymentsInput, OrderUncheckedUpdateWithoutPaymentsInput>
    create: XOR<OrderCreateWithoutPaymentsInput, OrderUncheckedCreateWithoutPaymentsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutPaymentsInput, OrderUncheckedUpdateWithoutPaymentsInput>
  }

  export type OrderUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotation?: QuotationUpdateOneRequiredWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    soNumber?: StringFieldUpdateOperationsInput | string
    poNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quotationId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    rushOrder?: BoolFieldUpdateOperationsInput | boolean
    deliveryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductColorVariantCreateManyProductInput = {
    id?: string
    name: string
    hex: string
  }

  export type StockItemCreateManyProductInput = {
    id?: string
    warehouseId: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuotationLineItemCreateManyProductInput = {
    id?: string
    quotationId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
  }

  export type ProductColorVariantUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hex?: StringFieldUpdateOperationsInput | string
  }

  export type ProductColorVariantUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hex?: StringFieldUpdateOperationsInput | string
  }

  export type ProductColorVariantUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hex?: StringFieldUpdateOperationsInput | string
  }

  export type StockItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutStockItemsNestedInput
    movements?: StockMovementUpdateManyWithoutStockItemNestedInput
  }

  export type StockItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    warehouseId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: StockMovementUncheckedUpdateManyWithoutStockItemNestedInput
  }

  export type StockItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    warehouseId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationLineItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quotation?: QuotationUpdateOneRequiredWithoutLineItemsNestedInput
  }

  export type QuotationLineItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type StockItemCreateManyWarehouseInput = {
    id?: string
    productId: string
    sku: string
    qtyAvailable?: number
    qtyReserved?: number
    qtyInProduction?: number
    minThreshold?: number
    state?: $Enums.StockState
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StockTransferCreateManyFromInput = {
    id?: string
    toWarehouse: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type StockTransferCreateManyToInput = {
    id?: string
    fromWarehouse: string
    productId: string
    quantity: number
    reason?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type StockItemUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutStockItemsNestedInput
    movements?: StockMovementUpdateManyWithoutStockItemNestedInput
  }

  export type StockItemUncheckedUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: StockMovementUncheckedUpdateManyWithoutStockItemNestedInput
  }

  export type StockItemUncheckedUpdateManyWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    qtyAvailable?: IntFieldUpdateOperationsInput | number
    qtyReserved?: IntFieldUpdateOperationsInput | number
    qtyInProduction?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    state?: EnumStockStateFieldUpdateOperationsInput | $Enums.StockState
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockTransferUpdateWithoutFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    to?: WarehouseUpdateOneRequiredWithoutTransfersToNestedInput
  }

  export type StockTransferUncheckedUpdateWithoutFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    toWarehouse?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockTransferUncheckedUpdateManyWithoutFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    toWarehouse?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockTransferUpdateWithoutToInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    from?: WarehouseUpdateOneRequiredWithoutTransfersFromNestedInput
  }

  export type StockTransferUncheckedUpdateWithoutToInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromWarehouse?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockTransferUncheckedUpdateManyWithoutToInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromWarehouse?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementCreateManyStockItemInput = {
    id?: string
    type: $Enums.StockMovementType
    quantity: number
    actor: string
    reference?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateWithoutStockItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType
    quantity?: IntFieldUpdateOperationsInput | number
    actor?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateWithoutStockItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType
    quantity?: IntFieldUpdateOperationsInput | number
    actor?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyWithoutStockItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumStockMovementTypeFieldUpdateOperationsInput | $Enums.StockMovementType
    quantity?: IntFieldUpdateOperationsInput | number
    actor?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationCreateManyLeadInput = {
    id?: string
    quoteNumber: string
    clientName: string
    clientEmail: string
    status?: $Enums.QuotationStatus
    subtotal: Decimal | DecimalJsLike | number | string
    vatAmount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuotationUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lineItems?: QuotationLineItemUpdateManyWithoutQuotationNestedInput
    order?: OrderUpdateOneWithoutQuotationNestedInput
  }

  export type QuotationUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lineItems?: QuotationLineItemUncheckedUpdateManyWithoutQuotationNestedInput
    order?: OrderUncheckedUpdateOneWithoutQuotationNestedInput
  }

  export type QuotationUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    quoteNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientEmail?: StringFieldUpdateOperationsInput | string
    status?: EnumQuotationStatusFieldUpdateOperationsInput | $Enums.QuotationStatus
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationLineItemCreateManyQuotationInput = {
    id?: string
    productId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    dimensions?: string | null
    finish?: string | null
    total: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpdateWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneRequiredWithoutQuotationItemsNestedInput
  }

  export type QuotationLineItemUncheckedUpdateWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dimensions?: NullableStringFieldUpdateOperationsInput | string | null
    finish?: NullableStringFieldUpdateOperationsInput | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PaymentCreateManyOrderInput = {
    id?: string
    type: $Enums.PaymentType
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.PaymentStatus
    proofUrl?: string | null
    date?: Date | string
  }

  export type PaymentUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    proofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    proofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    proofUrl?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}