# Linkopus TypeScript & Node.js Best Practices Guide

**Internal Development Standards - Version 2024**

---

## Table of Contents

1. [TypeScript Fundamentals](#typescript-fundamentals)
2. [Code Style & Patterns](#code-style--patterns)
3. [Microservice Security](#microservice-security)
4. [Configuration Management](#configuration-management)
5. [Mongoose & Database](#mongoose--database)
6. [Error Handling](#error-handling)
7. [API Layer Architecture](#api-layer-architecture)
8. [Testing](#testing)

---

## TypeScript Fundamentals

### Describe Your Data - Avoid `any`

❌ **Bad:**
```typescript
function processData(data: any) {
  return data.value;
}
```

✅ **Good:**
```typescript
type Result = "success" | "failure";

function verifyResult(result: Result) {
  if (result === "success") {
    console.log("Passed");
  } else {
    console.log("Failed");
  }
}
```

### Use Enums for Constants

Export enums once at global level, import where needed.

```typescript
enum EventType {
  Create,
  Delete,
  Update
}

class InfraEvent {
  constructor(event: EventType) {
    if (event === EventType.Create) {
      console.log(`Event Captured: ${event}`);
    }
  }
}

const eventSource: EventType = EventType.Create;
const eventExample = new InfraEvent(eventSource);
```

### Use Interfaces

Interfaces define contracts for classes and ensure type safety.

```typescript
interface BucketProps {
  name: string;
  region: string;
  encryption: boolean;
}

class S3Bucket extends Stack {
  constructor(scope: Construct, props: BucketProps) {
    super(scope);
    console.log(props.name);
  }
}

const myS3Bucket = new S3Bucket(app, {
  name: "my-bucket",
  region: "us-east-1",
  encryption: false
});
```

#### Readonly Properties

```typescript
interface Position {
  readonly latitude: number;
  readonly longitude: number;
}
```

#### Extend Interfaces (Reduce Duplication)

```typescript
interface BaseInterface {
  name: string;
}

interface EncryptedVolume extends BaseInterface {
  keyName: string;
}

interface UnencryptedVolume extends BaseInterface {
  tags: string[];
}
```

---

## Code Style & Patterns

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables & Functions | camelCase | `getUserData`, `totalPrice` |
| Classes & Interfaces | PascalCase | `UserService`, `ClientProps` |
| Interface Members | camelCase | `userName`, `emailAddress` |
| Types & Enums | PascalCase | `UserRole`, `StatusType` |
| Component Files | PascalCase | `UserProfile.tsx` |
| Backend Files | camelCase | `userService.ts`, `jobDao.ts` |

### Destructuring

✅ **Good:**
```typescript
const { objname, scope } = object;
```

❌ **Bad:**
```typescript
const oName = object.objname;
const oScop = object.scope;
```

### Variable Declarations

**🚫 NEVER use `var`**

✅ **Prefer `const`:**
```typescript
const userName = "Ahmed";
const total = calculateTotal(price, quantity);
```

✅ **Use `let` when reassignment needed:**
```typescript
let counter = 0;
counter++;
```

### Function Declarations

✅ **Good (Arrow Functions):**
```typescript
const calculateTotal = (price: number, quantity: number) => price * quantity;
```

❌ **Bad (Traditional Functions):**
```typescript
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

### Import Statements

✅ **Good (ES6 Modules):**
```typescript
import { User } from './models/user';
import { calculateTotal } from './utils/math';
```

❌ **Bad (CommonJS):**
```typescript
const User = require('./models/user');
```

### Collections - Use Set and Map

✅ **Good:**
```typescript
const uniqueIds = new Set<number>();
const userMap = new Map<number, User>();
```

❌ **Bad:**
```typescript
const uniqueIds = [];
const userMap = {};
```

### Async/Await

✅ **Good:**
```typescript
const fetchData = async (): Promise<Data> => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
};
```

❌ **Bad (Callbacks):**
```typescript
function fetchData(callback) {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.error(error));
}
```

### Object Shorthand

✅ **Good:**
```typescript
const name = 'Alice';
const age = 30;
const user = { name, age };
```

❌ **Bad:**
```typescript
const user = { name: name, age: age };
```

---

## TypeScript Utility Types

### Partial<T> - All Properties Optional

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const updateUser = (id: number, newData: Partial<User>) => {
  // newData can have any or all of User's properties
};
```

### Required<T> - All Properties Required

```typescript
interface User {
  id: number;
  name?: string;
  email?: string;
}

const user: Required<User> = {
  id: 1,
  name: "John",
  email: "john@example.com"
};
```

### Readonly<T> - Immutable Properties

```typescript
interface User {
  id: number;
  name: string;
}

const user: Readonly<User> = {
  id: 1,
  name: "John"
};

// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property
```

### Record<K, T> - Key-Value Pairs

```typescript
interface User {
  id: number;
  name: string;
}

const users: Record<number, User> = {
  1: { id: 1, name: "John" },
  2: { id: 2, name: "Jane" }
};
```

### Pick<T, K> - Select Properties

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;

const user: UserPreview = {
  id: 1,
  name: "John"
  // email is not needed
};
```

### Omit<T, K> - Exclude Properties

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserWithoutEmail = Omit<User, 'email'>;

const user: UserWithoutEmail = {
  id: 1,
  name: "John"
  // email is omitted
};
```

### NonNullable<T> - Remove null/undefined

```typescript
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

---

## Microservice Security

### Access Control Architecture

```
Client Request → NGINX (Gateway) → Microservice
                    ↓
              Adds Headers:
              - email
              - role
```

**All microservices are inaccessible via public network**  
**NGINX is the sole entry point**

### Request Headers

Every API endpoint expects:
- `email` header - User identifier
- `role` header - User role (Admin, User, etc.)

These headers are **NOT** set by client, but enriched by NGINX from the authorized token.

### Guard Implementation

At route level, verify email and role before data access:

```typescript
// Only Admin role has access to all client data
// Other users only see their own data based on email header
```

### Data Protection Rules

1. Return data only to the email specified in request header
2. Verify requester has appropriate role
3. Hash all passwords and API keys in database
4. Keep hash key secret (inject via GitHub Actions during deployment)

---

## Configuration Management

### Secrets vs Configuration

**Secrets (Environment Variables):**
- Passwords
- Certificates  
- API keys
- Environment-specific configs (NGINX_HOST)

**Configuration (Hardcoded):**
- All other settings
- Application constants
- Feature flags

### Secret Naming Guidelines

✅ **Good (Common Names):**
```bash
MONGODB_URI
NGINX_HOST
API_KEY
```

❌ **Bad (Environment-Specific in Code):**
```bash
DEV_NGINX_HOST
STG_NGINX_HOST
PROD_NGINX_HOST
```

**How it works:**
- Secrets stored at GitHub company level with environment prefixes
- GitHub Actions appends environment-specific prefixes
- Codebase always uses common names

### Secret Management Process

⚠️ **Every secret update must be approved by @Mohammed ELHALOUI**

**Process:**
1. Create Jira ticket
2. Assign to @Mohammed ELHALOUI
3. Send details via kchat

### Configuration File Structure

✅ **Good Configuration:**

```typescript
interface Config {
  server: {
    port: number;
    mongodbUri: string;
  };
  apiKeys: {
    publicKey: string;
    privateKey: string;
  };
  chatGpt: {
    chatGpt3: string;
    chatGpt4: string;
    chatGptVision: string;
  };
  limits: {
    maxTokensGpt4: number;
    maxTokensGpt3: number;
    maxUploadedFiles: number;
  };
  coefficients: {
    gpt4InputCoefficient: number;
    gpt4OutputCoefficient: number;
    gpt3InputCoefficient: number;
    gpt3OutputCoefficient: number;
  };
  mimeTypes: string[];
}

const config: Config = {
  server: {
    port: process.env.PORT ?? 3001,
    mongodbUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/aiservice",
  },
  apiKeys: {
    publicKey: process.env.API_KEYS_ENCRYPTION_PUBLIC_KEY ?? "",
    privateKey: process.env.API_KEYS_DECRYPTION_PRIVATE_KEY ?? "",
  },
  chatGpt: {
    chatGpt3: process.env.CHATGPT_3 ?? "",
    chatGpt4: process.env.CHATGPT_4 ?? "",
    chatGptVision: process.env.CHATGPT_4_VISION ?? "",
  },
  limits: {
    maxTokensGpt4: parseInt(process.env.MAXTOKENS_GPT4 ?? "4000"),
    maxTokensGpt3: parseInt(process.env.MAXTOKENS_GPT3 ?? "4000"),
    maxUploadedFiles: parseInt(process.env.MAX_UPLOADED_FILES ?? "10"),
  },
  coefficients: {
    gpt4InputCoefficient: parseFloat(process.env.GPT4_COEF ?? "0.00001"),
    gpt4OutputCoefficient: parseFloat(process.env.GPT4_OUTPUT_COEF ?? "0.00003"),
    gpt3InputCoefficient: parseFloat(process.env.GPT3_COEF ?? "0.0000005"),
    gpt3OutputCoefficient: parseFloat(process.env.GPT3_OUTPUT_COEF ?? "0.0000015"),
  },
  mimeTypes: ["image/gif", "image/png", "image/jpeg", "image/webp"],
};
```

### Configuration Anti-Patterns

❌ **Bad Configuration:**

```typescript
const config: Config = {
  nginxHost: import.meta.env.VITE_NGINX_HOST ?? "82.208.22.64", // ❌ Environment-specific IP
  userMetaDataRoute: import.meta.env.VITE_USER_META_DATA_ROUTE ?? "/api/usermetadata", // ❌ Routes in config
  documentRoute: import.meta.env.VITE_DOCUMENT_ROUTE ?? "/internal/api/documents", // ❌ Routes in config
  basename: "company/", // ❌ Unclear purpose
};
```

**Why it's bad:**
1. **Hardcoded environment-specific values** (IP addresses) - won't work in other environments
2. **Routes in config** - should be in API service files
3. **Default values hiding issues** - required configs should throw errors if missing

### Required Configuration Pattern

```typescript
const requiredConfig = () => {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    throw new Error("MONGODB_URI is required. Cannot start application.");
  }
  return dbUri;
};

const config = {
  server: {
    mongodbUri: requiredConfig(),
  }
};
```

---

## Linter Configuration

### ESLint Setup

All microservices must use the same linter configuration.

**.eslintrc.json:**

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-misused-promises": "off"
  },
  "ignorePatterns": ["node_modules/"]
}
```

### Install Dependencies

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

### Run Linter

```bash
npx eslint --fix 'src/**/*.{js,ts,jsx,tsx}'
```

⚠️ **Important:** First-time linting creates significant changes. Make a separate commit/PR for linting changes only.

---

## Dependencies & Service Communication

### Microservice Dependencies

Services often depend on other services:
- Parser depends on AI service
- Resume depends on Parser service

### Communication Rules

**Always use NGINX_HOST environment variable:**

```typescript
// ✅ Correct
const response = await axios.post(
  `https://${config.server.nginxHost}/internal/api/ai/callCommand`,
  data
);

// ❌ Wrong - Hardcoded URL
const response = await axios.post(
  `https://192.168.1.100/api/ai/callCommand`,
  data
);
```

---

## Code Quality

### Remove Dead Code

⚠️ **Clean your code:**
- Unused imports
- Dead code
- Unused variables
- Unnecessary comments

### Swagger Documentation

**Keep Swagger up-to-date:**
- Update on every API change
- Document all endpoints
- Include request/response examples

---

## Request/Response Data Flow

### Principle of Minimal Data Transfer

**Each layer (Frontend → Server → Database) should only transfer necessary data.**

### Use Partial<T> for Subsets

❌ **Bad (Creating New Interfaces):**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface UserBasicInfo {
  name: string;
  email: string;
}
```

✅ **Good (Using Partial):**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

const getUserBasicInfo = async (userId: string): Promise<Partial<User> | null> => {
  return await UserModel.findOne(
    { _id: userId, isDeleted: false },
    { name: 1, email: 1 }  // Only request needed fields
  ).lean();
};
```

---

## Mongoose & Database

### Common Fields Interface

All collections must extend `CommonFields` (import from `@linkopus/common-messages`):

```typescript
interface CommonFields {
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
```

### Schema Definition Pattern

```typescript
// 1. Interface definition
interface Product extends CommonFields {
  productId: string;
  name: string;
  price: number;
}

// 2. Schema definition
const ProductSchema = new Schema<Product>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: String },
    deletedAt: { type: Date },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

// 3. Model creation
const ProductModel = model<Product>("Product", ProductSchema);
```

### Nested Schema Pattern

```typescript
// Nested interfaces
interface Address {
  street: string;
  city: string;
  country: string;
}

interface Customer extends CommonFields {
  customerId: string;
  name: string;
  address: Address;
}

// Nested schema
const AddressSchema = new Schema<Address>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
);

// Main schema with nested schema
const CustomerSchema = new Schema<Customer>({
  customerId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: AddressSchema, required: true },
}, { timestamps: true });
```

---

## Error Handling

### Error Types

1. **Controlled Errors**: Explicit ApiError throws
2. **Uncontrolled Errors**: Unexpected errors from libraries

### Implementation Structure

```typescript
// index.ts
import { errorHandlerMiddleware } from "@linkopus/common-messages";

const app = express();
app.use("/jobs", Guard(allRoles), jobRoutes);
app.use(errorHandlerMiddleware(logger));
```

```typescript
// route.ts
import { handleAsync } from "@linkopus/common-messages";

router.put("/:jobId/starred", handleAsync(JobController.updateJobStarred));
```

```typescript
// controller.ts
export const updateJobStarred = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { jobId } = req.params;
  const owner = req.headers.email as string;
  
  const updatedJob = await jobService.updateJobStarred(jobId, owner);
  
  if (updatedJob instanceof ApiError) throw updatedJob;
  
  res.status(StatusCode.OK).json({ 
    message: SuccessTypes.JOB_STARRED_UPDATED_SUCCESSFULLY 
  });
};
```

```typescript
// service.ts
updateJobStarred = async (
  jobId: string,
  owner: string,
): Promise<ApiError | boolean> => {
  const updatedJob = await jobDao.updateJobStarred(jobId, owner);
  
  if (!updatedJob) {
    return new ApiError(
      {
        name: ErrorTypes.JOB_NOT_FOUND,
        status: StatusCode.NOT_FOUND,
        details: `Job not found: ${jobId}`,
      },
      logger,
    );
  }
  
  return updatedJob;
};
```

### Request Validation with Joi

```typescript
// validators/jobValidator.ts
export const validateCandidateBody = Joi.object({
  targetStage: Joi.string().required(),
  targetJobId: Joi.string().required(),
  emails: Joi.array().required().items(emailValidator),
});
```

```typescript
// controller
import { validateSchema } from "@linkopus/common-messages";

const validate = validateSchema(logger);

// In controller method
const validationResult = validate(req.body, validateCandidateBody);
if (validationResult instanceof ApiError) {
  throw validationResult;
}
```

---

## Data Access Operations

### Understanding Mongoose Parameters

Most Mongoose methods follow this pattern:

```typescript
Model.findOne(
  filter,     // What to search for
  projection, // What fields to return
  options     // Additional settings (sort, limit, etc.)
)
```

### 1. Filter (First Parameter)

```typescript
// Simple equality
{ isDeleted: false }

// Comparison operators
{ age: { $gt: 18 } }

// In array
{ status: { $in: ['A', 'B'] } }

// OR condition
{ 
  $or: [
    { owner: "user1" },
    { teamId: "team1" }
  ]
}
```

### 2. Projection (Second Parameter)

```typescript
// Include specific fields
{
  name: 1,
  email: 1,
  _id: 0  // Explicitly exclude _id
}

// Nested fields
{
  "profile.firstName": 1,
  "profile.lastName": 1
}
```

### 3. Options (Third Parameter)

```typescript
{
  sort: { createdAt: -1 },  // Sort descending
  limit: 10,                // Limit results
  skip: 20                  // Skip first 20
}
```

### Read Operations Examples

```typescript
class UserDAO {
  // Simple find with projection
  async getUserBasicInfo(userId: string): Promise<Partial<User> | null> {
    return await UserModel.findOne(
      { _id: userId, isDeleted: false },
      { name: 1, email: 1 }
    ).lean();
  }

  // Find with all parameters
  async getRecentActiveUsers(teamId: string): Promise<User[]> {
    return await UserModel.find(
      { teamId, isActive: true },
      { name: 1, lastLogin: 1 },
      { 
        sort: { lastLogin: -1 },
        limit: 10 
      }
    ).lean();
  }

  // Complex filter
  async getTeamManagers(): Promise<User[]> {
    return await UserModel.find(
      {
        role: "manager",
        isDeleted: false,
        lastLogin: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      { name: 1, email: 1, teamId: 1 }
    ).lean();
  }
}
```

### Update Operations

```typescript
class ProductDAO {
  // updateOne
  async updateProduct(id: string, data: Partial<Product>): Promise<boolean> {
    const result = await ProductModel.updateOne(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true }
    );
    return result.modifiedCount > 0;
  }

  // updateMany
  async deactivateOldProducts(date: Date): Promise<boolean> {
    const result = await ProductModel.updateMany(
      { 
        lastUpdated: { $lt: date },
        isActive: true 
      },
      { 
        $set: { isActive: false }
      }
    );
    return result.modifiedCount > 0;
  }
}
```

### Delete Operations (Soft Delete Only)

⚠️ **WARNING: We ONLY use soft deletes. Never use deleteOne or deleteMany.**

```typescript
class OrderDAO {
  // Single soft delete
  async deleteOrder(orderId: string, deletedBy: string): Promise<boolean> {
    const result = await OrderModel.updateOne(
      { _id: orderId, isDeleted: false },
      { 
        $set: {
          isDeleted: true,
          deletedBy: deletedBy,
          deletedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Bulk soft delete
  async deleteOldOrders(date: Date, deletedBy: string): Promise<boolean> {
    const result = await OrderModel.updateMany(
      {
        createdAt: { $lt: date },
        isDeleted: false
      },
      {
        $set: {
          isDeleted: true,
          deletedBy: deletedBy,
          deletedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}
```

**Key rules:**
- Always use `updateOne` or `updateMany` with `isDeleted` flag
- Include `deletedBy` and `deletedAt` fields
- Always check `isDeleted: false` in filter
- Never use MongoDB's delete operations

### Aggregation Pipelines

Create separate pipeline files in `dao/pipelines/<model>Pipelines.ts`:

```typescript
// dao/pipelines/jobPipelines.ts
export const getJobsOverviewPipeline = (owner: string, ownerTeam: string) => [
  {
    $match: {
      $or: [{ owner }, { ownerTeam }],
      isDeleted: false
    }
  },
  {
    $lookup: {
      from: "candidates",
      localField: "jobId",
      foreignField: "jobId",
      as: "candidates"
    }
  },
  {
    $project: {
      jobId: 1,
      title: "$jobDetails.title",
      candidateCount: { $size: "$candidates" }
    }
  }
];
```

```typescript
// dao/JobDao.ts
import { getJobsOverviewPipeline } from "./pipelines/jobPipelines";

class JobDAO {
  async getJobsOverview(
    owner: string,
    ownerTeam: string
  ): Promise<JobOverview[]> {
    const pipeline = getJobsOverviewPipeline(owner, ownerTeam);
    return await JobModel.aggregate<JobOverview>(pipeline);
  }
}
```

### Data Access Best Practices

✅ **Always use `.lean()` for read operations** (unless you need Mongoose document features)  
✅ **Include `isDeleted: false` in filters** when soft delete is used  
✅ **Use projection to minimize data transfer**  
✅ **Use TypeScript types for type safety**  
✅ **Return boolean for modification operations** based on `modifiedCount` or `deletedCount`

---

## Microservice HTTP Communication

### Communication Rules

All inter-service HTTP calls must:
1. Be defined in `services/api/<service>_api.ts`
2. Use `/internal/api` prefix in URL path
3. Go through NGINX (no direct service-to-service calls)

### Correct Implementation

```typescript
// services/api/ai_api.ts
import config from "@config/config";
import { ApiError } from "@linkopus/common-messages";
import axios from "axios";

// ✅ CORRECT: Using /internal/api prefix
export const sendToAIMsAndStore = async (
  parsedData: string,
  command: string,
  email: string,
  role: string,
): Promise<object | ApiError> => {
  const response = await axios.post(
    `https://${config.server.nginxHost}/internal/api/ai/callCommand`,
    {
      command,
      textInput: parsedData,
    },
  );
  return JSON.parse(response.data.response.data as string);
};
```

### Incorrect Implementation

```typescript
// ❌ INCORRECT: Missing /internal/api prefix
export const sendToAIMsAndStore = async () => {
  const response = await axios.post(
    `https://${config.server.nginxHost}/api/ai/callCommand`,  // Will fail authentication
    ...
  );
};
```

**Why `/internal/api` is required:**
- NGINX blocks inter-service requests without this prefix
- Ensures proper authentication through NGINX layer
- Prevents unauthorized direct service access

---

## API Layer Architecture

### Layer Hierarchy

```
Controllers (Top Layer)
      ↓
   Services
      ↓
    DAOs
      ↓
   Models (Bottom Layer)
```

### Models Layer

**Mongoose Models:**
- Can ONLY be used in DAOs
- No other layer should import Mongoose models

**Interface/Type Models:**
- Can be used across all layers

```typescript
// models/user.ts
export interface User extends CommonFields {
  email: string;
  name: string;
  role: UserRole;
  preferences?: UserPreferences;
}

// Can be used in:
// - services/dto/userService.ts
// - controllers/userController.ts
// - components/UserProfile.tsx
```

### DAO Layer

**Rules:**
- Must be classes
- Only place for Mongoose operations
- Only place where Mongoose models can be used
- Should only be used by Services
- Export instance directly

```typescript
// dao/userDao.ts
class UserDAO {
  async createUser(userData: Partial<User>): Promise<boolean> {
    const result = await UserModel.create(userData);
    return !!result;
  }

  async findUser(id: string): Promise<User | null> {
    return await UserModel.findOne({ _id: id }).lean();
  }
}

export default new UserDAO();  // Export instance
```

### Service Layer

Services are divided into two categories:

#### 1. DTO Services (Data Transfer Services)

- Handle basic CRUD operations
- Direct interaction with DAOs
- Simple data transformations
- Located in `services/dto/`

```typescript
// services/dto/userService.ts
class UserDTOService {
  async createUser(userData: CreateUserDTO): Promise<ApiError | User> {
    return await userDao.createUser(userData);
  }
}

export default new UserDTOService();
```

#### 2. Business Services (Business Logic Services)

- Implement complex business logic
- Can use multiple DTO services and other business services
- Organized by domain/functionality

**Folder structure:**
```
services/
├── dto/               # DTO services
├── api/               # HTTP client operations
├── events/
│   ├── publishers/    # Message queue publishers
│   └── consumers/     # Message queue consumers
└── workflow/          # Business process flows
```

**Example:**

```typescript
// services/workflow/recruitmentService.ts
class RecruitmentService {
  async startRecruitmentProcess(jobId: string): Promise<ApiError | boolean> {
    // Use DTO service
    const job = await jobDTOService.getJob(jobId);
    if (job instanceof ApiError) return job;

    // Use another business service
    const notificationResult = await notificationService.notifyTeam(job);

    // Use event publisher
    await recruitmentEventPublisher.publishJobOpened(job);

    return true;
  }
}

export default new RecruitmentService();
```

### Controller Layer

**Rules:**
- Top-most layer
- Functions only, NOT classes
- Handles HTTP requests/responses
- Uses Services only
- Cannot use DAOs or Models
- Handles error throwing

```typescript
// controllers/orderController.ts
import orderService from '../services/orderService';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.createOrder(req.body);
  
  if (result instanceof ApiError) throw result;
  
  res.status(StatusCode.CREATED).json({
    message: SuccessTypes.ORDER_CREATED
  });
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  const result = await orderService.getOrder(req.params.id);
  
  if (result instanceof ApiError) throw result;
  
  res.status(StatusCode.OK).json(result);
};
```

### Cross-Layer Communication

**Return types by layer:**
- **DAOs**: Return raw data or `null`
- **Services**: Return `data | ApiError`
- **Controllers**: Handle throws and responses

```typescript
// Controller function
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const result = await userService.updateUser(req.params.id, req.body);
  if (result instanceof ApiError) throw result;
  res.status(StatusCode.OK).json({ message: SuccessTypes.USER_UPDATED });
};

// Service class
class UserService {
  async updateUser(id: string, data: UpdateUserDTO): Promise<ApiError | boolean> {
    const user = await userDao.findUser(id);
    if (!user) {
      return new ApiError({
        name: ErrorTypes.USER_NOT_FOUND,
        status: StatusCode.NOT_FOUND
      }, logger);
    }
    return await userDao.updateUser(id, data);
  }
}

export default new UserService();

// DAO class
class UserDAO {
  async updateUser(id: string, data: Partial<User>): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: id, isDeleted: false },
      { $set: data }
    );
    return result.modifiedCount > 0;
  }
}

export default new UserDAO();
```

### Layer Rules Summary

✅ **Always export class instances** directly from DAOs and Services  
✅ **Controllers are functions**, not classes  
✅ **Each layer only interacts with immediate neighbors**  
✅ **Never skip layers** or use layers out of order  
✅ **Keep business logic in Services**  

---

## Testing

### Mock Data Creation

Create mock factories for complex types:

```typescript
// src/mock/mockClient.ts
type ClientDetailsOverrides = Partial<Client> & {
  contacts?: Partial<Client["contacts"][number]>[]
};

export const createMockClient = (
  overrides: ClientDetailsOverrides = {},
): Client => {
  const defaultClient: Client = {
    logo: "https://example.com/logo.png",
    companyName: "Test Company",
    status: ClientStatusEnum.ACTIVE,
    contacts: [
      {
        fullName: "John Doe",
        email: "john@example.com",
        contactType: ContactType.PRIMARY,
      }
    ],
    owner: "admin@test.com",
  };

  return {
    ...defaultClient,
    ...overrides,
    contacts: overrides.contacts?.map(contact => ({
      ...defaultClient.contacts[0],
      ...contact,
    })) ?? defaultClient.contacts,
  };
};
```

### Use Cases

**Testing with defaults:**

```typescript
describe('ClientService', () => {
  it('should create a client with default values', () => {
    const client = createMockClient();
    expect(client.status).toBe(ClientStatusEnum.ACTIVE);
    expect(client.contacts).toHaveLength(1);
  });
});
```

**Testing with overrides:**

```typescript
it('should handle inactive client', () => {
  const inactiveClient = createMockClient({
    status: ClientStatusEnum.INACTIVE,
    companyName: "Inactive Corp"
  });
  
  expect(inactiveClient.status).toBe(ClientStatusEnum.INACTIVE);
  expect(inactiveClient.companyName).toBe("Inactive Corp");
  expect(inactiveClient.contacts).toHaveLength(1); // Default remains
});
```

---

## Quick Reference

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Models | PascalCase | `User.ts`, `Product.ts` |
| DAOs | camelCase + Dao suffix | `userDao.ts`, `jobDao.ts` |
| Services | camelCase + Service suffix | `userService.ts`, `authService.ts` |
| Controllers | camelCase + Controller suffix | `authController.ts` |
| Routes | camelCase + .routes | `user.routes.ts` |
| Pipelines | camelCase + Pipelines | `jobPipelines.ts` |

### Import Order

```typescript
// 1. External packages
import express from 'express';
import { Schema, model } from 'mongoose';

// 2. Internal utilities/config
import config from '@config/config';
import { logger } from '@utils/logger';

// 3. Types/Interfaces
import { User, UserRole } from '@models/user';

// 4. Services/DAOs
import userDao from '@dao/userDao';
import authService from '@services/authService';
```

---

**Document Version**: 2024  
**Maintained by**: Linkopus Development Team  
**Last Updated**: February 2026
