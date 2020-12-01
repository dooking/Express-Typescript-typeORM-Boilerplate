# Typescript-Express-typeORM-Boilerplate
## ✔️ 목표

→ TypeScript + Express + typeORM을 이용하여 서버 세팅하기

## 🔨 프로젝트 생성 및 기초 설정

### 1. `**npm init —y**` : 기초 환경 설정

### 2. Express 모듈 설치

```tsx
npm install dotenv express morgan http-errors debug cors
```

### 3. Typescript 모듈 설치

```tsx
npm install -D @types/cors @types/debug @types/dotenv @types/express @types/http-errors @types/morgan @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-config-prettier eslint-plugin-import eslint-plugin-prettier nodemon prettier typescript ts-node
```

### 4. typeORM 설치

```tsx
npm i typeorm mysql2

// ormconfig.json파일이 생성되고, tsconfig.json 파일이 수정
typeorm init --database mysql
```

### 5. ormconfig.json 파일

```tsx
{
  "type": "mysql",
  "host": localhost,
  "port": port,
  "username": name,
  "password": password,
  "database": db,
  "synchronize": true,
  "logging": false,
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
}
```

### 6. tsconfig.json 파일

```tsx
{
  // 기본 타입정의 라이브러리를 어떤 것을 사용할 것인지
  "compilerOptions": {
    "lib": ["es5", "es6"],
    // 결과물을 어떤 버전으로 할 것인지
    "target": "es2015",
    // 컴파일 된 모듈의 결과물을 어떤 모듈 시스템으로 할 것인지
    "module": "commonjs",
    // ts소스에서 모듈을 사용하는 방식
    "moduleResolution": "node",
    // 컴파일된 js파일을 어디에 둘 것인지
    "outDir": "./dist",
    // TS타입 체크를 엄격할게 할 것인지. 다양한 세부옵션이 있음
    "strict": true,
    // TypeORM 사용 시에 decoration 관련 옵션
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true
  },
  // 어디에 있는 파일을 컴파일 할 것인지
  "include": ["src/**/*"],
  // 컴파일에서 제외되는 파일들
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 7. lint 설정

```tsx
// .prettierrc.json
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "printWidth": 80,
  "arrowParens": "always",
  "bracketSpacing": true
}
```

```tsx
// .babelrc.json
{
  "presets": ["@babel/preset-env"]
}
```

```tsx
// .eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "airbnb-base",
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": { "prettier/prettier": "error" }
}
```

### 8. 전체 디렉토리 구조

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/561695e1-4eb1-449e-a84d-0cffc7bca725/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/561695e1-4eb1-449e-a84d-0cffc7bca725/Untitled.png)

### 9. app.ts 작성

```tsx
import 'reflect-metadata'
import { createConnection, Connection } from 'typeorm'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import 'dotenv/config'

// Import Routers
import router from './router/index'
// Connect typeORM mysql
createConnection()
  .then(async (connection: Connection) =>
    console.log('Entity connected : ', connection.isConnected),
  )
  .catch((err: Error) => console.log('Entity connection error : ', err))

// Create express server
const app = express()

// middlewares
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(morgan('dev'))
app.use(
  cors({
    origin: [`${process.env.TEST_IP}`],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

// Routes
app.use('/', router)

app.listen(app.get('port'), () => {
  console.log('server listening at on port %d', app.get('port'))
})
export default app
```

### 10. typeORM을 이용하여 모델 작성

→ 다음과 같은 테이블을 생성하는 코드 작성

→ OneToMany 속성에 `**onDelete: 'CASCADE'**` 옵션 추가!

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5182e197-e94d-4c29-8b5b-51f4e4ddff7b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5182e197-e94d-4c29-8b5b-51f4e4ddff7b/Untitled.png)

```tsx
// entity/user.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm'
import { Favorites } from './favorites'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('varchar', { length: 45 })
  userId!: string

  @Column('varchar', { length: 45 })
  nickName!: string

  @Column()
  profileUrl!: string

  @OneToMany(() => Favorites, (favorites: any) => favorites.user, {
    onDelete: 'CASCADE',
  })
  favorites!: Favorites[]
}
```

### 11. Query 작성

→ User 모델에서 nickName이 'java'인 row들을 추출해보는 작업을 해보자!

→ 다음과 같이 결과가 잘 나오는 것을 확인할 수 있다👀

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bb196634-08d4-4476-a127-206326c1bc11/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bb196634-08d4-4476-a127-206326c1bc11/Untitled.png)

```tsx
// router/index.ts
import { Router } from 'express'
import { User } from '../entity/user'
const router = Router()

router.get('/', async (req, res, next) => {
  const users = await User.find({ nickName: 'java' })
  console.log('users : ', users)
  res.send('world')
})

export default router
```
