# 路由状态查询系统

## docker创建mongoDB数据库

## 编译

```
cd client
npm install
npm run build
```

## 依赖下载

```
npm install
```

## 初始化数据库

```
node bin/migrate
```

## 启动项目

```
npm start
```

## debug启动

```
DEBUG=ui:* node bin/www
```

## 测试

```
npm test
```

## 插入数据(执行一次即可)

```
node bin/insert
```
